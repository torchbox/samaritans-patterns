import React from 'react';

import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';
import WhiteRoomCoverPanel from 'components/RoomCoverPanels/White';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NetworkDisconnected = () => {
    const { screen } = useSelector((state: RootState) => state.webchat);

    let errorMessage =
        "We can't reach you. Unfortunately, this means you have been disconnected.";

    if (screen === 'chat') {
        errorMessage =
            "We can't reach you. Unfortunately, this means your chat session has been interrupted.";
    } else if (screen === 'waiting') {
        errorMessage =
            "We can't reach you. Unfortunately, this means you're not in the waiting room anymore.";
    }

    return (
        <WhiteRoomCoverPanel>
            <WarningIcon />
            <h2>{errorMessage}</h2>
            <p>
                This might have happened because you’ve lost signal or are
                having problems with your WiFi connection.
            </p>
            <Button
                action={() => {
                    document.location.reload();
                }}
            >
                Rejoin waiting room
            </Button>
            <p>
                <b>
                    You can call us for free, any time, day or night, on{' '}
                    <a
                        aria-label="Samaritans phone number 116 123"
                        href="tel:116123"
                    >
                        116 123
                    </a>
                </b>
            </p>
        </WhiteRoomCoverPanel>
    );
};

export default NetworkDisconnected;
