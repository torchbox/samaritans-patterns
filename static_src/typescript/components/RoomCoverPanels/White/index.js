import React from 'react';
import PropTypes from 'prop-types';

import WhitePanel from './styled';

const WhiteRoomCoverPanel = ({ children }) => (
    <WhitePanel>{children}</WhitePanel>
);

WhiteRoomCoverPanel.propTypes = {
    children: PropTypes.node.isRequired,
};

export default WhiteRoomCoverPanel;
