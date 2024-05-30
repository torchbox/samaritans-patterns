import React from 'react';

import Banner from 'components/Banner';
import ExitModal from 'components/ExitModal';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setIsConfirmExitVisible } from '../slices/webchatSlice';

const confirmLiveChatEnd = () => {
    const event = new CustomEvent('lexWebUiMessage', {
        detail: { message: { event: 'confirmEndLiveChat' } },
    });

    document.dispatchEvent(event);
};

const ChatScreen = () => {
    const dispatch = useDispatch();
    const { isConfirmExitVisible } = useSelector(
        (state: RootState) => state.webchat,
    );

    return (
        <>
            <Banner showNotifications={false} />

            <ExitModal
                room="Chat"
                handleCancel={() => dispatch(setIsConfirmExitVisible(false))}
                handleExit={() => confirmLiveChatEnd()}
                exitModalOpen={isConfirmExitVisible}
            />
            {/* The chat iframe itself is loaded in App.tsx */}
        </>
    );
};

export default ChatScreen;
