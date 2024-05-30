import styled from 'styled-components';
import device from 'styles/device';

const StyledJoiningQueue = styled.div`
    max-width: ${(props) => props.theme.grid.siteWidth};
    margin: 0 auto;
    position: relative;
    display: flex;
    background-color: ${(props) => props.theme.colors.primary};
    width: 100%;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 56px;
    height: 100vh;
    text-align: center;
    color: ${(props) => props.theme.colors.white};
    padding: 1rem;

    @media ${device.mobLandscape} {
        top: 36px;
    }

    @media ${device.tabletLandscape} {
        margin: 4rem auto;
        max-height: 580px;
        top: 54px;
    }

    h3,
    h4,
    a {
        color: ${(props) => props.theme.colors.white};
    }

    h3 {
        margin-bottom: 2rem;
    }

    h4 {
        margin-bottom: 1rem;
    }
`;

export default StyledJoiningQueue;
