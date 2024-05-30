import React from 'react';

import ButtonModal from '../ButtonModal';
import Button from '../Button';

type Props = {
    exitModalOpen: boolean;
    handleCancel: () => void;
    handleExit: () => void;
    room: string;
};

const ExitModal = ({
    exitModalOpen,
    handleCancel,
    handleExit,
    room,
}: Props) => {
    const context = room.toLowerCase();

    return (
        <ButtonModal
            open={exitModalOpen}
            title={`Are you sure you want to leave the ${context}?`}
            buttons={[
                <Button key="cancel" action={handleCancel}>
                    No, return to {context}
                </Button>,
                <Button key="accept" action={handleExit}>
                    Yes, leave {context}
                </Button>,
            ]}
        />
    );
};

export default ExitModal;
