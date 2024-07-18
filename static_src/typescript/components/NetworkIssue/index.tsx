import React, { useEffect } from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';
import { dataLayerPush } from 'utils/dataLayer';

type Props = {
    moreInfo?: boolean;
};

const NetworkIssue = ({ moreInfo }: Props) => {
    useEffect(() => {
        dataLayerPush({
            event: 'chatError',
            errorMessage: 'network_issue',
        });
    }, []);

    return (
        <PurpleRoomCoverPanel>
            <WarningIcon />
            <h2>Connection Issue</h2>
            <p>
                <strong>
                    Some messages from our volunteer may not have reached you,
                    but your previous messages should have been received.
                </strong>
            </p>

            <p>
                We will now hold your place for 2 minutes while we try to
                re-establish your connection.
            </p>
            <p>
                This could be due to issues with your Wi-Fi or mobile
                connection.
            </p>

            {moreInfo && (
                <p>
                    We are still trying to re-connect you. If the issue
                    persists, you can call us for free anytime on{' '}
                    <a
                        aria-label="Samaritans phone number 116 123"
                        href="tel:116123"
                    >
                        116 123
                    </a>{' '}
                    or find another service.
                </p>
            )}

            <h3 className="mb-0">What You Can Do</h3>
            <ul className="errorList">
                <li>1. Ensure you have a good internet connection.</li>
                <li>
                    2. If possible, move to a location with better connectivity.
                </li>
            </ul>
        </PurpleRoomCoverPanel>
    );
};

export default NetworkIssue;
