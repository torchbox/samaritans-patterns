import styled from 'styled-components';

import StyledRoomCoverPanel from 'components/RoomCoverPanels/styled';
import StyledLinkButton from 'components/LinkButton/styled';

const WhitePanel = styled(StyledRoomCoverPanel)`
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.body};

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        color: ${(props) => props.theme.colors.primary};
    }

    a {
        color: ${(props) => props.theme.colors.body};
    }

    p {
        text-align: left;
    }

    button {
        background-color: ${(props) => props.theme.colors.lightPurple};
        border-color: ${(props) => props.theme.colors.lightPurple};

        ${(props) => props.theme.hover} {
            color: ${(props) => props.theme.colors.lightPurple};
        }
    }

    svg {
        fill: ${(props) => props.theme.colors.lightPurple};
    }

    ${StyledLinkButton} {
        margin-top: 1rem;
        color: ${(props) => props.theme.colors.white};
    }
`;

export default WhitePanel;
