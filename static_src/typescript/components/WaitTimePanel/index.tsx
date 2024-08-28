import React, { ReactNode } from 'react';

import { timeDisplay } from '../../utils/wait-time';

import ClockIcon from '../ClockIcon';
import StyledWaitTime, { Copy } from './styled';
import ScreenReaderAnnounce from '../ScreenReaderAnnounce';

type Props = {
    waitTime: number | null;
    children?: ReactNode;
    beforeTime?: ReactNode;
    paused?: boolean;
};

const WaitTimePanel = ({
    waitTime,
    children,
    paused = false,
    beforeTime,
}: Props) => (
    <>
        <ClockIcon paused={paused} large />

        <ScreenReaderAnnounce
            text={`The current estimated wait time is ${timeDisplay(
                waitTime,
            )}.`}
        />

        <div>
            {beforeTime && <Copy>{beforeTime}</Copy>}
            <StyledWaitTime>{timeDisplay(waitTime)}</StyledWaitTime>
            {children}
        </div>
    </>
);

export default WaitTimePanel;
