import React, { ReactNode } from 'react';

import StyledInfoPanel, { Variants } from './styled';

type Props = {
    heading: ReactNode;
    children: ReactNode;
    variant?: Variants;
};

const InfoPanel = ({ heading, children, variant }: Props) => (
    <StyledInfoPanel variant={variant}>
        <h3>{heading}</h3>
        {children}
    </StyledInfoPanel>
);

type IconInfoPanelProps = {
    icon: ReactNode;
} & Props;

export const IconInfoPanel = ({
    icon,
    heading,
    children,
    variant,
}: IconInfoPanelProps) => (
    <InfoPanel
        heading={
            <>
                {icon}
                {heading}
            </>
        }
        variant={variant}
    >
        {children}
    </InfoPanel>
);
export default InfoPanel;
