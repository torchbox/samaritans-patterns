import React, { useState } from 'react';
import PropTypes from 'prop-types';

import StyledBannerDropdown, { DropdownPanel, BannerButton } from './styled';

const BannerDropdown = ({ title, children }) => {
    const [isVisible, setVisibility] = useState(false);
    return (
        <StyledBannerDropdown>
            <BannerButton
                isVisible={isVisible}
                onClick={() => setVisibility(!isVisible)}
                aria-expanded={isVisible}
                aria-controls="other_ways_to_talk_panel"
            >
                {title}
            </BannerButton>
            <DropdownPanel isVisible={isVisible} id="other_ways_to_talk_panel">
                {children}
            </DropdownPanel>
        </StyledBannerDropdown>
    );
};

BannerDropdown.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default BannerDropdown;
