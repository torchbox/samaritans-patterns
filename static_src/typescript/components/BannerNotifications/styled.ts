import styled from 'styled-components';
import device from 'styles/device';

const ToggleContainer = styled.div`
    p {
        margin-bottom: 0;
        margin-right: 1rem;
    }

    > label {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    @media ${device.tabletLandscape} {
        > label {
            justify-content: center;
        }
    }
`;

export const Heading = styled.h2`
    font-size: 1rem;
    font-weight: ${(props) => props.theme.fonts.normal};

    @media ${device.tabletLandscape} {
        font-size: 1.5rem;
    }
`;

export const Copy = styled.p`
    margin-bottom: 0;
`;

export const Block = styled.div`
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGrey};

    &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: 0;
    }
`;

export default ToggleContainer;
