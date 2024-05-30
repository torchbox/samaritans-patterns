import styled from 'styled-components';
import device from 'styles/device';

import RoomWithoutSidePanel from 'components/RoomWithoutSidePanel/styled';

const StyledSentryBoundary = styled(RoomWithoutSidePanel)`
    text-align: center;

    h2 {
        margin-bottom: 1.5rem;
    }

    p {
        margin-bottom: 1.5rem;

        @media ${device.tabletPortrait} {
            margin-bottom: 2rem;
        }
    }
`;

export default StyledSentryBoundary;
