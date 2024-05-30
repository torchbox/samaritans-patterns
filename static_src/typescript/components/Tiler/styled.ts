import styled from 'styled-components';
import device from 'styles/device';

const TileHeader = styled.div`
    background-color: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.white};
    font-weight: ${(props) => props.theme.fonts.bold};
    padding: 1rem;
    margin-bottom: 2rem;

    @media ${device.tabletPortrait} {
        margin-bottom: 3rem;
    }

    h3 {
        color: ${(props) => props.theme.colors.white};
        margin-bottom: 0;
    }

    p {
        margin: 0 0 0.5rem;
        font-size: 1.2rem;
    }
`;
type TileHeadingProps = {
    bold?: boolean;
};

export const TileHeading = styled.h2<TileHeadingProps>`
    font-weight: ${(props) =>
        props.bold ? props.theme.fonts.bold : props.theme.fonts.normal};
`;

export const TileCopy = styled.p`
    color: ${(props) => props.theme.colors.primary};
`;

export const TileProgressBar = styled.div`
    width: 70%;
    height: 8px;
    background-color: ${(props) => props.theme.colors.lightMidGrey};
    margin: 0 auto;
    border-radius: 10px;

    div {
        height: 8px;
        border-radius: 10px;
        background-color: ${(props) => props.theme.colors.primary};
    }
`;

export const TileContent = styled.div`
    padding: 0 1rem;

    @media ${device.mobLandscape} {
        padding: 0 2rem;
    }

    @media ${device.tabletPortrait} {
        padding: 0 3rem;
    }
`;

export default TileHeader;
