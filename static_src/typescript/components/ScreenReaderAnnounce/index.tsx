import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    text: string;
};

const ScreenReaderAnnounce = ({ text }: Props) => {
    const [displayStatus, setDisplayStatus] = useState(false);

    // Display the text for 1 second to announce the change to screen readers.
    useEffect(() => {
        setDisplayStatus(true);

        setTimeout(() => {
            setDisplayStatus(false);
        }, 1000);
    }, [text]);

    return createPortal(
        <span
            style={{
                display: displayStatus ? 'block' : 'none',
                height: '0',
                overflow: 'hidden',
            }}
        >
            {text}
        </span>,
        document.querySelector(
            '#screen_reader_announcements',
        ) as HTMLDivElement,
    );
};

export default ScreenReaderAnnounce;
