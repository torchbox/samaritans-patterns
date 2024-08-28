import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import useTitle from 'react-use/lib/useTitle';

import Button from 'components/Button';

import { ReactComponent as VolunteerReadyAvatar } from 'assets/svgs/volunteer-ready.svg';
import { useNotifications } from 'utils/hooks';
import ScreenReaderAnnounce from 'components/ScreenReaderAnnounce';
import { audioNotification, chatNotification } from '../../notifications';
import StyledReadyScreen from './styled';

export type Props = {
    joinAction: () => void;
};

const ReadyScreen = ({ joinAction }: Props) => {
    useTitle('A Samaritan is ready to listen | Webchat');

    const { notify, notificationSent } = useNotifications();

    const [props, setAnimation] = useSpring(() => ({ opacity: 0 }));

    useEffect(() => {
        // wait for the ready screen fade
        const timer = setTimeout(() => {
            setAnimation({ opacity: 1 });
            if (!notificationSent) {
                notify();
            }
        }, 1100);
        return () => clearTimeout(timer);
    }, [notificationSent, notify, setAnimation]);

    return (
        <StyledReadyScreen aria-live="polite">
            <h1 hidden>Chat ready</h1>
            <animated.div style={props}>
                <VolunteerReadyAvatar aria-hidden="true" />
                <h2>A Samaritan is ready to listen</h2>
                <ScreenReaderAnnounce text="A Samaritan is ready to listen" />
                <Button action={joinAction}>Enter Chat</Button>
            </animated.div>
        </StyledReadyScreen>
    );
};

export default ReadyScreen;
