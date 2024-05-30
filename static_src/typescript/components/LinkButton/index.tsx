import React from 'react';

import StyledLinkButton from './styled';

type Props = {
    href?: string;
    children: React.ReactNode;
    secondary?: boolean;
};

const LinkButton = ({ href, children, secondary }: Props) => (
    <StyledLinkButton href={href} secondary={secondary}>
        {' '}
        {children}{' '}
    </StyledLinkButton>
);

export default LinkButton;
