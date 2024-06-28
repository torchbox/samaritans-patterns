import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import LinkButton from 'components/LinkButton';

const GeoBlocked = () => (
    <PurpleRoomCoverPanel>
        <h1 hidden>Geo-blocked</h1>
        <h2>Service Not Available Outside UK</h2>
        <p>
            We’re sorry, but this service is only available within the United
            Kingdom.
        </p>
        <LinkButton href="https://www.befrienders.org/">
            Find a service near you
        </LinkButton>
        <LinkButton href="https://www.samaritans.org/">
            Visit Samaritans.org
        </LinkButton>
    </PurpleRoomCoverPanel>
);

export default GeoBlocked;
