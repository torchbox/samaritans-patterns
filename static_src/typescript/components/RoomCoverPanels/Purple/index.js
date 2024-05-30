import React from 'react';
import PropTypes from 'prop-types';

import PurplePanel from './styled';

const PurpleRoomCoverPanel = ({ children }) => (
    <PurplePanel>{children}</PurplePanel>
);

PurpleRoomCoverPanel.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PurpleRoomCoverPanel;
