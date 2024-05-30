import styled from 'styled-components';
import device from 'styles/device';

import RoomWithoutSidePanel from 'components/RoomWithoutSidePanel/styled';

const StyledFeedbackRoom = styled(RoomWithoutSidePanel)`
    padding: 0 0 1rem;
    text-align: center;

    @media ${device.mobLandscape} {
        padding: 0 0 2rem;
    }

    @media ${device.tabletPortrait} {
        padding: 0 0 4rem;
    }
`;

export default StyledFeedbackRoom;
