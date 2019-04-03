import client from 'braintree-web/client';
import hostedFields from 'braintree-web/hosted-fields';
import { create as paypalCreate } from 'braintree-web/paypal-checkout';
import googlePayment from 'braintree-web/google-payment';
import ApplePay from 'braintree-web/apple-pay';

function setupPayment() {

    if(!document.getElementById('payments__payment-wrapper')){
        // We're not on the payment page.
        return;
    }

    var paymentForm = document.getElementById('payments__braintree-form'),
        nonceInput = document.getElementById('id_braintree_nonce'),
        paymentModeInput = document.getElementById('id_payment_mode'),
        submitButton = document.getElementById('payments__payment-submit'),
        cardInputDiv = document.getElementById('payments__braintree-card'),
        token = paymentForm.getAttribute('data-token'),
        loadingErrorMsg = 'There was an error loading this payment option. Please reload the page or try again later.',
        paymentAmount = paymentForm.getAttribute('data-amount'),
        paymentCurrency = 'GBP';

    var braintreeParams = JSON.parse(document.getElementById('payments__braintree-params').textContent);

    function showErrorMessage(target, msg){
        var targetElement = document.getElementById('payments__braintree-errors-' + target);
        targetElement.toggleAttribute('hidden', false);
        targetElement.innerHTML = msg;
    }

    function clearErrorMessage(target){
        var targetElement = document.getElementById('payments__braintree-errors-' + target);
        targetElement.toggleAttribute('hidden', true);
        targetElement.innerHTML = '';
    }

    function showFieldError(container) {
        container.classList.add('braintree-hosted-fields-invalid');
    }

    function clearFieldError(container) {
        container.classList.remove('braintree-hosted-fields-invalid');
    }

    function initCard() {
        client.create(
            {authorization: token},
            function (clientErr, clientInstance) {
                if (clientErr) {
                    showErrorMessage('card', loadingErrorMsg);
                    cardInputDiv.toggleAttribute('hidden', true);
                    return;
                }

                var options = {
                    client: clientInstance,
                    styles: {},
                    fields: {
                        number: {
                            selector: '#card-number',
                        },
                        cvv: {
                            selector: '#cvv',
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                        }
                    }
                };

                hostedFields.create(options, function (hostedFieldsErr, hostedFieldsInstance) {
                    if (hostedFieldsErr) {
                        console.error(hostedFieldsErr);
                        showErrorMessage('card', loadingErrorMsg);
                        cardInputDiv.toggleAttribute('hidden', true);
                        return;
                    }

                    submitButton.removeAttribute('disabled');

                    hostedFieldsInstance.on('validityChange', function(event) {
                        var field = event.fields[event.emittedBy];

                        if (field.isValid || field.isPotentiallyValid) {
                            clearFieldError(field.container);
                        } else {
                            showFieldError(field.container);
                        }
                    });

                    submitButton.addEventListener('click', function(e){
                        e.preventDefault();
                        var state = hostedFieldsInstance.getState(),
                            formValid = Object.keys(state.fields).every(function (key) {
                                var isValid = state.fields[key].isValid;
                                if(!isValid) {
                                    showFieldError(state.fields[key].container);
                                }
                                return isValid;
                            });

                        if(formValid){
                            clearErrorMessage('card');
                            hostedFieldsInstance.tokenize(function(tokenizeErr, payload){
                                if(tokenizeErr) {
                                    // console.error(tokenizeErr);
                                    showErrorMessage('card', 'There was an error processing your payment. Please try again.');
                                    return;
                                }

                                nonceInput.value = payload.nonce;
                                paymentModeInput.value = 'card';
                                paymentForm.submit();
                            });
                        }
                        else {
                            showErrorMessage('card', 'Some of the fields below are invalid. Please correct the invalid fields and try again.');
                        }
                    });
                });
            }
        );
    }

    function initPaypal() {
        client.create(
            {authorization: token},
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    showErrorMessage('paypal', loadingErrorMsg);
                    return;
                }

                paypalCreate(
                    {client: clientInstance},
                    function (paypalCheckoutErr, paypalCheckoutInstance) {
                        if (paypalCheckoutErr) {
                            console.error(paypalCheckoutErr);
                            showErrorMessage('paypal', loadingErrorMsg);
                            return;
                        }

                        // Set up PayPal with the checkout.js library
                        window.paypal.Button.render({
                            env: braintreeParams.use_sandbox ? 'sandbox' : 'production',
                            commit: true,

                            payment: function () {
                                return paypalCheckoutInstance.createPayment({
                                    flow: 'checkout',
                                    amount: paymentAmount,
                                    currency: paymentCurrency,
                                    enableShippingAddress: false,
                                });
                            },

                            onAuthorize: function (data) {
                                return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                                    if(err) {
                                        showErrorMessage('paypal', 'There was an error processing your payment. Please try again.');
                                        return;
                                    }

                                    nonceInput.value = payload.nonce;
                                    paymentModeInput.value = 'paypal';
                                    paymentForm.submit();
                                });
                            },

                            onCancel: function () {
                                showErrorMessage('paypal', 'Payment cancelled');
                            },

                            onError: function () {
                                showErrorMessage('paypal', 'There was an error processing your payment. Please try again.');
                            }
                        }, '#payments__paypal-button').then(function () {
                            // The PayPal button will be rendered in an html element with the id
                            // `paypal-button`. This function will be called when the PayPal button
                            // is set up and ready to be used.
                        });
                    }
                );
            }
        );
    }

    function initGooglePay() {  // eslint-disable-line no-unused-vars
        var paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: braintreeParams.use_sandbox ? 'TEST' : 'PRODUCTION'
        });

        client.create(
            {authorization: token},
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                var googlePaymentConfig = {
                    client: clientInstance,
                    googlePayVersion: 2
                };
                // googleMerchantId is required only in production
                if(!braintreeParams.use_sandbox) {
                    googlePaymentConfig.googleMerchantId = braintreeParams.google_merchant_id;
                }
                googlePayment.create(
                    googlePaymentConfig,
                    function (googlePaymentErr, googlePaymentInstance) {
                        if (googlePaymentErr) {
                            console.error(googlePaymentErr);
                            return;
                        }

                        paymentsClient.isReadyToPay({
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods
                        }).then(function(response) {
                            if (response.result) {
                                Array.from(document.getElementsByClassName('js-google-pay-tab')).forEach(googlePayTab => {
                                    googlePayTab.toggleAttribute('hidden', false);
                                });
                                const button = paymentsClient.createButton({
                                    buttonColor: 'black',
                                    buttonType: 'short',
                                    onClick: () => {
                                        var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
                                            transactionInfo: {
                                                currencyCode: paymentCurrency,
                                                totalPriceStatus: 'FINAL',
                                                totalPrice: paymentAmount
                                            }
                                        });

                                        var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
                                        cardPaymentMethod.parameters.billingAddressRequired = false;
                                        cardPaymentMethod.parameters.billingAddressParameters = {
                                            format: 'MIN',
                                        };

                                        paymentsClient.loadPaymentData(paymentDataRequest).then(
                                            function(paymentData) {
                                                googlePaymentInstance.parseResponse(paymentData, function (err, result) {
                                                    if (err) {
                                                        // Handle parsing error
                                                    }

                                                    nonceInput.value = result.nonce;
                                                    paymentModeInput.value = 'googlepay';
                                                    paymentForm.submit();
                                                });
                                            }
                                        ).catch(function (err) {
                                            if(err.statusCode == 'CANCELED') {
                                                showErrorMessage('googlepay', 'Payment cancelled');
                                            }
                                            else {
                                                // This is a DEVELOPER_ERROR
                                                showErrorMessage('googlepay', 'There was an error processing your payment. Please try again.');
                                            }
                                        });
                                    }
                                });
                                document.getElementById('payments__googlepay-button').appendChild(button);
                            }
                        }).catch(function (exc) {
                            // This is a DEVELOPER_ERROR
                            console.error(exc);
                            showErrorMessage('googlepay', 'There was an error processing your payment. Please try again.');
                        });
                    }
                );
            }
        );
    }

    function initApplePay() {   // eslint-disable-line no-unused-vars
        if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
            // Apple pay is not supported, so bail
            return;
        }

        client.create(
            {authorization: token},
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }
                ApplePay.create({
                    client: clientInstance
                }, function (applePayErr, applePayInstance) {
                    if (applePayErr) {
                        console.error(applePayErr);
                        return;
                    }

                    var promise = window.ApplePaySession.canMakePaymentsWithActiveCard(applePayInstance.merchantIdentifier);
                    promise.then(function (canMakePaymentsWithActiveCard) {
                        if (canMakePaymentsWithActiveCard) {
                            // Show the tab for Apple Pay
                            Array.from(document.getElementsByClassName('js-apple-pay-tab')).forEach(applePayTab => {
                                applePayTab.toggleAttribute('hidden', false);
                            });
                            var payButton = document.getElementById('payments__applepay-button');
                            payButton.addEventListener('click', function(){
                                var paymentRequest = applePayInstance.createPaymentRequest({
                                    total: {
                                        amount: paymentAmount,
                                        type: 'final'
                                    },

                                    requiredBillingContactFields: ['postalAddress']
                                });

                                var session = new window.ApplePaySession(3, paymentRequest);

                                session.onvalidatemerchant = function (event) {
                                    applePayInstance.performValidation({
                                        validationURL: event.validationURL,
                                        displayName: 'Samaritans'
                                    }, function (err, merchantSession) {
                                        if (err) {
                                            showErrorMessage('applepay', loadingErrorMsg);
                                        }
                                        session.completeMerchantValidation(merchantSession);
                                    });
                                };

                                session.onpaymentauthorized = function (event) {
                                    applePayInstance.tokenize({
                                        token: event.payment.token
                                    }, function (tokenizeErr, payload) {
                                        if (tokenizeErr) {
                                            showErrorMessage('applepay', 'There was an error processing your payment. Please try again.');
                                            session.completePayment(window.ApplePaySession.STATUS_FAILURE);
                                            return;
                                        }
                                        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
                                        nonceInput.value = payload.nonce;
                                        paymentModeInput.value = 'applepay';
                                        paymentForm.submit();
                                    });
                                };
                            });
                        }
                    });
                });
            }
        );
    }

    // Initialise both payment modes now so that they're ready when the user picks one
    initCard();
    initPaypal();
    // initGooglePay();
    // initApplePay();
}

export default setupPayment;
