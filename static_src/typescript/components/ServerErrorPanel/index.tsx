import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import LinkButton from 'components/LinkButton';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning.svg';

const ServerErrorPanel = () => (
    <PurpleRoomCoverPanel>
        <WarningIcon />
        <>
            <h2>Service Unavailable</h2>
            <p>
                We’re currently experiencing issues with our online chat
                service. We understand this is frustrating and we’re working
                hard to resolve it.
            </p>
            <br />

            <h3 className="mb-0">What You Can Do</h3>
            <ul className="errorList">
                <li>1. Ensure you’re not using any pop-up blockers.</li>
                <li>
                    2. Check that your browser and operating system are up to
                    date.
                </li>
                <li>3. Try accessing the service from a different device.</li>
            </ul>

            <h3>
                You can also call us for free anytime from any phone on{' '}
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
