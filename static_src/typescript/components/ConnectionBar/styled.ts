import styled from 'styled-components';
import device from 'styles/device';

type StyledConnectionBarProps = {
    offline: boolean;
};

const StyledConnectionBar = styled.div<StyledConnectionBarProps>`
    font-size: 15px;
    display: flex;
    color: ${(props) => props.theme.colors.white};
    align-items: center;

    svg {
        width: 20px;
        height: 20px;
        margin-right: 0.6rem;
        opacity: 1;
        transition: opacity ${(props) => props.theme.transitions.transition};

        .volunteer-avatar_svg__silhouette {
            transition: fill ${(props) => props.theme.transitions.transition};
            fill: ${(props) =>
                props.offline
                    ? props.theme.colors.grey
                    : props.theme.colors.secondary};
        }

        @media ${device.mobLandscape} {
            width: 36px;
            height: 36px;
            margin-right: 1rem;
        }
    }

    h1 {
        font-size: 0.9rem;
        margin: 0;
        opacity: 1;
        transition: opacity ${(props) => props.theme.transitions.transition};
        color: ${(props) => props.theme.colors.white};

        @media ${device.mobLandscape} {
            font-size: 1rem;
        }
    }

    p {
        font-size: 0.8rem;
        margin: 0;

        @media ${device.mobLandscape} {
            font-size: 0.9rem;
        }
    }
`;

export default StyledConnectionBar;
