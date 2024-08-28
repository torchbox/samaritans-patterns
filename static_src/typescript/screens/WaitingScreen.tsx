import React, { useEffect } from 'react';
import { useTransition, animated, config as springConfig } from 'react-spring';

import SafeguardingBanner from 'components/SafeguardingBanner';
import JoiningQueue from 'components/JoiningQueue';
import InQueue from 'components/InQueue';
import ReadyScreen from 'components/ReadyScreen';
import Banner from 'components/Banner';

import { useIsMobile } from 'utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { dataLayerPush } from 'utils/dataLayer';
import config from '../config';

import type { AppDispatch, RootState } from '../store';
import { setScreen } from '../slices/webchatSlice';
import { refreshQueueStatus } from '../slices/queueSlice';

const WaitingScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useIsMobile();
    const [queueStatusChecked, setQueueStatusChecked] = React.useState(false);

    const lexWebUiStatus = useSelector(
        (state: RootState) => state.webchat.lexWebUiStatus,
    );
    const {
        amazonConnectContactId,
        amazonConnectParticipantId,
        amazonConnectParticipantToken,
    } = useSelector((state: RootState) => state.webchat);

    const chatConnected =
        !!(
            amazonConnectContactId &&
            amazonConnectParticipantId &&
            amazonConnectParticipantToken
        ) && queueStatusChecked;

    const volunteerJoined = useSelector(
        (state: RootState) => state.webchat.volunteerJoined,
    );

    const joiningTransition = useTransition(!chatConnected, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: springConfig.gentle,
    });

    if (lexWebUiStatus === 'error') {
        // Show error screen
        throw new Error('Error loading LexWebUi');
    }

    const startingTransition = useTransition(volunteerJoined, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: springConfig.molasses,
    });

    // This effect checks the Metrics API if the queue is still open at the
    // point of joining the queue. If the queue is closed, the user will be
    // redirected to the landing screen where the Service Unavailable message
    // will be displayed.
    // NB: Joining the queue and checking the queue status happen in parallel.
    useEffect(() => {
        dispatch(refreshQueueStatus())
            .unwrap()
            .then(({ is_open, is_at_queue_limit, agents_staffed }) => {
                const queueAvailable =
                    is_open && agents_staffed > 0 && !is_at_queue_limit;

                // Send GA events for queue status
                if (!queueAvailable) {
                    if (!is_open) {
                        dataLayerPush({
                            event: 'chatError',
                            errorMessage: 'queue_closed_on_join',
                        });
                    } else if (agents_staffed === 0) {
                        dataLayerPush({
                            event: 'chatError',
                            errorMessage: 'queue_not_staffed_on_join',
                        });
                    } else if (is_at_queue_limit) {
                        dataLayerPush({
                            event: 'chatError',
                            errorMessage: 'queue_full_on_join',
                        });
                    }

                    dispatch(setScreen('landing'));
                } else {
                    setQueueStatusChecked(true);
                }
            });
    }, [dispatch]);

    return (
        <>
            <Banner showNotifications />
            {!isMobile && config.displayBanner && config.banner && (
                <SafeguardingBanner
                    title={config.banner.title}
                    text={config.banner.message}
                    link_text={config.banner.linkText}
                    link_url={config.banner.linkUrl}
                />
            )}
            {joiningTransition.map(
                ({ item: joinItem, key: joinKey, props: joinProps }) =>
                    joinItem ? (
                        <animated.div key={joinKey} style={joinProps}>
                            <JoiningQueue />
                        </animated.div>
                    ) : (
                        <animated.div key={joinKey} style={joinProps}>
                            {startingTransition.map(({ item, key, props }) =>
                                item ? (
                                    <animated.div key={key} style={props}>
                                        <ReadyScreen
                                            joinAction={() => {
                                                dispatch(setScreen('chat'));
                                            }}
                                        />
                                    </animated.div>
                                ) : (
                                    <animated.div key={key} style={props}>
                                        <InQueue
                                            goToChat={() => {
                                                dispatch(setScreen('chat'));
                                            }}
                                        />
                                    </animated.div>
                                ),
                            )}
                        </animated.div>
                    ),
            )}
            {isMobile && config.displayBanner && config.banner && (
                <SafeguardingBanner
                    title={config.banner.title}
                    text={config.banner.message}
                    link_text={config.banner.linkText}
                    link_url={config.banner.linkUrl}
                />
            )}
        </>
    );
};

export default WaitingScreen;
