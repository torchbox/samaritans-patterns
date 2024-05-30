import styled from 'styled-components';
import device from 'styles/device';

type Props = {
    visible: boolean;
};

const StyledLexChatPanel = styled.div<Props>`
    background-color: ${(props) => props.theme.colors.white};
    margin: 0 auto;
    height: calc(100% - 56px);
    display: ${(props) => (props.visible ? 'flex' : 'none')};
    flex-direction: column;
    position: relative;
    overflow: hidden;

    @media ${device.mobLandscape} {
        height: calc(100% - 36px);
    }

    @media ${device.tabletLandscape} {
        height: 100%;
        border: 1px solid ${(props) => props.theme.colors.lightGrey};
        max-width: 610px;
        margin: 4rem auto;
        max-height: 610px;
    }

    #lex-web-ui-iframe {
        margin: 0;
        position: relative;
        height: 100%;
        min-width: auto;
        max-width: 100%;
        width: 100%;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
    }

    #lex-web-ui-iframe iframe {
        box-shadow: none;
        border-radius: 0;
        width: 100%;
    }
`;

export default StyledLexChatPanel;
