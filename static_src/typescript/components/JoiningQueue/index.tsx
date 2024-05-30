import React, { useCallback, useEffect, useState } from 'react';

import Spinner from 'components/Spinner';

import StyledJoiningQueue from './styled';

const JoiningQueue = () => {
    // Wait for 10 seconds before showing more information
    const [seconds, setSeconds] = useState(10);

    const tick = useCallback(() => {
        if (seconds > 0) {
            setSeconds((seconds) => seconds - 1);
        }
    }, [seconds]);

    useEffect(() => {
        const timerID = setInterval(tick, 1000);
        return () => clearInterval(timerID);
    }, [tick]);

    return (
        <StyledJoiningQueue>
            <div>
                <Spinner />
                <h3>Entering the waiting room...</h3>
                {seconds <= 0 && (
                    <>
                        <h4>
                            We are still trying to connect you, but it&apos;s
                            taking longer than expected.
                        </h4>
                        <p>
                            You can call us free any time, from any phone on{' '}
                            <a
                                aria-label="Samaritans phone number 116 123"
                                href="tel:116123"
                            >
                                116 123
                            </a>
                            .
                        </p>
                    </>
                )}
            </div>
        </StyledJoiningQueue>
    );
};

export default JoiningQueue;
