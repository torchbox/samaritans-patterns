import styled from 'styled-components';

const StyledTertiaryButton = styled.button`
    background: none;
    border: none;
    margin: 0 auto 1rem;
    display: block;
    text-decoration: underline;
    font-weight: ${(props) => props.theme.fonts.bold};
    color: ${(props) => props.theme.colors.primary};
`;

export default StyledTertiaryButton;
