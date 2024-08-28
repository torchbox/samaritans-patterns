import styled from 'styled-components';

const NotificationPanel = styled.div`
    text-align: center;
    margin-bottom: 2rem;

    > svg {
        fill: ${(props) => props.theme.colors.tertiary};
        width: 40px;
        height: 40px;
        margin-bottom: 1rem;
    }

    > img,
    h1 {
        margin-bottom: 1rem;
    }
`;

export const Intro = styled.p`
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 2rem;
`;

type SmallProps = {
    error?: boolean;
};

export const Small = styled.p<SmallProps>`
    font-size: ${(props) => props.theme.fonts.xxs};
    margin-bottom: 1rem;
    text-align: center;

    ${(props) =>
        props.error &&
        `
        color: ${props.theme.colors.red};
    `}
`;

type LabelProps = {
    checked?: boolean;
};

export const Label = styled.label<LabelProps>`
    color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) =>
        props.checked
            ? props.theme.colors.tertiary30
            : props.theme.colors.lightGrey30};
    border: 1px solid
        ${(props) =>
            props.checked
                ? props.theme.colors.tertiary
                : props.theme.colors.grey};
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    border-radius: 50px;
    transition: background-color, border,
        ${(props) => props.theme.transitions.quickTransition};
    user-select: none;
    font-weight: ${(props) => props.theme.fonts.bold};
    margin-bottom: 1rem;

    ${(props) => props.theme.hover} {
        cursor: pointer;
    }

    span.asterisk {
        color: ${(props) => props.theme.colors.red};
    }
`;

export const Copy = styled.p`
    margin-bottom: 2rem;
`;

export default NotificationPanel;
