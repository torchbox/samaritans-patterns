import client from 'braintree-web/client';
import { create as paypalCreate } from 'braintree-web/paypal-checkout';

function setupPaymentMonthly() {
    if (!document.querySelector('.donate__braintree-form') || document.querySelector('.paypal-button')) {
        // We're not on the monthly payment page.
        // or the paypal button has already been setup.
        return;
    }

    var paymentForm = document.querySelector('.donate__braintree-form'),
        nonceInput = document.getElementById(
            'id_braintree-payment_method_nonce',
        ),
        token = paymentForm.getAttribute('data-token'),
        loadingErrorMsg =
            'There was an error loading this payment option. Please reload the page or try again later.';

    var braintreeSettings = JSON.parse(
        document.getElementById('payments__braintree-settings').textContent,
    );

    function showErrorMessage(msg) {
        var targetElement = document.getElementById('donate__braintree-errors');
        targetElement.toggleAttribute('hidden', false);
        targetElement.innerHTML = msg;
    }

    function initPayPal() {
        client.create(
            { authorization: token },
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    showErrorMessage(loadingErrorMsg);
                    return;
                }

                paypalCreate(
                    { client: clientInstance },
                    function (paypalCheckoutErr, paypalCheckoutInstance) {
                        if (paypalCheckoutErr) {
                            console.error(paypalCheckoutErr);
                            showErrorMessage(loadingErrorMsg);
                            return;
                        }

                        // Set up PayPal with the checkout.js library
                        window.paypal.Button.render(
                            {
                                env: braintreeSettings.use_sandbox
                                    ? 'sandbox'
                                    : 'production',
                                commit: true,
                                style: {
                                    color: 'gold',
                                    shape: 'rect',
                                    tagline: 'false',
                                    label: 'paypal',
                                    size: 'responsive',
                                    height: 50,
                                },

                                payment: function () {
                                    return paypalCheckoutInstance.createPayment(
                                        {
                                            flow: 'vault',
                                            billingAgreementDescription:
                                                braintreeSettings.billingAgreement,
                                            enableShippingAddress: false,
                                        },
                                    );
                                },

                                onAuthorize: function (data) {
                                    return paypalCheckoutInstance.tokenizePayment(
                                        data,
                                        function (err, payload) {
                                            if (err) {
                                                showErrorMessage(
                                                    'There was an error processing your payment. Please try again.',
                                                );
                                                return;
                                            }
                                            nonceInput.value = payload.nonce;
                                            paymentForm.submit();
                                        },
                                    );
                                },

                                onCancel: function () {
                                    showErrorMessage(
                                        'PayPal payment cancelled',
                                    );
                                },

                                onError: function () {
                                    showErrorMessage(
                                        'There was an error processing your payment. Please try again.',
                                    );
                                },
                            },
                            '#donate__paypal-button',
                        ).then(function () {
                            // The PayPal button will be rendered in an html element with the id
                            // `paypal-button`. This function will be called when the PayPal button
                            // is set up and ready to be used.
                        });
                    },
                );
            },
        );
    }

    initPayPal();
}

export default setupPaymentMonthly;
