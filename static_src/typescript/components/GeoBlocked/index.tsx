import React from 'react';

import PurpleRoomCoverPanel from 'components/RoomCoverPanels/Purple';
import LinkButton from 'components/LinkButton';

const GeoBlocked = () => (
    <PurpleRoomCoverPanel>
        <h1 hidden>Geo-blocked</h1>
        <h2>
            Unfortunately this service isn't available outside of the United
            Kingdom
        </h2>
        <LinkButton href="https://www.befrienders.org/">
            Find a service in your country
        </LinkButton>
        <LinkButton href="https://www.samaritans.org/">
            Go to Samaritans.org
        </LinkButton>
    </PurpleRoomCoverPanel>
);

export default GeoBlocked;
