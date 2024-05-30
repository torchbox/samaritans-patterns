import React, { useContext, useEffect, useRef, createContext } from 'react';
import { useStore } from 'react-redux';
import type { RootState } from '../store';
import { setLexWebUiStatus } from '../slices/webchatSlice';

/**
 * Get the ChatBotUiLoader from the window object
 *
 * This function will wait for the ChatBotUiLoader to be available on the window
 * object. It is sometimes not available immediately as it is loaded
 * asynchronously.
 *
 */
const getChatBotUiLoader = async (): Promise<typeof window.ChatBotUiLoader> =>
    new Promise((resolve) => {
        const checkInterval = 1000;

        const checkAvailability = () => {
            if (typeof window.ChatBotUiLoader !== 'undefined') {
                resolve(window.ChatBotUiLoader);
            } else {
                setTimeout(checkAvailability, checkInterval);
            }
        };

        checkAvailability();
    });

/**
 * Class to manage the LexWebUi
 */
type LexWebUiSessionAttributes = {
    fingerprintId: string;
    ipAddress: string | undefined;
    browserName: string | undefined;
    browserVersion: string | undefined;
    os: string | undefined;
    osVersion: string | undefined;
    contactId?: string;
    participantId?: string;
    participantToken?: string;
};

class LexWebUiLoader {
    private lexNode: HTMLDivElement | null = null;

    private listeners: { [event: string]: (() => void)[] } = {};

    constructor(private queueName: string, private baseUrl: string) {}

    async load({
        sessionAttributes,
    }: {
        sessionAttributes: LexWebUiSessionAttributes;
    }) {
        this.emit('loading');

        const ChatBotUiLoader = await getChatBotUiLoader();

        const loader = new ChatBotUiLoader.IframeLoader({
            baseUrl: `${this.baseUrl}/webchat/lexwebui/${this.queueName}`,
            shouldLoadMinDeps: true,
        });

        const chatBotUiConfig = {
            lex: {
                sessionAttributes,
            },
        };

        loader
            .load(chatBotUiConfig)
            .then(() => {
                this.lexNode = document.querySelector('#lex-web-ui-iframe');
                this.emit('loaded');
            })
            .catch((error: ErrorEvent) => {
                this.emit('error');
                console.error('Error loading LexWebUi', error);
            });
    }

    // Event handling
    on(event: string, listener: () => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    emit(event: string): void {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            eventListeners.forEach((listener) => {
                listener();
            });
        }
    }
}

/**
 * Providers to supply the LexWebUi instance to the app
 */
const LexWebUiLoaderContext = createContext<LexWebUiLoader | undefined>(
    undefined,
);

type LexWebUiLoaderProviderProps = {
    queueName: string;
    baseUrl: string;
    children: React.ReactNode;
};

export const LexWebUiProvider = ({
    queueName,
    baseUrl,
    children,
}: LexWebUiLoaderProviderProps) => {
    const store = useStore<RootState>();
    const lexWebUiRef = useRef<LexWebUiLoader>(
        new LexWebUiLoader(queueName, baseUrl),
    );
    const lexWebUi = lexWebUiRef.current;

    useEffect(() => {
        lexWebUi.on('loading', () => {
            store.dispatch(setLexWebUiStatus('loading'));
        });
        lexWebUi.on('loaded', () => {
            store.dispatch(setLexWebUiStatus('loaded'));
        });
        lexWebUi.on('error', () => {
            store.dispatch(setLexWebUiStatus('error'));
        });
    }, [lexWebUi, store]);

    return (
        <LexWebUiLoaderContext.Provider value={lexWebUi}>
            {children}
        </LexWebUiLoaderContext.Provider>
    );
};

export const useLexWebUiLoader = () => {
    const lexWebUi = useContext(LexWebUiLoaderContext);

    if (!lexWebUi) {
        throw new Error('useLexWebUi must be used within a LexWebUiProvider');
    }

    return lexWebUi;
};
