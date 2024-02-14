import DonateValidation from './donate-validation';
import { MONTHLY, SINGLE } from './shared/constants';

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

        // the tab links. Tabcccordion doesn't always have nav.
        if (this.tabs) {
            this.tabLinks = Array.from(this.tabs.querySelectorAll('a'));
        } else {
            this.tabLinks = [];
        }

        // the tab content panels
        this.tabPanels = Array.from(
            this.node.querySelectorAll('.js-tabccordion-panel'),
        );

        this.paymentForm = document.querySelector('[data-donation-form]');
        this.isPaymentTabccordion =
            document.querySelector('[data-payment-tabccordion]') !== null;

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
                const isPaymentTab =
                    e.target.innerHTML.includes('Credit or debit card') ||
                    e.target.innerHTML.includes('Direct Debit') ||
                    e.target.innerHTML.includes('PayPal');

                if (isPaymentTab && this.isPaymentTabccordion) {
                    // Send selected payment method to GA4.
                    let paymentMethod = e.target.innerText;
                    if (e.target.innerHTML.includes('Credit or debit card')) {
                        paymentMethod = 'Card';
                    }
                    this.pushDataLayer(paymentMethod);
                }

                if (
                    isPaymentTab &&
                    this.isPaymentTabccordion &&
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

    // Send action to GA4.
    pushDataLayer(paymentMethod) {
        // If the event has already been sent to GA4 once,
        // do not send another event.
        window.dataLayer = window.dataLayer || [];
        if (window.dataLayer.find((e) => e.event === 'add_payment_info')) {
            return;
        }

        if (this.paymentForm) {
            this.pushDataLayerForDonation(paymentMethod);
        } else {
            this.pushDataLayerForEventRegistration(paymentMethod);
        }
    }

    pushDataLayerForDonation(paymentMethod) {
        const paymentForm = this.paymentForm;
        function getField(selector) {
            return paymentForm.querySelector(selector);
        }

        const amount = getField('#id_amount').value;
        const campaignName = getField('#id_campaign_name').value || 'DONATE';
        const frequency = getField('#id_frequency').value;
        const isGiftAid = getField('#id_gift_aid')?.checked || false;
        const isInMemory = getField('#id_in_memory')?.checked || false;
        const isOrganisationBehalf = getField('#id_is_corporate')?.checked || false;

        // This element only exists if the donation is for a fundraising.
        const isFundraising = getField('#id_payment_origin_choice') || false;

        let itemId;
        let itemCategory = null;
        let itemName = 'Donation';
        if (frequency === MONTHLY) {
            itemCategory = 'Regular';
            itemId = 'DONATION_REGULAR';
        } else if (frequency === SINGLE) {
            if (isFundraising) {
                itemCategory = 'Fundraising';
                itemId = 'FUNDRAISING';
                itemName = "Fundraising";
            } else {
                itemCategory = 'Single';
                itemId = 'DONATION_SINGLE';
            }
        }

        let itemCategory2 = 'General';
        if (isInMemory) {
            itemCategory2 = 'In memory';
        } else if (isOrganisationBehalf) {
            itemCategory2 = 'Organisation';
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'add_payment_info',
            ecommerce: {
                items: [
                    {
                        item_brand: campaignName,
                        item_category: itemCategory,
                        item_category2: itemCategory2,
                        item_id: itemId,
                        item_name: itemName,
                        item_variant: isGiftAid
                            ? 'Gift Aid Yes'
                            : 'Gift Aid No',
                        // Display price with 2 decimal places.
                        price: parseFloat(amount).toFixed(2),
                        quantity: '1',
                    },
                ],
            },
            // Additional data
            donation_type: itemCategory2,
            frequency: frequency,
            gift_aid: isGiftAid,
            payment_type: paymentMethod,
        });
    }

    pushDataLayerForEventRegistration(paymentMethod) {
        const personalDetails = JSON.parse(
            document.querySelector('#payments__personal-details').innerHTML,
        );
        const eventDetails = JSON.parse(
            document.querySelector('#payments__event-details').innerHTML,
        );
        const amount = personalDetails.amount;
        const eventId = eventDetails.event_id;
        const eventName = eventDetails.name;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'add_payment_info',
            ecommerce: {
                items: [
                    {
                        item_brand: `${eventName}_${eventId}`,
                        item_category: 'Event Registration',
                        item_id: `EVENT_REGISTRATION_${eventId}`,
                        item_name: 'Event Registration',
                        // Display price with 2 decimal places.
                        price: parseFloat(amount).toFixed(2),
                        quantity: '1',
                    },
                ],
            },
            // Additional data
            donation_type: 'General',
            payment_type: paymentMethod,
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
