import React, { useState } from 'react';
import Dock from 'react-dock';

import { ReactComponent as MenuIcon } from 'assets/svgs/burger-menu.svg';

import Version from 'components/Version';
import { useWindowSize } from 'utils/hooks';

import StyledMobileMenu, { OpenIcon, CloseIcon, Content } from './styled';

type Props = {
    children: React.ReactNode;
};

const MobileMenu = ({ children }: Props) => {
    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth < 1024;
    const [isVisible, setVisibility] = useState(false);

    const dockStyle = {
        visibility: isVisible ? 'visible' : 'hidden',
    };

    const mobileMenuPanel = (
        <Dock
            isVisible={isVisible}
            position="left"
            dimMode="opaque"
            fluid={false}
            size={280}
            zIndex={10}
            dockStyle={dockStyle}
        >
            <div id="mobile-dock">
                <CloseIcon
                    aria-label="Close the mobile menu"
                    onClick={() => setVisibility(!isVisible)}
                >
                    &#10005;
                </CloseIcon>
                <Version isHidden />
                <Content>{children}</Content>
            </div>
        </Dock>
    );

    if (isMobile) {
        return (
            <>
                {mobileMenuPanel}
                <StyledMobileMenu
                    aria-expanded={isVisible}
                    aria-controls="mobile-dock"
                    aria-label="Open the mobile menu"
                >
                    <OpenIcon onClick={() => setVisibility(!isVisible)}>
                        <MenuIcon />
                    </OpenIcon>
                </StyledMobileMenu>
            </>
        );
    }

    if (isVisible) {
        setVisibility(false);
    }

    return mobileMenuPanel;
};

export default MobileMenu;
