import React from 'react';

import StyledConnectionBar from './styled';

type Props = {
    avatar: React.ReactNode;
    description: string;
    heading: string;
    offline: boolean;
};

const ConnectionBar = ({ avatar, description, heading, offline }: Props) => (
    <StyledConnectionBar offline={offline}>
        {avatar}
        <div aria-live="polite">
            <h1>{heading}</h1>
            <p>{description}</p>
        </div>
    </StyledConnectionBar>
);

export default ConnectionBar;
