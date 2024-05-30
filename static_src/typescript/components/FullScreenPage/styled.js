import styled from 'styled-components';

const StyledFullScreenPage = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: ${(props) => props.theme.colors.white};
    z-index: 10;

    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;

export default StyledFullScreenPage;
