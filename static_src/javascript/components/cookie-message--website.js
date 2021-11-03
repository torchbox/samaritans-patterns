import Cookies from 'js-cookie';

class CookieWarning {

    constructor() {
        this.bannerURL = '/ajax/cookie-consent/';
        this.messageContainerID = 'js-cookie';
        this.cookieName =  'client-cookie';
        this.cookieValue = 'agree to cookies';
        this.cookieDuration = 365;
        this.checkCookie();
    }

    checkCookie() {
        // If cookie doesn't exist, fetch the banner
        if( !Cookies.get(this.cookieName) ){
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', this.showBanner.bind(this));
            xhr.open('GET', this.bannerURL);
            xhr.send();
        }
    }

    showBanner(event) {
        var data = JSON.parse(event.target.responseText);
        var node = document.createElement('div');
        node.id = this.messageContainerID;
        node.innerHTML = data.cookie_banner_html;
        document.body.insertBefore(node, document.body.firstChild);
        this.bindEvents();
    }

    bindEvents() {
        var acceptButton = document.querySelector('#js-cookie__accept'),
            dismissButton = document.querySelector('.js-cookie__dismiss-button'),
            dismissLink = document.querySelector('#js-cookie__dismiss-link');

        acceptButton.addEventListener('click', (event) => this.applyCookie(event) );
        dismissButton.addEventListener('click', () => this.hideBanner() );
        dismissLink.addEventListener('click', () => this.hideBanner() );
    }

    applyCookie(event) {
        event.preventDefault();
        Cookies.set(this.cookieName, this.cookieValue, { expires: this.cookieDuration });

        // Toggle messages
        var initialContent = document.querySelector('#js-cookie__message-initial'),
            acceptedContent = document.querySelector('#js-cookie__message-accepted');

        initialContent.toggleAttribute('hidden', true);
        acceptedContent.toggleAttribute('hidden', false);
    }

    hideBanner() {
        document.getElementById(this.messageContainerID).toggleAttribute('hidden', true);
    }
}

export default CookieWarning;
