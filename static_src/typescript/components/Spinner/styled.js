import styled from 'styled-components';

const LoadingIcon = styled.div`
    font-size: 10px;
    margin: 2.5rem auto;
    text-indent: -9999em;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
        to right,
        white 10%,
        rgba(255, 255, 255, 0) 42%
    );
    position: relative;
    animation: spin 1s infinite linear;
    transform: translateZ(0);

    &::after {
        background: ${(props) => props.theme.colors.primary};
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
`;

export default LoadingIcon;
