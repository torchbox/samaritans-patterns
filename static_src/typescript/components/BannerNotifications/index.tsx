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

    const [notifications, updateNotifications, audio, updateAudio] =
        useNotifications();

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
                            <b>{notifications ? 'enabled' : 'disabled'}</b>
                        </Heading>
                        <ToggleContainer>
                            <p>Please use the toggle to change this:</p>
                            <label>
                                <Toggle
                                    onChange={handlePermission}
                                    checked={notifications}
                                    aria-label="Send me a push notification"
                                />
                            </label>
                        </ToggleContainer>
                    </>
                )}
            </Block>

            <Block>
                <Heading>
                    Audio Notifications are{' '}
                    <b>{audio ? 'enabled' : 'disabled'}</b>
                </Heading>
                <ToggleContainer>
                    <p>Please use the toggle to change this:</p>
                    <label>
                        <Toggle
                            onChange={handleAudio}
                            checked={audio}
                            aria-label="Play an audio alert"
                        />
                    </label>
                </ToggleContainer>
            </Block>
        </div>
    );
};

export default BannerNotifications;
