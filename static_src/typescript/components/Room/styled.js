import styled from 'styled-components';
import device from 'styles/device';

const StyledRoom = styled.div`
    display: flex;
    max-width: ${(props) => props.theme.grid.siteWidth};
    background-color: ${(props) => props.theme.colors.white};
    margin: 0 auto;
    position: relative;

    @media ${device.tabletLandscape} {
        margin: 2rem auto 4rem;
    }

    @supports (display: grid) {
        display: grid;

        @media ${device.tabletLandscape} {
            grid-template-columns: 1fr 45%;
        }
    }
`;

export default StyledRoom;
