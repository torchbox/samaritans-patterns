import styled from 'styled-components';

type TitleProps = {
    readonly paused: boolean;
    readonly large: boolean;
};

const StyledClock = styled.div<TitleProps>`
    position: relative;
    height: calc(${(props) => (props.large ? '8px' : '4px')} * 10);
    width: calc(${(props) => (props.large ? '8px' : '4px')} * 10);
    border: ${(props) => (props.large ? '8px' : '4px')} solid
        ${(props) => props.theme.colors.tertiary};
    border-radius: 50%;
    margin: ${(props) => (props.large ? '0 auto' : '0')};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: calc(${(props) => props.theme.grid.baseGrid} / 2.5);
    transform: scale(0.8);

    &::before {
        content: '';
        height: ${(props) => (props.large ? '8px' : '4px')};
        width: ${(props) => (props.large ? '20px' : '11px')};
        background-color: ${(props) => props.theme.colors.tertiary};
        position: absolute;
        top: ${(props) => (props.large ? '-20px' : '-11px')};
    }

    &::after {
        content: '';
        height: ${(props) => (props.large ? '8px' : '4px')};
        width: ${(props) => (props.large ? '8px' : '4px')};
        background-color: ${(props) => props.theme.colors.tertiary};
        position: absolute;
        top: -4px;
        left: calc(${(props) => (props.large ? '8px' : '4px')} * 8);
        transform: rotate(45deg);
    }

    > div {
        position: relative;
        height: ${(props) => (props.large ? '25px' : '15px')};
        width: ${(props) => (props.large ? '8px' : '4px')};
        background-color: ${(props) => props.theme.colors.tertiary};
        transform-origin: 50% 100%;
        animation: ${(props) =>
            props.large ? 'hourHand 10s linear infinite' : 'none'};
        top: ${(props) => (props.large ? '-13px' : '-6px')};
        animation-play-state: ${(props) =>
            props.paused ? 'paused' : 'running'};
    }

    @keyframes hourHand {
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default StyledClock;
