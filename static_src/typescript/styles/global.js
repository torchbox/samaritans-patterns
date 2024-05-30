import { createGlobalStyle } from 'styled-components';
import device from 'styles/device';

const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        font-family: ${(props) => props.theme.fonts.primaryFont};
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    body {
        background-color: ${(props) => props.theme.colors.white};
        color: ${(props) => props.theme.colors.body};
        font-size: ${(props) => props.theme.fonts.default};
        line-height: 1.4;
        padding: 0;
        margin: 0;
        overflow-x: hidden;

        @media ${device.mobLandscape} {
            background-color: ${(props) => props.theme.colors.lightGrey};
        }

        &.ReactModal__Body--open {
            overflow: hidden;
        }
    }

    html,
    body {
        height: 100%;
    }

    /* IE11 */
    main {
        display: block;
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${(props) => props.theme.colors.primary};
        margin: 0 0 1rem;
    }

    h1 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    h3 {
        font-size: 1.2rem;
    }

    h4 {
        font-size: 1rem;
    }

    h5 {
        font-size: 0.8rem;
    }

    h6 {
        font-size: 0.7rem;
    }

    p {
        margin: 0 0 1rem;
    }

    /* Prevent empty space below images appearing */
    img,
    svg {
        vertical-align: top;
    }

    img {
        height: auto;
        max-width: 100%;
    }

    button, input, select, textarea {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    button {
        ${(props) => props.theme.hover} {
            cursor: pointer;
        }
    }

    a {
        color: ${(props) => props.theme.colors.body};
        text-decoration: underline;
        transition: color $transition;

        ${(props) => props.theme.hover} {
            color: darken(${(props) => props.theme.colors.primary}, 20%);
            cursor: pointer;
        }
    }

    ul,
    ol {
        padding-left: ${(props) => props.theme.grid.baseGrid};

        li {
            margin-bottom: 10px;
        }
    }

    /* Utilities */
    .is-tall {
        height: 100%;
    }

    /* Vendor overrides */
    .rc-slider-tooltip {
        user-select: none;

        &:hover {
            cursor: grab;
        }

        &:active {
            cursor: grabbing;
        }
    }

    .rc-slider-tooltip-inner {
        font-weight: 700;
        color: #115e67 !important;
        font-size: 1rem !important;
        border: 1px solid #115e67 !important;
        background-color: white !important;
        border-radius: 50% !important;
        height: 30px !important;
        width: 30px;
    }

    .rc-slider-tooltip-arrow {
        display: none;
    }
`;

export default GlobalStyle;
