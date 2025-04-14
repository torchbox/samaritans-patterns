type Assets = {
    appIcon: string;
    audioNotification: string;
};

type Banner = {
    title: string;
    message: string;
    linkText: string;
    linkUrl: string;
};

type Props = {
    queueName: string;
    lexWebUiBaseUrl: string;
    amazonConnectIframeOrigin: string;
    fingerprintEndpoint: string;
    fingerprintPublicApiKey: string;
    fingerprintScriptUrlPattern: string;
    displayBanner: boolean;
    metricsId: string;
    metricsEndpoint: string;
    metricsApiKey: string;
    feedbackEndpoint: string;
    feedbackApiKey: string;
    heartbeatEndpoint: string;
    heartbeatApiKey: string;
    assets: Assets;
    banner?: Banner;
};

class Configuration {
    constructor(
        public queueName: string,
        public lexWebUiBaseUrl: string,
        public amazonConnectIframeOrigin: string,
        public fingerprintEndpoint: string,
        public fingerprintPublicApiKey: string,
        public fingerprintScriptUrlPattern: string,
        public displayBanner: boolean,
        public metricsId: string,
        public metricsEndpoint: string,
        public metricsApiKey: string,
        public feedbackEndpoint: string,
        public feedbackApiKey: string,
        public heartbeatEndpoint: string,
        public heartbeatApiKey: string,
        public assets: Assets,
        public banner?: Banner,
    ) {}

    /**
     * Create a Configuration instance from an object
     */
    static fromObject(obj: Props): Configuration {
        return new Configuration(
            obj.queueName,
            obj.lexWebUiBaseUrl,
            obj.amazonConnectIframeOrigin,
            obj.fingerprintEndpoint,
            obj.fingerprintPublicApiKey,
            obj.fingerprintScriptUrlPattern,
            obj.displayBanner,
            obj.metricsId,
            obj.metricsEndpoint,
            obj.metricsApiKey,
            obj.feedbackEndpoint,
            obj.feedbackApiKey,
            obj.heartbeatEndpoint,
            obj.heartbeatApiKey,
            obj.assets,
            obj.banner,
        );
    }

    /**
     * Load configuration from the script tag
     */
    static load(): Configuration {
        const node = document.querySelector('#webchat-config');

        if (!node) {
            throw new Error('Could not find #webchat-config script tag');
        }

        const parsedData = JSON.parse(node.textContent || '');

        return Configuration.fromObject({
            queueName: parsedData.queue_name || '',
            lexWebUiBaseUrl: parsedData.lex_web_ui_base_url || '',
            amazonConnectIframeOrigin:
                parsedData.amazon_connect_iframe_origin || '',
            fingerprintEndpoint: parsedData.fingerprint_endpoint || '',
            fingerprintPublicApiKey:
                parsedData.fingerprint_public_api_key || '',
            fingerprintScriptUrlPattern:
                parsedData.fingerprint_script_url_pattern || '',
            displayBanner: parsedData.display_banner || false,
            metricsId: parsedData.metrics_id || '',
            metricsEndpoint: parsedData.metrics_endpoint || '',
            metricsApiKey: parsedData.metrics_api_key || '',
            feedbackEndpoint: parsedData.feedback_endpoint || '',
            feedbackApiKey: parsedData.feedback_api_key || '',
            heartbeatEndpoint: parsedData.heartbeat_endpoint || '',
            heartbeatApiKey: parsedData.heartbeat_api_key || '',
            assets: {
                appIcon: parsedData.assets?.app_icon || '',
                audioNotification: parsedData.assets?.audio_notification || '',
            },
            banner: {
                title: parsedData.banner?.title || '',
                message: parsedData.banner?.message || '',
                linkText: parsedData.banner?.link_text || '',
                linkUrl: parsedData.banner?.link_url || '',
            },
        });
    }
}

const config = Configuration.load();

export default config;
