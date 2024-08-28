import styled from 'styled-components';

const StyledWaitTime = styled.div`
    color: ${(props) => props.theme.colors.white};
    margin-bottom: 0.5rem;
    font-weight: ${(props) => props.theme.fonts.bold};
    font-size: 30px;
`;

export const Copy = styled.p`
    color: ${(props) => props.theme.colors.white};
    margin-bottom: 0.5rem;
    font-size: ${(props) => props.theme.fonts.m};
`;

export default StyledWaitTime;
