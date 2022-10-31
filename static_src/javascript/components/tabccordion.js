import DonateValidation from './donate-validation';

class Tabccordion {
    static selector() {
        return '.js-tabccordion';
    }

    constructor(node) {
        this.node = node;
        this.activeClass = 'is-active';
        this.activeClassMobile = 'is-active--mobile';

        // <nav> containing the tab links
        this.tabs = this.node.querySelector('.js-tabccordion-nav');

        // the tab links
        this.tabLinks = Array.from(this.tabs.querySelectorAll('a'));

        // the tab content panels
        this.tabPanels = Array.from(
            this.node.querySelectorAll('.js-tabccordion-panel'),
        );

        this.paymentForm = document.querySelector('[data-donation-form]');

        this.bindEventListeners();
    }

    bindEventListeners() {
        // start
        this.tabLinks.forEach((tabLink) => {
            tabLink.addEventListener('click', (e) => {
                e.preventDefault();

                /**
                 * This is really hacky. Check if the tab is for the 'credit card or debit card',
                 * 'Direct Debit', or 'PayPal' options in the payment forms.
                 *
                 * Note: The PayPal is only for the monthly forms. The PayPal for the single
                 * donation is handled in payments.js.
                 */
                if (
                    (e.target.innerHTML.includes('Credit or debit card') ||
                        e.target.innerHTML.includes('Direct Debit') ||
                        e.target.innerHTML.includes('PayPal')) &&
                    this.paymentForm
                ) {
                    /**
                     * If the button that was clicked is a PayPal button,
                     * Disable to gocardless fields so those fields aren't validated.
                     */
                    if (e.target.innerHTML.includes('PayPal')) {
                        this.updateGoCardlessFields('enabled');
                    }

                    const donateValidation = new DonateValidation(
                        this.paymentForm,
                    );

                    if (donateValidation.checkValidity()) {
                        this.updateNav(e.target);

                        // update active content
                        this.updateActiveTab(e.target.getAttribute('href'));

                        /**
                         * If the button that was clicked is a direct debit button,
                         * Make the gocardless fields not disabled so validation can
                         * work.
                         */
                        if (e.target.innerHTML.includes('Direct Debit')) {
                            this.updateGoCardlessFields('disabled');
                        }
                    }
                } else {
                    // update <nav> <a>'s classes
                    this.updateNav(e.target);

                    // update active content
                    this.updateActiveTab(e.target.getAttribute('href'));
                }
            });
        });
        this.tabPanels.forEach((tabPanel) => {
            tabPanel.firstElementChild.addEventListener('click', (e) => {
                /**
                 * Same as above.
                 */
                if (
                    (e.target.innerHTML.includes('Credit or debit card') ||
                        e.target.innerHTML.includes('Direct Debit') ||
                        e.target.innerHTML.includes('PayPal')) &&
                    this.paymentForm
                ) {
                    e.preventDefault();

                    /**
                     * If the button that was clicked is a PayPal button,
                     * Disable to gocardless fields so those fields aren't validated.
                     */
                    if (e.target.innerHTML.includes('PayPal')) {
                        this.updateGoCardlessFields('enabled');
                    }

                    const donateValidation = new DonateValidation(
                        this.paymentForm,
                    );

                    if (donateValidation.checkValidity()) {
                        this.updateAccordions(e.target);

                        /**
                         * If the button that was clicked is a direct debit button,
                         * Make the gocardless fields not disabled so validation can
                         * work.
                         */
                        if (e.target.innerHTML.includes('Direct Debit')) {
                            this.updateGoCardlessFields('disabled');
                        }
                    }
                } else {
                    if (
                        e.target.parentElement.classList.contains(
                            this.activeClassMobile,
                        )
                    ) {
                        e.preventDefault();
                    }

                    this.updateAccordions(e.target);
                }
            });
        });
    }

    updateGoCardlessFields(status) {
        if (status === 'disabled') {
            document
                .querySelectorAll('[data-gocardless-field]')
                .forEach((el) => {
                    el.removeAttribute('disabled');
                });
        } else if (status === 'enabled') {
            document
                .querySelectorAll('[data-gocardless-field]')
                .forEach((el) => {
                    el.setAttribute('disabled', '');
                });
        }
    }

    // update the <nav> <a>'s
    updateNav(clickedItem) {
        this.tabLinks.forEach((tabLink) => {
            tabLink.classList.remove(this.activeClass);
        });

        clickedItem.classList.add(this.activeClass);
    }

    // update the active tab content
    updateActiveTab(href) {
        this.tabPanels.forEach((panel) => {
            panel.classList.remove(this.activeClass);
            if (`#${panel.id}` === href) {
                panel.classList.add(this.activeClass);
            }
        });
    }

    // update accordions content - mobile
    updateAccordions(clickedItem) {
        this.tabPanels.forEach((panel) => {
            panel.classList.remove(this.activeClass);
        });

        this.tabLinks.forEach((tabLink) => {
            tabLink.classList.remove(this.activeClass);

            // keep the tab <nav> in sync with the active accordion
            if (
                tabLink.getAttribute('href') ===
                `#${clickedItem.parentElement.id}`
            ) {
                tabLink.classList.add(this.activeClass);
            }
        });
        clickedItem.parentElement.classList.add(this.activeClass);

        if (
            clickedItem.parentElement.classList.contains(this.activeClassMobile)
        ) {
            clickedItem.parentElement.classList.remove(this.activeClassMobile);
        } else {
            this.tabPanels.forEach((panel) => {
                panel.classList.remove(this.activeClassMobile);
            });
            clickedItem.parentElement.classList.add(this.activeClassMobile);
        }
    }
}

export default Tabccordion;
