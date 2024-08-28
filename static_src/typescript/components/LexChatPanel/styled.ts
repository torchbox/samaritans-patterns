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

type HeaderProps = {
    status?: string;
};

export const ChatRoomHeader = styled.header<HeaderProps>`
    display: flex;
    position: relative;
    z-index: 1;
    background-color: ${({ status, theme }) =>
        (status === 'Not Started' && `${theme.colors.darkBlue}`) ||
        (status === 'Offline' && `${theme.colors.lightPurple}`) ||
        `${theme.colors.primary}`};
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem;
    transition: background-color 0.2s ease;
    min-height: 55px;

    @media ${device.mobLandscape} {
        padding: 1rem;
        min-height: 65px;
    }
`;

export const ChatRoomStatus = styled.div`
    display: flex;
    flex: 1;
    margin-right: 0.5rem;
    margin-left: 2.8rem;

    @media ${device.mobLandscape} {
        margin-right: 1rem;
        margin-left: 3.5rem;
    }

    @media ${device.tabletLandscape} {
        margin-left: 0;
    }
`;

type ChatRoomStatusTextProps = {
    variant?: 'default' | 'orange';
};

export const ChatRoomExitButton = styled.button<ChatRoomStatusTextProps>`
    font-size: ${(props) => props.theme.fonts.xs};
    appearance: none;
    background-color: ${(props) =>
        props.variant === 'orange'
            ? props.theme.colors.darkOrange
            : props.theme.colors.white};
    border: none;
    color: ${(props) =>
        props.variant === 'orange'
            ? props.theme.colors.white
            : props.theme.colors.primary};
    border-radius: 4px;
    font-weight: ${(props) => props.theme.fonts.bold};
    padding: 0.3rem 0.55rem;
`;

ChatRoomExitButton.displayName = 'ChatRoomExitButton';

export default StyledLexChatPanel;
