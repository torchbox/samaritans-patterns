import React, { ReactNode } from 'react';

import { Heading3 } from 'components/Text';
import StyledInfoPanel, { Variants } from './styled';

type Props = {
    heading: ReactNode;
    children: ReactNode;
    variant?: Variants;
    headingAs?: React.ElementType;
};

const InfoPanel = ({ heading, children, variant, headingAs }: Props) => (
    <StyledInfoPanel variant={variant}>
        <Heading3 as={headingAs}>{heading}</Heading3>
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
    headingAs,
}: IconInfoPanelProps) => (
    <InfoPanel
        heading={
            <>
                {icon}
                {heading}
            </>
        }
        headingAs={headingAs}
        variant={variant}
    >
        {children}
    </InfoPanel>
);
export default InfoPanel;
