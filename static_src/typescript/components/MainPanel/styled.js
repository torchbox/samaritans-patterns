import styled from 'styled-components';
import device from 'styles/device';

const StyledMainPanel = styled.main`
    padding: ${(props) => props.theme.grid.baseGrid};
    flex: 1;

    @media ${device.tabletLandscape} {
        padding: 4rem 3rem;
        min-height: 680px;
    }
`;

export default StyledMainPanel;
