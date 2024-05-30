import styled from 'styled-components';
import device from 'styles/device';

const StyledLoadingWebchat = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    background-color: ${(props) => props.theme.colors.primary};
    width: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${(props) => props.theme.colors.white};
    padding: 1rem;
`;

export default StyledLoadingWebchat;
