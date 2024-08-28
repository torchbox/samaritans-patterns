import React, { useState } from 'react';
import Push from 'push.js';
import Toggle from 'react-toggle';

import { useNotifications } from 'utils/hooks';
import ToggleContainer, { Heading, Copy, Block } from './styled';

const { DEFAULT, GRANTED, DENIED } = Push.Permission;

const BannerNotifications = () => {
    const [browserPermission, setBrowserPermission] = useState(
        Push.Permission.get(),
    );

    const {
        isPushNotificationEnabled,
        updateNotifications,
        isAudioNotificationEnabled,
        updateAudio,
    } = useNotifications();

    const handlePermission = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (browserPermission === DEFAULT) {
            updateNotifications(true);
            Push.Permission.request(onGranted, onDenied);
        } else {
            updateNotifications(event.target.checked);
        }
    };

    const onGranted = () => {
        setBrowserPermission(GRANTED);
    };

    const onDenied = () => {
        updateNotifications(false);
        setBrowserPermission(DENIED);
    };

    const handleAudio = (event: React.ChangeEvent<HTMLInputElement>) =>
        updateAudio(event.target.checked);

    return (
        <div>
            <Block>
                {browserPermission === DENIED ? (
                    <>
                        <Heading>
                            Notifications are <b>disabled</b>.
                        </Heading>
                        <Copy>Please enable them via your browser.</Copy>
                    </>
                ) : (
                    <>
                        <Heading>
                            Notifications are{' '}
                            <b>
                                {isPushNotificationEnabled
                                    ? 'enabled'
                                    : 'disabled'}
                            </b>
                        </Heading>
                        <ToggleContainer>
                            <label>
                                <p>Send me a push notification</p>
                                <Toggle
                                    onChange={handlePermission}
                                    checked={isPushNotificationEnabled}
                                />
                            </label>
                        </ToggleContainer>
                    </>
                )}
            </Block>

            <Block>
                <Heading>
                    Audio Notifications are{' '}
                    <b>{isAudioNotificationEnabled ? 'enabled' : 'disabled'}</b>
                </Heading>
                <ToggleContainer>
                    <label>
                        <p>Play an audio alert</p>
                        <Toggle
                            onChange={handleAudio}
                            checked={isAudioNotificationEnabled}
                        />
                    </label>
                </ToggleContainer>
            </Block>
        </div>
    );
};

export default BannerNotifications;
