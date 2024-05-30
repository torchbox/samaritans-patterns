import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import LinkButton from 'components/LinkButton';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';

const ServerErrorPanel = () => (
    <PurpleRoomCoverPanel>
        <WarningIcon />
        <>
            <h2>We’re experiencing a problem with this service</h2>
            <p>
                We understand this is frustrating for you and we’re doing
                everything we can to fix the problem.
            </p>
            <h3>
                You can call us free any time, from any phone on{' '}
                <a
                    aria-label="Samaritans phone number 116 123"
                    href="tel:116123"
                >
                    116 123
                </a>
            </h3>
            <LinkButton
                href="https://www.samaritans.org/how-we-can-help/contact-samaritan/"
                secondary
            >
                Find another service
            </LinkButton>
        </>
    </PurpleRoomCoverPanel>
);

export default ServerErrorPanel;
