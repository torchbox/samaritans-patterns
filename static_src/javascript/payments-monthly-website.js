import bindGiftAidCheckboxToHiddenFields from './components/donate-monthly-giftaid';
import setupPaymentMonthly from './components/braintree-payment-monthly';

/**
 * Depending on the payment selector used, we need to update the form to post to a different
 * URL. We use `forEach` here since we have separate elements for desktop and mobile.
 */
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.direct-debit-selector').forEach((el) => {
        el.addEventListener('click', () => {
            const form = document.querySelector('.form');

            form.setAttribute('action', window.monthlyDonationUrls.gocardless);
            form.removeAttribute('data-token');

            bindGiftAidCheckboxToHiddenFields();
        });
    });

    document.querySelectorAll('.paypal-selector').forEach((el) => {
        el.addEventListener('click', () => {
            const form = document.querySelector('.form');

            form.setAttribute('action', window.monthlyDonationUrls.braintree);
            form.setAttribute(
                'data-token',
                window.monthlyDonationUrls.braintree_tokenization_key,
            );
            form.classList.add('donate__braintree-form');

            bindGiftAidCheckboxToHiddenFields();
            setupPaymentMonthly();
        });
    });
});
