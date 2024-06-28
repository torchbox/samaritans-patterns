import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';

type Props = {
    moreInfo?: boolean;
};

const NetworkIssue = ({ moreInfo }: Props) => (
    <PurpleRoomCoverPanel>
        <WarningIcon />
        <h2>Connection Issue</h2>
        <p>
            There seems to be a problem with your connection. This could be due
            to issues with your Wi-Fi or mobile data. We will hold your place
            for 2 minutes while we try to reconnect with you.
        </p>

        <h3 className="mb-0">What You Can Do</h3>
        <ul className="errorList">
            <li>1. Ensure you have a good internet connection.</li>
            <li>
                2. If possible, move to a location with better connectivity.
            </li>
        </ul>

        <p>
            While we try to reconnect, some messages from our volunteer may not
            have reached you, but your messages should come through.
        </p>

        {moreInfo && (
            <p>
                We are still trying to re-connect you. If the issue persists,
                you can call us for free anytime on{' '}
                <a
                    aria-label="Samaritans phone number 116 123"
                    href="tel:116123"
                >
                    116 123
                </a>{' '}
                or find another service.
            </p>
        )}
    </PurpleRoomCoverPanel>
);

export default NetworkIssue;
