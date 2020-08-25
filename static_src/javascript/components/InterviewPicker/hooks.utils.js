import { useState, useEffect } from 'react';

// @Todo: Need to update with Sams breakpoints (if needed / can do)
const BREAKPOINTS = {
    'mob-portrait': 320,
    'mob-portrait-med': 375,
    'mob-landscape': 480,
    'med-tablet-portrait': 620,
    'tablet-portrait': 900,
    'tablet-landscape': 1024,
    'desktop': 1280,
    'desktop-wide': 2556,
};

const getBreakpointMatches = () => {
    return Object.keys(BREAKPOINTS).filter((b) => {
        const minWidth = BREAKPOINTS[b];
        return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
    });
};

export const useBreakpoints = () => {
    const [breakpoints, setBreakpoint] = useState(getBreakpointMatches());

    useEffect(() => {
        const handleResize = () => {
            setBreakpoint(getBreakpointMatches());
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return breakpoints;
};

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions(),
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
