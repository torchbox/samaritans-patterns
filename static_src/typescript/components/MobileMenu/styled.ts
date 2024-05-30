import styled from 'styled-components';
import device from 'styles/device';

const StyledMobileMenu = styled.div`
    position: absolute;
    left: 0.7rem;
    top: 0.5rem;

    @media ${device.mobLandscape} {
        left: 1rem;
        top: 1rem;
    }
`;

export const OpenIcon = styled.button`
    background: transparent;
    border: 0;
    padding: 0;

    svg {
        width: 2rem;
        height: 2.5rem;

        @media ${device.mobLandscape} {
            width: 2.5rem;
            height: 2.7rem;
        }
    }
`;

export const CloseIcon = styled.button`
    color: ${(props) => props.theme.colors.primary};
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    font-weight: ${(props) => props.theme.fonts.bold};
    font-size: 2rem;
    border: 0;
    background: ${(props) => props.theme.colors.white};
    line-height: 1;
    padding: 0;
`;

export const Content = styled.div`
    padding: 4rem 1rem 1rem;
    text-align: left;

    a {
        color: ${(props) => props.theme.colors.primary};
    }
`;

export default StyledMobileMenu;
