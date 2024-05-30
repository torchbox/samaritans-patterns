import Push from 'push.js';
import config from './config';

Push.config({
    serviceWorker: '/static/webchat-sw.js',
});

export const chatNotification = () => {
    Push.create('Your chat is ready', {
        body: 'Please click here to begin',
        requireInteraction: true,
        icon: config.assets.appIcon,
        link: '',
        onClick() {
            window.focus();
        },
    });
};

export const audioNotification = new Audio(config.assets.audioNotification);
