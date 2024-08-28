import styled from 'styled-components';
import device from 'styles/device';

export const StyledBannerDropdown = styled.div`
    position: relative;
`;

export const BannerButton = styled.button`
    appearance: none;
    background: ${(props) =>
        props.isVisible
            ? props.theme.colors.white
            : props.theme.colors.primary};
    color: ${(props) =>
        props.isVisible
            ? props.theme.colors.primary
            : props.theme.colors.white};
    border: 0;
    padding: 0.9rem 2rem;
    font-weight: ${(props) => props.theme.fonts.bold};
    font-size: 0.9rem;
    margin-bottom: -4px;

    &:focus {
        outline: 2px solid ${(props) => props.theme.colors.secondary};
        outline-offset: -2px;
    }

    svg {
        fill: ${(props) =>
            props.isVisible
                ? props.theme.colors.primary
                : props.theme.colors.white};
        width: 20px;
        height: 20px;
        margin-right: 0.5rem;
    }
`;

export const DropdownPanel = styled.div`
    position: absolute;
    top: 49px;
    right: 0;
    background-color: ${(props) => props.theme.colors.white};
    z-index: 6;
    text-align: center;
    color: ${(props) => props.theme.colors.primary};
    padding: 2.5rem 3.5rem;
    display: ${(props) => (props.isVisible ? 'block' : 'none')};

    @media ${device.tabletPortrait} {
        min-width: 500px;
    }

    p {
        font-size: 1.1rem;
    }

    div {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
`;

export default StyledBannerDropdown;
