import styled from 'styled-components';

type Props = {
    isHidden: boolean;
};

export const StyledVersion = styled.small<Props>`
    color: ${(props) => props.theme.colors.midGrey};

    ${(props) =>
        props.isHidden &&
        `
        color: ${props.theme.colors.white};
        position: absolute;
        left: 1.5rem;
        cursor: default;
        bottom: 1.5rem;
    `}
`;
