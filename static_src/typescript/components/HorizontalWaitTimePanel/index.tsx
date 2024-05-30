import React from 'react';
import { useSelector } from 'react-redux';

import { timeDisplay } from '../../utils/wait-time';

import ClockIcon from '../ClockIcon';
import { Content, Panel, WaitTime } from './styled';
import type { RootState } from '../../store';

const HorizontalWaitTimePanel = () => {
    const averageQueueAnswerTime = useSelector(
        (state: RootState) => state.queue.averageQueueAnswerTime,
    );

    const time = timeDisplay(averageQueueAnswerTime);

    return (
        <Panel>
            <ClockIcon paused={false} large />
            <Content>
                <span
                    aria-live="polite"
                    aria-label={`There is currently a ${time} wait time.`}
                />
                <p>Estimated time remaining</p>
                <WaitTime>{time}</WaitTime>
            </Content>
        </Panel>
    );
};

export default HorizontalWaitTimePanel;
