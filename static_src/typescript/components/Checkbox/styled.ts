import styled from 'styled-components';

type StyledCheckboxProps = {
    checked?: boolean;
};

export const StyledCheckbox = styled.div<StyledCheckboxProps>`
    display: inline-block;
    width: 36px;
    height: 36px;
    background-color: ${(props) =>
        props.checked
            ? props.theme.colors.secondary
            : props.theme.colors.white};
    border: 1px solid
        ${(props) =>
            props.checked
                ? props.theme.colors.secondary
                : props.theme.colors.midGrey};
    border-radius: 3px;
    transition: background-color
        ${(props) => props.theme.transitions.quickTransition};
    margin-right: 1rem;

    svg {
        fill: white;
        visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
        width: 34px;
        height: 34px;
    }

    &:hover {
        cursor: pointer;
    }
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;

    &:focus {
        + ${StyledCheckbox} {
            outline: 2px solid ${(props) => props.theme.colors.primary};
            outline-offset: -2px;
        }
    }
`;

export const CheckboxContainer = styled.div`
    display: inline-block;
    vertical-align: middle;
`;
