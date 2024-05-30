import styled from 'styled-components';
import device from 'styles/device';

const StyledBanner = styled.div`
    display: flex;
    background-color: ${(props) => props.theme.colors.darkGreen};
    color: ${(props) => props.theme.colors.white};
    padding: 0.5rem 1rem;
    align-items: center;
    font-size: 0.9rem;
    height: 56px;

    @media ${device.mobLandscape} {
        height: auto;
    }

    @media ${device.tabletLandscape} {
        padding: 0.3rem 1rem;
        font-size: 1rem;
        background-color: ${(props) => props.theme.colors.primary};
        border-bottom: 0;
        margin-bottom: 2rem;
    }
`;

export const BannerLabel = styled.p`
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.white};
    font-weight: ${(props) => props.theme.fonts.bold};
    margin-right: 0.5rem;
    margin-bottom: 0;

    @media ${device.tabletLandscape} {
        margin-right: 1rem;
        padding: 0.3rem 1rem;
        color: ${(props) => props.theme.colors.primary};
        background-color: ${(props) => props.theme.colors.white};
    }
`;

export const BannerCopy = styled.p`
    margin-bottom: 0;

    a {
        color: ${(props) => props.theme.colors.white};
    }
`;

type ColumnProps = {
    right?: boolean;
};

export const Column = styled.div<ColumnProps>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.right ? 'flex-end' : 'normal')};
`;

export default StyledBanner;
