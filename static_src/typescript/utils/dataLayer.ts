type ChatEvent = {
    event: 'chat';
    chat_msg: string;
};

type ChatErrorEvent = {
    event: 'chatError';
    errorMessage: string;
};

type DataLayerEvent = ChatEvent | ChatErrorEvent;

/**
 * Wrapper around dataLayer.push to ensure that the dataLayer is available
 * */
export const dataLayerPush = (data: DataLayerEvent) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
};
