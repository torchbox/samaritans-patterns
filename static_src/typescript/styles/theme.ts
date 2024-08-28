import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
    // ------ Colors -------
    colors: {
        primary: '#115e67',
        secondary: '#00a589',
        tertiary: '#b6d8a3',
        deepBlue: '#045',
        lightGreen: '#e9f3e3',
        midGreen: '#15a0ab',
        darkGreen: '#0d4850',
        body: '#474747',

        // Supporting palette
        orange: '#f5a623',
        darkOrange: '#eb6c34',
        yellow: '#fecb4e',
        midBlue: '#009bc8',
        lightPurple: '#6e2b62',
        red: '#bd312a',
        green: '#7ed321',
        darkPurple: '#35102e',
        lightPink: '#f8f4F3',
        darkBlue: '#045',

        // Standard colours
        white: '#fff',
        offWhite: '#f4f7f8',
        black: '#000',
        lightGrey: '#e8e8e8',
        grey: '#e1e1e1',
        lightMidGrey: '#f0f0f0',
        midGrey: '#737373',
        darkGrey: '#4a4a4a',

        // transparent
        lightGrey30: 'rgba(232, 232, 232, 0.3)',
        tertiary30: 'rgba(183, 216, 163, 0.3)',
    },

    // ------ Fonts -------
    fonts: {
        primaryFont: `'Varah', Sans-serif`,

        // Weights
        bold: 700,
        normal: 400,

        // Sizes
        baseLineHeight: '25px',
        default: '16px',
        xxl: '36px',
        xl: '28px',
        l: '21px',
        m: '18px',
        s: '15px',
        xs: '14px',
        xxs: '12px',
    },

    // ------ Grid Dimensions -------
    grid: {
        // Wrappers
        siteWidth: '1100px',
        baseGrid: '21px',
    },

    // ------ Transitions -------
    transitions: {
        quickTransition: '0.15s ease-in-out',
        transition: '0.25s ease-out',
    },

    // ------ Hover states -------
    hover: '&:hover, &:active, &:focus',
};

export default theme;
