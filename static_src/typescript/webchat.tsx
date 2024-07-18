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
import App from './App';
import SentryBoundary from './components/SentryBoundary';
import './index.css';
import config from './config';

import { store } from './store';
import {
    setAmazonConnectSession,
    setFailedToEstablish,
    setFailedToReconnect,
    setIsConfirmExitVisible,
    setScreen,
    setVolunteerJoined,
} from './slices/webchatSlice';
import { refreshQueueStatus } from './slices/queueSlice';
import { ping } from './slices/networkSlice';

/**
 * Render the Webchat app
 */
const render = (Component: React.ComponentType) => {
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <LexWebUiProvider
                    queueName={config.queueName}
                    baseUrl={config.lexWebUiBaseUrl}
                >
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
        | 'chatFailedToEstablish';
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

        window.dataLayer.push({
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
        window.dataLayer.push({
            event: 'chat',
            chat_msg: 'chat_volunteer_exit',
        });
    }

    if (message.event === 'callerLeft') {
        window.dataLayer.push({
            event: 'chat',
            chat_msg: 'chat_user_exit',
        });
    }

    if (message.event === 'chatEnded') {
        window.dataLayer.push({
            event: 'chat',
            chat_msg: 'chat_disconnected',
        });
    }

    if (['volunteerLeft', 'callerLeft', 'chatEnded'].includes(message.event)) {
        store.dispatch(setScreen('feedback'));
    }

    if (message.event === 'chatFailedToReconnect') {
        store.dispatch(setFailedToReconnect(true));
    }

    if (message.event === 'chatFailedToEstablish') {
        store.dispatch(setFailedToEstablish(true));
    }
};

window.addEventListener('message', lexWebUiEventHandler);

/**
 * Poll queue status from Amazon Connect Metrics API
 *
 * This triggers the refreshQueueStatus async thunk, waits for it to resolve, then
 * waits for 30 seconds before repeating endlessly.
 */
const pollQueueStatus = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-await-in-loop
        await store.dispatch(refreshQueueStatus());
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
