import styled from 'styled-components';
import device from 'styles/device';

import RoomWithoutSidePanel from 'components/RoomWithoutSidePanel/styled';

export const StyledServiceUnavailablePanel = styled(RoomWithoutSidePanel)`
    height: 100vh;

    @media ${device.mobLandscape} {
        height: unset;
        margin: 2rem auto;
    }

    @media ${device.tabletPortrait} {
        height: unset;
        margin: 2rem auto;
    }

    h2 {
        text-align: center;
        margin-bottom: 2rem;

        @media ${device.tabletPortrait} {
            margin-bottom: 3rem;
        }
    }

    p {
        margin-bottom: 1.5rem;

        @media ${device.tabletPortrait} {
            margin-bottom: 2rem;
        }
    }
`;

export const StyledBannerWrapper = styled.div`
    max-width: calc(${(props) => props.theme.grid.siteWidth} / 1.75);
    margin: 0 auto 2rem;

    @media ${device.tabletLandscape} {
        margin: 2rem auto 0;
    }
`;

export const FullPageCoverPanel = styled.div`
    margin: 0 auto;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    top: 0;

    p {
        @media ${device.mobLandscape} {
            max-width: 470px;
        }
    }
`;
