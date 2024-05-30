import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';

type Props = {
    moreInfo?: boolean;
};

const NetworkIssue = ({ moreInfo }: Props) => (
    <PurpleRoomCoverPanel>
        <WarningIcon />
        <h2>There is a problem with your connection</h2>
        <p>
            This could be because of an issue with your wifi or mobile data.
            We’ll hold your place for 2 minutes while we try to reconnect with
            you.
        </p>
        <p>If you can, get to somewhere you have a good internet connection.</p>
        {moreInfo && (
            <>
                <p>We are still trying to reconnect you.</p>
                <p>
                    You can call us free any time on{' '}
                    <a
                        aria-label="Samaritans phone number 116 123"
                        href="tel:116123"
                    >
                        116 123
                    </a>{' '}
                    or alternatively{' '}
                    <a
                        aria-label="A link to other Samaritans services"
                        href="https://www.samaritans.org/how-we-can-help/contact-samaritan/"
                    >
                        find another service
                    </a>
                    .
                </p>
            </>
        )}
    </PurpleRoomCoverPanel>
);

export default NetworkIssue;
