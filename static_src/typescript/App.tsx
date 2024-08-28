import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLexWebUiLoader } from 'utils/lex-web-ui';
import { getFingerprint } from 'utils/fingerprint';
import LexChatPanel from 'components/LexChatPanel';
import ServiceUnavailablePanel from 'components/ServiceUnavailablePanel';
import GeoBlocked from 'components/GeoBlocked';
import FullScreenPage from 'components/FullScreenPage';
import { useLocalStorage, useNetworkStatus } from 'utils/hooks';
import NetworkIssue from 'components/NetworkIssue';
import NetworkDisconnected from 'components/NetworkDisconnected';
import Banner from 'components/Banner';
import ServerErrorPanel from 'components/ServerErrorPanel';
import { dataLayerPush } from 'utils/dataLayer';
import ChatScreen from './screens/ChatScreen';
import WaitingScreen from './screens/WaitingScreen';
import LandingScreen from './screens/LandingScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import type { RootState } from './store';
import { setAmazonConnectSession, setScreen } from './slices/webchatSlice';
import config from './config';

const App = () => {
    const lexWebUiLoader = useLexWebUiLoader();
    const dispatch = useDispatch();

    const {
        amazonConnectContactId,
        amazonConnectParticipantId,
        amazonConnectParticipantToken,
        screen,
        chatEnded,
        sessionEnded,
        lexWebUiStatus,
        failedToReconnect,
        failedToEstablish,
    } = useSelector((state: RootState) => state.webchat);

    const { feedbackStatus } = useSelector(
        (state: RootState) => state.feedback,
    );

    // The queue is available if it is open and there are agents staffed.
    const { isOpen, isAtQueueLimit, agentsStaffed } = useSelector(
        (state: RootState) => state.queue,
    );
    const isQueueAvailable =
        isOpen &&
        agentsStaffed !== null &&
        agentsStaffed > 0 &&
        !isAtQueueLimit;

    /**
     * Send GA event if the queue is not available
     * */
    useEffect(() => {
        // Explicitly check isQueueAvailable as `false` because `null` means the
        // queue status is still unknown.
        if (isQueueAvailable === false) {
            if (!isOpen) {
                dataLayerPush({
                    event: 'chatError',
                    errorMessage: 'queue_closed_on_load',
                });
            } else if (agentsStaffed === 0) {
                dataLayerPush({
                    event: 'chatError',
                    errorMessage: 'queue_not_staffed_on_load',
                });
            } else if (isAtQueueLimit) {
                dataLayerPush({
                    event: 'chatError',
                    errorMessage: 'queue_full_on_load',
                });
            }
        }
    }, [agentsStaffed, isAtQueueLimit, isOpen, isQueueAvailable]);

    /**
     * Loading the LexWebUi
     *
     * Load the LexWebUi when the user enters the waiting screen. This will put
     * the user in the queue.
     *
     * During a reconnection attempt, the chat screen is loaded before the
     * LexWebUi iframe is. In this case, immediately load the LexWebUi.
     *
     * */
    useEffect(() => {
        if (
            ['waiting', 'chat'].includes(screen) &&
            lexWebUiStatus === 'unloaded'
        ) {
            getFingerprint().then((fingerprint) => {
                // The LexWebUi will mount itself to the #lex-web-ui-iframe div
                const attributes = {
                    fingerprintId: fingerprint.visitorId,
                    ipAddress: fingerprint.ip,
                    browserName: fingerprint.browserName,
                    browserVersion: fingerprint.browserVersion,
                    os: fingerprint.os,
                    osVersion: fingerprint.osVersion,
                };

                if (
                    amazonConnectContactId &&
                    amazonConnectParticipantId &&
                    amazonConnectParticipantToken
                ) {
                    // If there is an existing Amazon Connect session, pass the
                    // session details to the LexWebUi to reconnect the chat.
                    lexWebUiLoader.load({
                        sessionAttributes: {
                            ...attributes,
                            contactId: amazonConnectContactId,
                            participantId: amazonConnectParticipantId,
                            participantToken: amazonConnectParticipantToken,
                        },
                    });
                } else {
                    // If there is no existing Amazon Connect session, start a new
                    // chat session.
                    // NB: Do not pass null session details to LexWebUi or it will
                    // crash.
                    lexWebUiLoader.load({ sessionAttributes: attributes });
                }
            });
        }
    }, [
        amazonConnectContactId,
        amazonConnectParticipantId,
        amazonConnectParticipantToken,
        lexWebUiLoader,
        lexWebUiStatus,
        screen,
    ]);

    /**
     * Session ending handling
     *
     * This redirects the user to Samaritans.org or the feedback form
     * depending on if the caller has decided to leave feedback or not.
     */

    useEffect(() => {
        if (sessionEnded) {
            // If the session has ended but the feedbackStatus is pending,
            // wait for the feedback to be submitted before redirecting.
            // (aka wait for the feedbackStatus to change to fulfilled or
            // rejected)
            if (['fulfilled', 'rejected'].includes(feedbackStatus)) {
                // If the feedback has been submitted, redirect to the feedback
                // form.
                // If the feedback fails to submit, redirect to the feedback
                // form anyway. We lose the distress scores but the user can
                // still submit feedback.
                window.location.href =
                    'https://www.samaritans.org/webchat-feedback-form/' +
                    `?chat_id=${amazonConnectContactId}`;
            } else if (feedbackStatus === 'idle') {
                // If the session has ended without an attempt to submit
                // feedback (feedbackStatus is idle), redirect to
                // Samaritans.org.
                window.location.href = 'https://www.samaritans.org/';
            }
        }
    }, [sessionEnded, feedbackStatus, amazonConnectContactId]);

    /**
     * Session reconnection handling
     *
     * This works by storing the last ping of the chat in local storage. When
     * the app loads and the last ping from local storage is less than 2
     * minutes ago, the chat will reconnect. Otherwise, the chat will start a
     * new session.
     *
     * The keys used in local storage are prefixed with the queue name to
     * prevent conflicts between different instances of the webchat on
     * different queues.
     */

    const [sessionLastPing, setSessionLastPing] = useLocalStorage(
        `${config.queueName}:sessionLastPing`,
        '',
    );
    const [sessionContactId, setSessionContactId] = useLocalStorage(
        `${config.queueName}:sessionContactId`,
        '',
    );
    const [sessionParticipantId, setSessionParticipantId] = useLocalStorage(
        `${config.queueName}:sessionParticipantId`,
        '',
    );
    const [sessionParticipantToken, setSessionParticipantToken] =
        useLocalStorage(`${config.queueName}:sessionParticipantToken`, '');

    const networkStatus = useNetworkStatus();
    const { lastPing } = useSelector((state: RootState) => state.network);

    // This effect stores the last ping of the chat in session storage when the
    // user enters the chat screen.
    // This effect is called when the last ping is updated and the user is in
    // chat screen.
    // Skip this effect if the chat has attempted to reconnect and failed.
    useEffect(() => {
        if (lastPing !== null && screen === 'chat' && !failedToReconnect) {
            if (
                !amazonConnectContactId ||
                !amazonConnectParticipantId ||
                !amazonConnectParticipantToken
            ) {
                // It is not possible to enter the chat screen without the
                // Amazon Connect session details being set. If it happens,
                // this is a bug in the code and should be reported.
                throw new Error('Amazon Connect session details are missing');
            }

            // Chat screen entered
            // Update the chat last active time and store the session details
            // in local storage.
            setSessionLastPing(lastPing.toString());
            setSessionContactId(amazonConnectContactId);
            setSessionParticipantId(amazonConnectParticipantId);
            setSessionParticipantToken(amazonConnectParticipantToken);
        }
    }, [
        amazonConnectContactId,
        amazonConnectParticipantId,
        amazonConnectParticipantToken,
        dispatch,
        lastPing,
        screen,
        setSessionLastPing,
        setSessionContactId,
        setSessionParticipantId,
        setSessionParticipantToken,
        failedToReconnect,
    ]);

    // This effect clears the last ping of the chat and the session details from
    // local storage when the chat ends or if the user is disconnected so that
    // the chat does not reconnect when the user refreshes the page.
    useEffect(() => {
        if (
            chatEnded ||
            networkStatus === 'disconnected' ||
            failedToReconnect
        ) {
            setSessionLastPing('');
            setSessionContactId('');
            setSessionParticipantId('');
            setSessionParticipantToken('');
        }
    }, [
        networkStatus,
        screen,
        setSessionLastPing,
        setSessionContactId,
        setSessionParticipantId,
        setSessionParticipantToken,
        failedToReconnect,
        chatEnded,
    ]);

    // This effect attempts to reconnect the chat if the chat was active less
    // than 2 minutes ago.
    useEffect(() => {
        // If there is an existing chat session in storage, attempt to
        // reconnect the chat.
        if (sessionLastPing !== '' && screen === 'landing') {
            // If the chat was active less than 2 minutes ago, immediately load
            // the chat screen to reconnect the chat.
            const elapsedTime = Date.now() - parseInt(sessionLastPing, 10);

            if (
                elapsedTime < 120_000 &&
                sessionContactId &&
                sessionParticipantId &&
                sessionParticipantToken
            ) {
                // Load session details from storage
                dispatch(
                    setAmazonConnectSession({
                        contactId: sessionContactId,
                        participantId: sessionParticipantId,
                        participantToken: sessionParticipantToken,
                    }),
                );

                // Go to chat screen
                dispatch(setScreen('chat'));

                // Log reconnect attempt to GA
                dataLayerPush({
                    event: 'chat',
                    chat_msg: 'chat_reconnect_attempt',
                });
            }
        }
    }, [
        sessionLastPing,
        dispatch,
        screen,
        sessionContactId,
        sessionParticipantId,
        sessionParticipantToken,
    ]);

    /**
     * UI
     *
     * This is not very pretty, but the LexChatPanel must be rendered
     * outside of the main UI to prevent the iframe from reloading when
     * the UI changes.
     */
    let ui = null;

    const isGeoBlocked = window.location.href.includes('/geo-blocked');

    if (isGeoBlocked) {
        /**
         * Geo-blocking
         *
         * Geo-blocking is handled by Cloudflare. If the user is located outside
         * the UK, Cloudflare will redirect the user to /geo-blocked/. So all
         * this component needs to do is check if the user is on the geo-blocked
         * URL and display the GeoBlocked component.
         */
        ui = <GeoBlocked />;
    } else if (isQueueAvailable === null) {
        /**
         * Loading screen
         *
         * The queue status is null initially, which means it is not known
         * whether the queue is open or closed. During this time, display the
         * loading page. Once the queue status is fetched, the queue status
         * will be updated in the Redux store and the loading page will be
         * replaced with the landing screen or the service unavailable panel
         * depending on whether the queue is open or closed.
         *
         * Queue status is fetched and polled outside of React (in webchat.tsx).
         */
        ui = <FullScreenPage text="Loading..." />;
    } else if (sessionEnded) {
        /**
         * Session ended screen
         *
         * If the session has ended, display a full screen page with a
         * "Redirecting..." message . The user will be redirected to
         * Samaritans.org or the feedback form depending on the feedback
         * status.
         */
        ui = <FullScreenPage text="Redirecting..." />;
    } else if (
        networkStatus === 'offline' &&
        ['waiting', 'chat'].includes(screen)
    ) {
        /**
         * Network issue screen
         *
         * Displayed if the network is problematic
         */

        // Show more info if the chat was active more than 1 minute ago
        const moreInfo = lastPing !== null && Date.now() - lastPing > 60_000;
        ui = (
            <>
                <Banner showNotifications={false} />
                <NetworkIssue moreInfo={moreInfo} />;
            </>
        );
    } else if (
        (networkStatus === 'disconnected' || failedToReconnect) &&
        ['waiting', 'chat'].includes(screen)
    ) {
        /**
         * Disconnected screen
         *
         * Displayed if the chat has disconnected irrecoverably.
         */
        ui = <NetworkDisconnected />;
    } else if (failedToEstablish) {
        /**
         *
         * Server error screen
         *
         * Displayed if the chat has failed to establish a connection with the
         * server upon entering the waiting room.
         */
        ui = <ServerErrorPanel />;
    } else {
        /**
         * The main UI
         */
        ui = (
            <>
                {screen === 'landing' && isQueueAvailable && <LandingScreen />}
                {screen === 'landing' && !isQueueAvailable && (
                    <ServiceUnavailablePanel />
                )}
                {screen === 'waiting' && <WaitingScreen />}
                {screen === 'chat' && <ChatScreen />}
                {screen === 'feedback' && <FeedbackScreen />}
            </>
        );
    }

    const showLexChatPanel =
        screen === 'chat' && networkStatus === 'online' && !failedToReconnect;

    return (
        <>
            {ui}

            {/*
                The LexWebUi iframe is loaded inside the LexChatPanel component
                Once it is loaded, it must not be moved or re-rendered, otherwise
                the iframe will be reloaded and the chat session will reconnect.
            */}
            <LexChatPanel visible={showLexChatPanel}>
                <div id="lex-web-ui-iframe" />
            </LexChatPanel>
        </>
    );
};

export default App;
