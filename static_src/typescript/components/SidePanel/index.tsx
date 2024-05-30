import React, { ReactNode } from 'react';

import StyledSidePanel, { Variants } from './styled';

type Props = {
    children: ReactNode;
    variants?: Variants[];
};

const defaultProps = {
    variants: [],
};

const SidePanel = ({ children, variants }: Props) => (
    <StyledSidePanel variants={variants}>{children}</StyledSidePanel>
);
SidePanel.defaultProps = defaultProps;

export default SidePanel;
