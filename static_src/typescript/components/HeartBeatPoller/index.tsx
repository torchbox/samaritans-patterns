import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../store';
import config from '../../config';

/**
 * Poll a callback at a given interval
 *
 * The interval is the time between the end of the previous callback and the
 * start of the next callback. It does not use setInterval.
 *
 * */
const usePoller = (callback: () => Promise<void>, interval: number) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMounted = useRef(true);

    useEffect(
        () => () => {
            isMounted.current = false;

            // When the component unmounts, clear the timer
            // so that it doesn't trigger the callback after unmounting
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        },
        [],
    );

    useEffect(() => {
        const poll = async () => {
            await callback();

            // Only set the timer if the component is still mounted
            if (isMounted.current) {
                timerRef.current = setTimeout(poll, interval);
            }
        };

        poll();

        return () => {
            // If the callback or interval changes, clear the timer
            // so that the previous timer doesn't trigger a potentially outdated
            // callback
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [callback, interval]);
};

type PollerProps = {
    callback: () => Promise<void>;
    interval: number;
};

const Poller = ({ callback, interval }: PollerProps) => {
    usePoller(callback, interval);

    return null;
};

const HeartBeatPoller = () => {
    const {
        screen,
        chatEnded,
        sessionEnded,
        failedToReconnect,
        amazonConnectContactId,
    } = useSelector((state: RootState) => state.webchat);

    const callback = useCallback(async () => {
        if (!amazonConnectContactId) {
            return;
        }

        try {
            await fetch(config.heartbeatEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.heartbeatApiKey,
                },
                body: JSON.stringify({
                    contactId: amazonConnectContactId,
                }),
            });
        } catch (e) {
            console.error('Failed to ping health check endpoint', e);
        }
    }, [amazonConnectContactId]);

    // Ping the health check endpoint every 10 seconds
    if (
        // Only if the user is in the waiting or chat screen
        ['waiting', 'chat'].includes(screen) &&
        // Only if they have a contact ID (which means they're connected to a
        // chat)
        amazonConnectContactId &&
        // Only if the chat hasn't ended yet (e.g. they're on the chat screen
        // but the chat has ended)
        !chatEnded &&
        // Only if the session hasn't ended yet (e.g. they're reconnecting)
        !sessionEnded &&
        // Only if they haven't failed to reconnect
        !failedToReconnect
    ) {
        return <Poller callback={callback} interval={10_000} />;
    }

    return null;
};

export default HeartBeatPoller;
