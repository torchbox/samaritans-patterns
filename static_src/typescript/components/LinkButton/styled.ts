import styled from 'styled-components';

type Props = {
    secondary?: boolean;
};

const StyledLinkButton = styled.a<Props>`
    font-size: ${(props) => props.theme.fonts.s};
    padding: 0.5rem 1.5rem;
    background-color: ${(props) =>
        props.secondary
            ? props.theme.colors.white
            : props.theme.colors.primary};
    color: ${(props) =>
        props.secondary
            ? props.theme.colors.lightPurple
            : props.theme.colors.white};
    text-align: center;
    width: 100%;
    font-weight: ${(props) => props.theme.fonts.bold};
    border: 2px solid
        ${(props) =>
            props.secondary
                ? props.theme.colors.white
                : props.theme.colors.primary};
    border-radius: 2rem;
    appearance: none;
    margin: 0 auto 1rem;
    transition: color ${(props) => props.theme.transitions.quickTransition},
        background-color ${(props) => props.theme.transitions.quickTransition};
    max-width: 220px;
    display: block;
    text-decoration: none;

    ${(props) => props.theme.hover} {
        cursor: pointer;
        background-color: ${(props) =>
            props.secondary
                ? props.theme.colors.lightPurple
                : props.theme.colors.white};
        color: ${(props) =>
            props.secondary
                ? props.theme.colors.white
                : props.theme.colors.primary};
    }

    &:disabled {
        opacity: 0.7;
        pointer-events: none;
    }
`;

export default StyledLinkButton;
