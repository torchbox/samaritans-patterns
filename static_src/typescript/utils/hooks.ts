import { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { useNetworkState } from 'react-use';
import type { RootState } from '../store';
import {
    setIsAudioNotificationEnabled,
    setIsPushNotificationEnabled,
    setNotificationSent,
} from '../slices/webchatSlice';
import { audioNotification, chatNotification } from '../notifications';

const getSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
});

/**
 * Returns:
 * {
 *   innerWidth: window.innerWidth,
 *   innerHeight: window.innerHeight,
 *   outerWidth: window.outerWidth,
 *   outerHeight: window.outerHeight,
 * }
 * */
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(getSize());

    function handleResize() {
        setWindowSize(getSize());
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
};

export const useIsMobile = () => {
    const theme = useContext(ThemeContext);
    const windowSize = useWindowSize();

    let siteWidth = parseInt(theme.grid.siteWidth, 10);

    if (Number.isNaN(siteWidth)) {
        siteWidth = 1100; // Fallback to 1100px if not set
    }

    return windowSize.innerWidth < siteWidth;
};

export const useNotifications = (): {
    isPushNotificationEnabled: boolean;
    updateNotifications: (value: boolean) => void;
    isAudioNotificationEnabled: boolean;
    updateAudio: (value: boolean) => void;
    notify: () => void;
    notificationSent: boolean;
} => {
    const dispatch = useDispatch();

    const { notificationSent } = useSelector(
        (state: RootState) => state.webchat,
    );

    const isPushNotificationEnabled = useSelector(
        (state: RootState) => state.webchat.isPushNotificationEnabled,
    );
    const isAudioNotificationEnabled = useSelector(
        (state: RootState) => state.webchat.isAudioNotificationEnabled,
    );

    const updateNotifications = (value: boolean) => {
        dispatch(setIsPushNotificationEnabled(value));
    };
    const updateAudio = (value: boolean) => {
        dispatch(setIsAudioNotificationEnabled(value));
    };

    const notify = useCallback(() => {
        if (isPushNotificationEnabled) {
            chatNotification();
        }
        if (isAudioNotificationEnabled) {
            audioNotification.play();
        }

        dispatch(setNotificationSent(true));
    }, [dispatch, isAudioNotificationEnabled, isPushNotificationEnabled]);

    return {
        isPushNotificationEnabled,
        updateNotifications,
        isAudioNotificationEnabled,
        updateAudio,
        notify,
        notificationSent,
    };
};

/**
 * Returns a tuple with the current value of the key in localStorage and a function to update it.
 *
 * NB: A webchat prefix is added to the key to avoid conflicts with other keys in localStorage.
 *
 * @param key - The key to store the value in localStorage
 * @param initialValue - The initial value to use if the key is not set in localStorage
 * @returns A tuple with the current value of the key in localStorage and a function to update it
 * */
export const useLocalStorage = (
    key: string,
    initialValue: string,
): [string, (value: string) => void] => {
    const prefixedKey = `webchat:${key}`;

    const [value, setValue] = useState<string>(() => {
        const storedValue = localStorage.getItem(prefixedKey);
        return storedValue !== null ? storedValue : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(prefixedKey, value);
    }, [prefixedKey, value]);

    return [value, setValue];
};

/**
 * Returns the current network status
 *
 * Uses both the network status from Redux and useNetworkState to determine the
 * current network status.
 */
export const useNetworkStatus = (): 'online' | 'offline' | 'disconnected' => {
    const { online } = useNetworkState();
    const status = useSelector((state: RootState) => state.network.status);

    if (status === 'disconnected') {
        return 'disconnected';
    }

    return online && status === 'online' ? 'online' : 'offline';
};
