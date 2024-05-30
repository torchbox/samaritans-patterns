import styled from 'styled-components';

const ButtonLink = styled.button`
    appearance: none;
    border: none;
    color: inherit;
    text-decoration: underline;
    display: inline-block;
    margin-top: 0.5rem;
    background: ${(props) => props.theme.colors.white};
`;

export default ButtonLink;
