import styled from 'styled-components';
import device from 'styles/device';

export type Variants = 'textLeft' | 'textCenter' | 'vCenter';

type SidePanelProps = {
    variants?: Variants[];
};

const StyledSidePanel = styled.aside<SidePanelProps>`
    display: flex;
    align-items: 'center';
    justify-content: flex-start;
    flex-direction: column;
    padding: ${(props) => props.theme.grid.baseGrid};
    padding-top: ${(props) =>
        props.variants?.includes('vCenter')
            ? props.theme.grid.baseGrid
            : '4rem'};
    order: -1;
    background-color: ${(props) => props.theme.colors.primary};
    text-align: ${(props) =>
        props.variants?.includes('textCenter') ? 'center' : 'left'};
    flex-basis: 250px;

    @media ${device.tabletLandscape} {
        padding: ${(props) =>
            props.variants?.includes('vCenter')
                ? '12rem 3rem 4rem'
                : '4rem 3rem'};
        order: 0;
    }
`;

type SidePanelInfoProps = {
    bold?: boolean;
};

export const StyledSidePanelInfo = styled.p<SidePanelInfoProps>`
    color: ${(props) => props.theme.colors.white};
    font-size: 19px;
    margin-bottom: 0.5rem;
    width: 100%;
    font-weight: ${(props) =>
        props.bold ? props.theme.fonts.bold : props.theme.fonts.normal};
`;

export default StyledSidePanel;
