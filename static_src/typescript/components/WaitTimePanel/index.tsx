import React, { ReactNode } from 'react';

import { timeDisplay } from '../../utils/wait-time';

import ClockIcon from '../ClockIcon';
import StyledWaitTime, { Copy } from './styled';

type Props = {
    waitTime: number | null;
    children?: ReactNode;
    beforeTime?: ReactNode;
} & typeof defaultProps;

const defaultProps = {
    paused: false,
};

const WaitTimePanel = ({ waitTime, children, paused, beforeTime }: Props) => (
    <>
        <ClockIcon paused={paused} large />
        <div>
            <span
                aria-live="polite"
                aria-label={`There is currently a ${timeDisplay(
                    waitTime,
                )} wait time.`}
            />
            {beforeTime && <Copy>{beforeTime}</Copy>}
            <StyledWaitTime>{timeDisplay(waitTime)}</StyledWaitTime>
            {children}
        </div>
    </>
);
WaitTimePanel.defaultProps = defaultProps;

export default WaitTimePanel;
