import styled from 'styled-components';

import StyledClock from 'components/ClockIcon/styled';

export type Variants = 'light' | 'dark';

type StyledInfoPanelProps = {
    variant?: Variants;
};

const StyledInfoPanel = styled.div<StyledInfoPanelProps>`
    margin-bottom: ${(props) => props.theme.grid.baseGrid};
    color: ${(props) =>
        props.variant === 'light'
            ? props.theme.colors.white
            : props.theme.colors.body};

    h2,
    h3 {
        display: flex;
        align-items: center;
        margin-bottom: 0.7rem;
        color: ${(props) =>
            props.variant === 'light'
                ? props.theme.colors.white
                : props.theme.colors.primary};

        img {
            margin-right: 1rem;
            width: 40px;
        }

        ${StyledClock} {
            margin: 0 1rem 0 0;
        }
    }

    p {
        margin: 0;
    }

    a {
        color: ${(props) =>
            props.variant === 'light' ? props.theme.colors.white : 'inherit'};
        font-weight: ${(props) =>
            props.variant === 'light' ? 'bold' : 'inherit'};
    }
`;

export default StyledInfoPanel;
