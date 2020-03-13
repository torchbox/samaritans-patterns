import bindGiftAidCheckboxToHiddenFields from './components/donate-monthly-giftaid';
import setupPaymentMonthly from './components/braintree-payment-monthly';

document.addEventListener('DOMContentLoaded', function() {
    bindGiftAidCheckboxToHiddenFields();
    setupPaymentMonthly();
});
