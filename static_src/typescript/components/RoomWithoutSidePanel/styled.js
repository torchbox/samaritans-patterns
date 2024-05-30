import styled from 'styled-components';
import device from 'styles/device';

const RoomWithoutSidePanel = styled.main`
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.body};
    max-width: calc(${(props) => props.theme.grid.siteWidth} / 1.75);
    text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
    padding: ${(props) => props.theme.grid.baseGrid}
        ${(props) => props.theme.grid.baseGrid}
        calc(${(props) => props.theme.grid.baseGrid} * 3);
    margin: 0 auto;

    @media ${device.tabletPortrait} {
        padding: calc(${(props) => props.theme.grid.baseGrid} * 3);
        margin: 4rem auto;
    }
`;

export default RoomWithoutSidePanel;
