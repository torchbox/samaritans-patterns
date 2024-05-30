import styled from 'styled-components';

import StyledRoomCoverPanel from 'components/RoomCoverPanels/styled';
import StyledLinkButton from 'components/LinkButton/styled';

const PurplePanel = styled(StyledRoomCoverPanel)`
    background-color: ${(props) => props.theme.colors.lightPurple};
    color: ${(props) => props.theme.colors.white};

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        color: ${(props) => props.theme.colors.white};
    }

    a {
        border-color: ${(props) => props.theme.colors.white};
        color: ${(props) => props.theme.colors.white};
    }

    ${StyledLinkButton} {
        border-color: ${(props) => props.theme.colors.white};
        background: ${(props) => props.theme.colors.white};
        color: ${(props) => props.theme.colors.lightPurple};

        ${(props) => props.theme.hover} {
            background: ${(props) => props.theme.colors.lightPurple};
            color: ${(props) => props.theme.colors.white};
        }
    }

    svg {
        fill: ${(props) => props.theme.colors.white};
    }
`;

export default PurplePanel;
