/**
 * Wrapper around dataLayer.push to ensure that the dataLayer is available
 * */
export const dataLayerPush = (data: any) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
};
