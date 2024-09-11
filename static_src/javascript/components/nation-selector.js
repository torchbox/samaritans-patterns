import Cookies from 'js-cookie';

class NationSelector {
    static selector() {
        return '[data-nation-selector]';
    }

    constructor(node) {
        this.node = node;

        this.closeButtons = this.node.querySelectorAll([
            '[data-close-nation-selector]',
        ]);
        this.continueLink = this.node.querySelector('[data-continue-link]');
        this.nationSwitcher = this.node.querySelector('[data-nation-switcher]');

        // Check if nation_preference_set cookie is already set
        if (!Cookies.get('nation_preference_set')) {
            this.node.classList.remove('nation-selector--hidden');
        }

        this.closeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.node.parentNode.removeChild(this.node);
            });
        });

        this.continueLink.addEventListener('click', () => {
            Cookies.set('nation_preference_set', 'true');
        });

        this.nationSwitcher.addEventListener('change', (event) => {
            this.continueLink.setAttribute('href', event.target.value);
        });
    }
}

export default NationSelector;
