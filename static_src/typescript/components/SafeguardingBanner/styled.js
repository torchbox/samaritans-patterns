import styled from 'styled-components';
import device from 'styles/device';

const StyledSafeguardingBanner = styled.div`
    max-width: ${(props) => props.theme.grid.siteWidth};
    padding: ${(props) => props.theme.grid.baseGrid};
    margin: 0 auto;
    background-color: #73cfe8;
    display: flex;
    color: #0c3d52;

    @media ${device.tabletLandscape} {
        margin: 2rem auto 0;
        padding: 2rem 3rem;
    }

    svg {
        width: 20px;
        height: 19px;
        flex-shrink: 0;
        margin-right: 10px;

        @media ${device.tabletLandscape} {
            width: 40px;
            height: 38px;
            margin-right: 18px;
        }
    }

    p {
        margin-bottom: 0.5rem;
    }
`;

export const StyledHeading = styled.p`
    font-weight: bold;
`;

export const StyledLink = styled.a`
    color: #0c3d52;
    text-decoration: underline;
`;

export default StyledSafeguardingBanner;
