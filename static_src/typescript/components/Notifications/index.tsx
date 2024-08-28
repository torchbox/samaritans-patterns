import React from 'react';
import Push from 'push.js';

import Checkbox from 'components/Checkbox';
import { ReactComponent as BellIcon } from 'assets/svgs/bell.svg';
import TestSound from 'components/TestSound';
import { useNotifications, useWindowSize } from 'utils/hooks';

import ScreenReaderAnnounce from 'components/ScreenReaderAnnounce';
import { Heading2 } from 'components/Text';
import NotificationPanel, { Intro, Label, Small, Copy } from './styled';

const Notifications = () => {
    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth < 1024;

    const browserPermission = Push.Permission.get();

    const {
        isPushNotificationEnabled,
        updateNotifications,
        isAudioNotificationEnabled,
        updateAudio,
    } = useNotifications();

    const handleNotifications = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        updateNotifications(event.target.checked);
    };

    const handleAudio = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateAudio(event.target.checked);
    };

    return (
        <NotificationPanel>
            <BellIcon aria-hidden="true" />
            <Heading2 as="h1">You're waiting for a Samaritan</Heading2>
            <ScreenReaderAnnounce text="You're waiting for a Samaritan" />
            <Intro>
                We can alert you when a Samaritan is available. You can change
                these settings at any time by clicking on 'notification
                settings'
                {isMobile
                    ? ' in the mobile menu.'
                    : ' at the top of your screen.'}
            </Intro>
            {browserPermission === 'denied' ? (
                <Copy>
                    Notifications are <b>disabled</b>.<br /> Please enable them
                    via your browser.
                </Copy>
            ) : (
                <>
                    <Checkbox
                        checked={isPushNotificationEnabled}
                        onChange={handleNotifications}
                        labelComponent={Label}
                        id="push-notification"
                        ariaLabel="Send me a push notification"
                    >
                        Send me a push notification
                    </Checkbox>
                    <Small>
                        The notification will only ever say "Your chat is
                        ready". It will never show what your messages say or
                        what a volunteer writes you.
                    </Small>
                    {isPushNotificationEnabled &&
                        browserPermission !== 'granted' && (
                            <Copy>
                                <b>
                                    Please click 'Allow' when prompted by your
                                    browser.
                                </b>
                            </Copy>
                        )}
                </>
            )}

            <Checkbox
                checked={isAudioNotificationEnabled}
                onChange={handleAudio}
                labelComponent={Label}
                id="audio-notification"
                ariaLabel="Play an audio alert"
            >
                Play an audio alert
            </Checkbox>
            <p>
                Make sure your sound is not muted and the volume is turned up.{' '}
                <TestSound />
            </p>
        </NotificationPanel>
    );
};

export default Notifications;
