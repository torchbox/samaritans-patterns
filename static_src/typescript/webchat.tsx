import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';
import GlobalStyle from 'styles/global';

import 'rc-slider/assets/index.css';
import 'react-toggle/style.css';

import { LexWebUiProvider } from 'utils/lex-web-ui';
import { Provider } from 'react-redux';
import { Workbox } from 'workbox-window';
import HeartBeatPoller from 'components/HeartBeatPoller';
import { dataLayerPush } from 'utils/dataLayer';
import App from './App';
import SentryBoundary from './components/SentryBoundary';
import './index.css';
import config from './config';

import { store } from './store';
import {
    endChat,
    setAmazonConnectSession,
    setFailedToEstablish,
    setFailedToReconnect,
    setIsConfirmExitVisible,
    setSucceededToReconnect,
    setVolunteerJoined,
} from './slices/webchatSlice';
import { refreshQueueStatus } from './slices/queueSlice';
import { ping } from './slices/networkSlice';

/**
 * Render the Webchat app
 */
const render = (Component: React.ComponentType) => {
    // Create a container for screen reader announcements
    // Used by ScreenReaderAnnounce component
    const screenReaderAnnouncementsContainer = document.createElement('div');
    screenReaderAnnouncementsContainer.id = 'screen_reader_announcements';
    screenReaderAnnouncementsContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(screenReaderAnnouncementsContainer);

    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <LexWebUiProvider
                    queueName={config.queueName}
                    baseUrl={config.lexWebUiBaseUrl}
                >
                    <HeartBeatPoller />
                    <GlobalStyle />
                    <SentryBoundary>
                        <Component />
                    </SentryBoundary>
                </LexWebUiProvider>
            </Provider>
        </ThemeProvider>,
        document.getElementById('root'),
    );
};

render(App);

/**
 * Listen to events from LexWebUi
 */

type BaseLexWebUiEvent = {
    event:
        | 'volunteerJoined'
        | 'volunteerLeft'
        | 'callerLeft'
        | 'chatEnded'
        | 'requestLiveChatEnd'
        | 'chatFailedToReconnect'
        | 'chatFailedToEstablish'
        | 'chatSucceededToReconnect';
};

type ChatStartedEvent = {
    event: 'chatStarted';
    contactId: string;
};

type CreateLiveChatSessionEvent = {
    event: 'createLiveChatSession';
    session: {
        contactId: string;
        participantId: string;
        participantToken: string;
    };
};

type LexWebUiEvent =
    | BaseLexWebUiEvent
    | ChatStartedEvent
    | CreateLiveChatSessionEvent;

const lexWebUiEventHandler = (event: MessageEvent<LexWebUiEvent>) => {
    // Ensure messages are coming from the expected origin
    if (event.origin !== config.amazonConnectIframeOrigin) {
        return;
    }

    const message = event.data;

    if (message.event === 'volunteerJoined') {
        store.dispatch(setVolunteerJoined(true));

        dataLayerPush({
            event: 'chat',
            chat_msg: 'volunteer_has_connected',
        });
    }

    if (message.event === 'createLiveChatSession') {
        store.dispatch(
            setAmazonConnectSession({
                contactId: message.session.contactId,
                participantId: message.session.participantId,
                participantToken: message.session.participantToken,
            }),
        );
    }

    if (message.event === 'requestLiveChatEnd') {
        store.dispatch(setIsConfirmExitVisible(true));
    }

    if (message.event === 'volunteerLeft') {
        dataLayerPush({
            event: 'chat',
            chat_msg: 'chat_volunteer_exit',
        });
    }

    if (message.event === 'callerLeft') {
        dataLayerPush({
            event: 'chat',
            chat_msg: 'chat_user_exit',
        });
    }

    if (message.event === 'chatEnded') {
        dataLayerPush({
            event: 'chat',
            chat_msg: 'chat_disconnected',
        });
    }

    if (['volunteerLeft', 'callerLeft', 'chatEnded'].includes(message.event)) {
        store.dispatch(endChat());
    }

    if (message.event === 'chatFailedToReconnect') {
        store.dispatch(setFailedToReconnect(true));
        dataLayerPush({
            event: 'chatError',
            errorMessage: 'chat_reconnect_failed',
        });
    }

    if (message.event === 'chatSucceededToReconnect') {
        store.dispatch(setSucceededToReconnect(true));

        // When the chat is successfully reconnected, we can assume the
        // volunteer has joined
        store.dispatch(setVolunteerJoined(true));

        dataLayerPush({
            event: 'chat',
            chat_msg: 'chat_reconnect_success',
        });
    }

    if (message.event === 'chatFailedToEstablish') {
        store.dispatch(setFailedToEstablish(true));
    }
};

window.addEventListener('message', lexWebUiEventHandler);

/**
 * Poll queue status from Amazon Connect Metrics API
 *
 * This triggers the refreshQueueStatus async thunk, waits for it to resolve,
 * then waits for 30 seconds before repeating endlessly.
 *
 * If the queue is not available, stop polling.
 */
const pollQueueStatus = async () => {
    let continuePolling = true;

    // eslint-disable-next-line no-constant-condition
    while (continuePolling) {
        // eslint-disable-next-line no-await-in-loop
        const { is_open, is_at_queue_limit, agents_staffed } = await store
            .dispatch(refreshQueueStatus())
            .unwrap();

        const queueAvailable =
            is_open && agents_staffed > 0 && !is_at_queue_limit;

        if (!queueAvailable) {
            continuePolling = false;
        }

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
            setTimeout(resolve, 30_000);
        });
    }
};

pollQueueStatus();

/**
 * Network status poller
 *
 * This triggers the ping async thunk, waits for it to resolve, then waits for 5
 * seconds before repeating endlessly.
 */
const pollNetworkStatus = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        await store.dispatch(ping());
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
            setTimeout(resolve, 5_000);
        });
    }
};

pollNetworkStatus();

/**
 * Register service worker
 */
if ('serviceWorker' in navigator) {
    const wb = new Workbox('/static/webchat-sw.js', { scope: '/' });
    wb.register();
}
