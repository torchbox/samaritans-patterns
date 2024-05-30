import styled from 'styled-components';
import device from 'styles/device';

const StyledReadyScreen = styled.main`
    position: fixed;
    width: 100%;
    background-color: ${(props) => props.theme.colors.primary};
    height: 100%;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10vh 1.5rem 0;
    text-align: center;

    @media ${device.mobLandscape} {
        top: 36px;
    }

    @media ${device.tabletLandscape} {
        top: 54px;
        padding: 15vh 1rem 0;
    }

    img {
        margin-bottom: 1rem;
        width: 60px;

        @media ${device.tabletLandscape} {
            width: auto;
        }
    }

    h2 {
        color: ${(props) => props.theme.colors.white};
        margin-bottom: 2rem;
        font-size: 1.5rem;

        @media ${device.tabletLandscape} {
            font-size: 2rem;
        }
    }

    button {
        color: ${(props) => props.theme.colors.primary};
        background-color: ${(props) => props.theme.colors.white};
        border-color: ${(props) => props.theme.colors.white};

        ${(props) => props.theme.hover} {
            background-color: ${(props) => props.theme.colors.primary};
            color: ${(props) => props.theme.colors.white};
        }
    }

    svg {
        fill: ${(props) => props.theme.colors.tertiary};
    }
`;

export default StyledReadyScreen;
