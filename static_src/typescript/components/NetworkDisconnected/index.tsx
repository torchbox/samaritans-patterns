import React from 'react';

import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';
import WhiteRoomCoverPanel from 'components/RoomCoverPanels/White';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NetworkDisconnected = () => {
    const { screen } = useSelector((state: RootState) => state.webchat);

    // These three messages are the same, but are likely be changed soon
    // so I've left the logic there for now
    let errorMessage =
        'We’re sorry, we can’t reach you. Unfortunately, this means you have been disconnected.';

    if (screen === 'chat') {
        errorMessage =
            'We’re sorry, we can’t reach you. Unfortunately, this means you have been disconnected.';
    } else if (screen === 'waiting') {
        errorMessage =
            'We’re sorry, we can’t reach you. Unfortunately, this means you have been disconnected.';
    }

    return (
        <WhiteRoomCoverPanel>
            <WarningIcon />
            <h1 hidden>Connection lost</h1>
            <h2>Connection lost</h2>
            <h3>{errorMessage}</h3>
            <p>This might have happened because:</p>
            <ul className="errorList">
                <li>&bull; You may have lost signal</li>
                <li>or</li>
                <li>&bull; You may have problems with your Wi-Fi connection</li>
            </ul>
            <Button
                action={() => {
                    document.location.reload();
                }}
            >
                Rejoin waiting room
            </Button>
            <p>
                You can call us for free, anytime, day or night, on{' '}
                <a
                    aria-label="Samaritans phone number 116 123"
                    href="tel:116123"
                >
                    116 123
                </a>
            </p>
        </WhiteRoomCoverPanel>
    );
};

export default NetworkDisconnected;
