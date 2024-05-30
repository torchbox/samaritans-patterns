import styled from 'styled-components';
import device from 'styles/device';

const StyledRoomCoverPanel = styled.main`
    max-width: ${(props) => props.theme.grid.siteWidth};
    margin: 0 auto;
    position: fixed;
    z-index: 5;
    width: 100%;
    height: 100%;
    max-height: 840px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    text-align: center;
    top: 0;

    @media ${device.tabletLandscape} {
        position: absolute;
        top: 7rem;
        left: 50%;
        transform: translate(-50%, 0);
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-bottom: 1.5rem;

        @media ${device.mobLandscape} {
            max-width: 470px;
        }
    }

    p {
        font-size: 1.1rem;

        @media ${device.mobLandscape} {
            max-width: 470px;
        }
    }

    svg {
        width: 64px;
        height: 64px;
        margin-bottom: 1rem;
    }
`;

export default StyledRoomCoverPanel;
