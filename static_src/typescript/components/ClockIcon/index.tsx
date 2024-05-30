import React from 'react';

import StyledClock from './styled';

type Props = {
    paused: boolean;
} & typeof defaultProps;

const defaultProps = {
    large: false,
};

const ClockIcon = ({ paused, large }: Props) => (
    <StyledClock paused={paused} aria-hidden="true" large={large}>
        <div />
    </StyledClock>
);

ClockIcon.defaultProps = defaultProps;

export default ClockIcon;
