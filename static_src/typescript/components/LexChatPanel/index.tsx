import React from 'react';
import { isIOS, isIE, isAndroid } from 'react-device-detect';

import { ReactComponent as VolunteerAvatar } from 'assets/svgs/volunteer-avatar.svg';

import { useDispatch, useSelector } from 'react-redux';
import MobileMenu from 'components/MobileMenu';
import BannerNotifications from 'components/BannerNotifications';
import ConnectionBar from 'components/ConnectionBar';
import { timeDisplay } from 'utils/wait-time';
import StyledLexChatPanel, {
    ChatRoomExitButton,
    ChatRoomHeader,
    ChatRoomStatus,
} from './styled';
import { setIsConfirmExitVisible, setScreen } from '../../slices/webchatSlice';
import type { RootState } from '../../store';

type Props = {
    children: React.ReactNode;
    visible: boolean;
};

const LexChatPanel = ({ visible, children }: Props) => {
    const dispatch = useDispatch();

    const { volunteerJoined, chatEnded } = useSelector(
        (state: RootState) => state.webchat,
    );
    const averageQueueAnswerTime = useSelector(
        (state: RootState) => state.queue.averageQueueAnswerTime,
    );

    let status;

    if (!volunteerJoined || chatEnded) {
        status = 'Not Started';
    }

    let heading = `Talking to a Samaritan`;
    let description = `Connected`;

    if (!volunteerJoined) {
        description = `Waiting for a Samaritan`;
        heading = `${timeDisplay(averageQueueAnswerTime)} estimated wait`;
    }

    if (chatEnded) {
        heading = 'Session ended';
        description = 'Your chat has finished';
    }

    return (
        <StyledLexChatPanel visible={visible}>
            <ChatRoomHeader status={status}>
                <MobileMenu>
                    <h3>Other ways to get in touch</h3>
                    <p>
                        Call us:{' '}
                        <a
                            aria-label="Samaritans phone number on 116 123"
                            href="tel:116123"
                        >
                            116 123
                        </a>
                    </p>
                    <p>
                        Email us:{' '}
                        <a href="mailto:jo@samaritans.org">jo@samaritans.org</a>
                    </p>
                    {!isIOS && !isIE && !isAndroid && (
                        <>
                            <h4>Notification settings</h4>
                            <BannerNotifications />
                        </>
                    )}
                </MobileMenu>
                <ChatRoomStatus>
                    <ConnectionBar
                        offline={status === 'Not Started'}
                        avatar={<VolunteerAvatar />}
                        description={description}
                        heading={heading}
                    />
                </ChatRoomStatus>
                <ChatRoomExitButton
                    variant={chatEnded ? 'default' : 'orange'}
                    onClick={() => {
                        if (!chatEnded) {
                            dispatch(setIsConfirmExitVisible(true));
                        } else {
                            dispatch(setScreen('feedback'));
                        }
                    }}
                >
                    {chatEnded ? 'Exit' : 'End live chat'}
                </ChatRoomExitButton>
            </ChatRoomHeader>
            {children}
        </StyledLexChatPanel>
    );
};

export default LexChatPanel;
