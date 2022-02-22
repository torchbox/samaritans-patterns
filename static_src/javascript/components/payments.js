import client from 'braintree-web/client';
import hostedFields from 'braintree-web/hosted-fields';
import { create as payPalCreate } from 'braintree-web/paypal-checkout';
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
        paymentCurrency = paymentForm.getAttribute('currency');

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

    function clearAllErrorMessages(){
        document.querySelectorAll('.payments__error-wrapper span').forEach(function(error_msg) {
            error_msg.toggleAttribute('hidden', true);
            error_msg.innerHTML = '';
        });
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
                        clearAllErrorMessages();
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

    function initPayPal() {
        client.create(
            {authorization: token},
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    showErrorMessage('paypal', loadingErrorMsg);
                    return;
                }

                payPalCreate(
                    {client: clientInstance},
                    function (payPalCheckoutErr, payPalCheckoutInstance) {
                        if (payPalCheckoutErr) {
                            console.error(payPalCheckoutErr);
                            showErrorMessage('paypal', loadingErrorMsg);
                            return;
                        }

                        // Set up PayPal with the checkout.js library
                        document.querySelectorAll('.payments__paypal-button').forEach(function(item) {
                            window.paypal.Button.render({
                                env: braintreeParams.use_sandbox ? 'sandbox' : 'production',
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
                                    return payPalCheckoutInstance.createPayment({
                                        flow: 'checkout',
                                        amount: paymentAmount,
                                        currency: paymentCurrency,
                                        enableShippingAddress: false,
                                    });
                                },

                                onAuthorize: function (data) {
                                    return payPalCheckoutInstance.tokenizePayment(data, function (err, payload) {
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
                                    showErrorMessage('paypal', 'PayPal payment cancelled');
                                },

                                onError: function () {
                                    showErrorMessage('paypal', 'There was an error processing your payment. Please try again.');
                                }
                            }, item);
                        });
                    }
                );
            }
        );
    }

    function initGooglePay() {
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
                                    buttonType: 'plain',
                                    buttonSizeMode: 'fill',
                                    onClick: () => {
                                        clearAllErrorMessages();
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
                                                showErrorMessage('googlepay', 'Google Pay payment cancelled');
                                            }
                                            else {
                                                // This is a DEVELOPER_ERROR
                                                showErrorMessage('googlepay', 'There was an error processing your payment. Please try again.');
                                            }
                                        });
                                    }
                                });

                                if (window.innerWidth > 768) {
                                    if (!document.querySelector('.payments__googlepay-button-desktop').hasChildNodes()) {
                                        document.querySelector('.payments__googlepay-button-desktop').appendChild(button);
                                    }
                                } else {
                                    if (!document.querySelector('.payments__googlepay-button-mobile').hasChildNodes()) {
                                        document.querySelector('.payments__googlepay-button-mobile').appendChild(button);
                                    }
                                }
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

    function initApplePay() { 
        // console.log("window.ApplePaySession", window.ApplePaySession);
        // if(window.ApplePaySession) {
        //     console.log("window.ApplePaySession.supportsVersion(3)", window.ApplePaySession.supportsVersion(3));
        //     console.log("window.ApplePaySession.canMakePayments()", window.ApplePaySession.canMakePayments());
        // }

        if (!(window.ApplePaySession && window.ApplePaySession.supportsVersion(3) && window.ApplePaySession.canMakePayments())) {
            // console.log("Apple Pay is NOT supported");
            return;
        } else {
            // console.log("Apple Pay is supported");
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
                        // console.log("canMakePaymentsWithActiveCard", canMakePaymentsWithActiveCard);
                        if (canMakePaymentsWithActiveCard) {
                            Array.from(document.getElementsByClassName('js-apple-pay-tab')).forEach(applePayTab => {
                                applePayTab.toggleAttribute('hidden', false);
                            });

                            const applePayButtons = document.querySelectorAll('.js-apple-pay-button');
                            applePayButtons.forEach(button => {
                                button.addEventListener('click', function() {
                                    clearAllErrorMessages();

                                    var paymentRequest = applePayInstance.createPaymentRequest({
                                        total: {
                                            amount: paymentAmount,
                                            type: 'final',
                                            label: 'Samaritans',
                                        },
                                        currencyCode: paymentCurrency,
                                        requiredBillingContactFields: ['postalAddress']
                                    });

                                    var session = new window.ApplePaySession(3, paymentRequest);

                                    session.onvalidatemerchant = function (event) {
                                        // console.log("session.onvalidatemerchant() - start");
                                        applePayInstance.performValidation({
                                            validationURL: event.validationURL,
                                            displayName: 'Samaritans'
                                        }, function (validationErr, validationData) {
                                            if (validationErr) {
                                                console.error(validationErr);
                                                session.abort();
                                                showErrorMessage('applepay', loadingErrorMsg);
                                                return;
                                            }
                                            session.completeMerchantValidation(validationData);
                                        });
                                        // console.log("session.onvalidatemerchant() - done");
                                    };

                                    session.onpaymentauthorized = function (event) {
                                        // console.log("session.onpaymentauthorized() - start");
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
                                        // console.log("session.onpaymentauthorized() - done");
                                    };

                                    session.oncancel = function () {
                                        // console.log("session.oncancel() - start");
                                        showErrorMessage('applepay', 'Apple Pay payment cancelled');
                                        // console.log("session.oncancel() - done");
                                    };

                                    session.begin();
                                });
                            });
                        }
                    });
                });
            }
        );
    }

    // Initialise all payment modes now so that they're ready when the user picks one
    initCard();
    initPayPal();
    initGooglePay();
    window.addEventListener('resize', initGooglePay, false);
    initApplePay();
}

export default setupPayment;
