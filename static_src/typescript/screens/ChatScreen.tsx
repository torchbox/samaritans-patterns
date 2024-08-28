import React, { useEffect, useState } from 'react';
import useTitle from 'react-use/lib/useTitle';

import Banner from 'components/Banner';
import ExitModal from 'components/ExitModal';
import { useDispatch, useSelector } from 'react-redux';
import { dataLayerPush } from 'utils/dataLayer';
import ScreenReaderAnnounce from 'components/ScreenReaderAnnounce';
import { useNotifications } from 'utils/hooks';
import type { RootState } from '../store';
import { setIsConfirmExitVisible } from '../slices/webchatSlice';

const confirmLiveChatEnd = () => {
    const event = new CustomEvent('lexWebUiMessage', {
        detail: { message: { event: 'confirmEndLiveChat' } },
    });

    document.dispatchEvent(event);
};

const ChatScreen = () => {
    useTitle('Chat | Webchat');

    const dispatch = useDispatch();

    const { isConfirmExitVisible, volunteerJoined } = useSelector(
        (state: RootState) => state.webchat,
    );

    useEffect(() => {
        dataLayerPush({
            event: 'chat',
            chat_msg: 'chat_initiation',
        });
    }, []);

    const { notify, notificationSent } = useNotifications();

    useEffect(() => {
        if (volunteerJoined && !notificationSent) {
            notify();
        }
    }, [notificationSent, notify, volunteerJoined]);

    return (
        <>
            <Banner showNotifications={false} />
            <ScreenReaderAnnounce text="Chat interface" />

            <ExitModal
                room="Chat"
                handleCancel={() => dispatch(setIsConfirmExitVisible(false))}
                handleExit={() => {
                    confirmLiveChatEnd();
                    dispatch(setIsConfirmExitVisible(false));
                }}
                exitModalOpen={isConfirmExitVisible}
            />
            {/* The chat iframe itself is loaded in App.tsx */}
        </>
    );
};

export default ChatScreen;
