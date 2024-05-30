import styled from 'styled-components';
import device from 'styles/device';

const ButtonsWrapper = styled.div`
    @media ${device.mobLandscape} {
        display: flex;
        margin: 2rem 0 1rem;

        > button:nth-of-type(2) {
            margin-left: 1rem;
        }
    }
`;

export default ButtonsWrapper;
