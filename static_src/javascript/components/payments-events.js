const braintree = require('braintree-web');

function setupPayment() {
    if (!document.getElementById('payments__payment-wrapper')) {
        // We're not on the payment page.
        return;
    }

    const paymentForm = document.getElementById('payments__braintree-form');
    const nonceInput = document.getElementById('id_braintree_nonce');
    const paymentModeInput = document.getElementById('id_payment_mode');
    const submitButton = document.getElementById('payments__payment-submit');
    const paymentCurrency = paymentForm.getAttribute('currency');

    const braintreeSettings = JSON.parse(
        document.getElementById('payments__braintree-settings').textContent,
    );
    const personalDetails = JSON.parse(
        document.getElementById('payments__personal-details').textContent,
    );
    const ipAddress = document
        .querySelector('[data-browser-ip-address]')
        .getAttribute('data-browser-ip-address');

    function getPaymentMethodLabel(payment_method) {
        let payment_method_label;

        switch (payment_method) {
            case 'applepay':
                payment_method_label = 'Apple Pay';
                break;

            case 'googlepay':
                payment_method_label = 'Google Pay';
                break;

            case 'card':
                payment_method_label = 'card';
                break;

            case 'paypal':
                payment_method_label = 'PayPal';
                break;
        }

        return payment_method_label;
    }

    function showPaymentErrorMsg(payment_method) {
        return showErrorMessage(
            payment_method,
            `There was an error processing your ${getPaymentMethodLabel(
                payment_method,
            )} payment - please check your details and try again.`,
        );
    }

    function showErrorMessage(target, msg) {
        const targetElement = document.getElementById(
            'payments__braintree-errors-' + target,
        );
        targetElement.toggleAttribute('hidden', false);
        targetElement.innerHTML = msg;
    }

    function clearAllErrorMessages() {
        document
            .querySelectorAll('.payments__error-wrapper span')
            .forEach(function (error_msg) {
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

    // Send action to GA4.
    function pushDataLayer(paymentMethod) {
        const personalDetails = JSON.parse(
            document.querySelector('#payments__personal-details').innerHTML,
        );
        const eventDetails = JSON.parse(
            document.querySelector('#payments__event-details').innerHTML,
        );
        const amount = personalDetails.amount;
        const eventId = eventDetails.event_id;
        const eventName = eventDetails.name;

        // If the event has already been sent to GA4 once,
        // do not send another event.
        window.dataLayer = window.dataLayer || [];
        if (window.dataLayer.find((e) => e.event === 'add_payment_info')) {
            return;
        }

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

    function initCard() {
        let hf;
        let threeDS;

        function setupComponents(clientToken) {
            return Promise.all([
                braintree.hostedFields.create({
                    authorization: clientToken,
                    fields: {
                        number: {
                            selector: '#card-number',
                        },
                        cvv: {
                            selector: '#cvv',
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                        },
                    },
                }),
                braintree.threeDSecure.create({
                    authorization: clientToken,
                    version: 2,
                }),
            ]);
        }

        function enablePayNow() {
            if (submitButton.dataset.originalText) {
                submitButton.querySelector('.button__inner').innerHTML =
                    submitButton.dataset.originalText;
            }

            submitButton.removeAttribute('disabled');
        }

        submitButton.addEventListener('click', function (event) {
            event.preventDefault();
            clearAllErrorMessages();

            submitButton.dataset.originalText =
                this.querySelector('.button__inner').innerHTML;
            submitButton.querySelector('.button__inner').innerHTML =
                'Processing…';

            submitButton.setAttribute('disabled', 'disabled');

            hf.tokenize()
                .then(function (payload) {
                    return threeDS.verifyCard({
                        onLookupComplete: function (data, next) {
                            next();
                        },
                        amount: personalDetails.amount,
                        nonce: payload.nonce,
                        bin: payload.details.bin,
                        email: personalDetails.email,
                        billingAddress: {
                            givenName: personalDetails.first_name, // ASCII-printable characters required, else will throw a validation error
                            surname: personalDetails.last_name, // ASCII-printable characters required, else will throw a validation error
                            phoneNumber: personalDetails.phone_number,
                            streetAddress: personalDetails.address_line_1,
                            extendedAddress: personalDetails.address_line_2,
                            locality: personalDetails.town,
                            // region: '',
                            postalCode: personalDetails.post_code,
                            countryCodeAlpha2: personalDetails.country,
                        },
                        // These extra fields are now required for 3D secure authentication according to Braintree.
                        collectDeviceData: true,
                        additionalInformation: { ipAddress },
                    });
                })
                .then(function (payload) {
                    if (!payload.liabilityShifted) {
                        showPaymentErrorMsg('card');
                        enablePayNow();
                        return;
                    }

                    nonceInput.value = payload.nonce;
                    paymentModeInput.value = 'card';
                    paymentForm.submit();
                })
                .catch(function (err) {
                    console.error(err);
                    showPaymentErrorMsg('card');
                    enablePayNow();
                });
        });

        setupComponents(braintreeSettings.client_token)
            .then(function (instances) {
                hf = instances[0];
                threeDS = instances[1];

                hf.on('validityChange', function (event) {
                    var field = event.fields[event.emittedBy];

                    if (field.isValid || field.isPotentiallyValid) {
                        clearFieldError(field.container);
                    } else {
                        showFieldError(field.container);
                    }
                });

                enablePayNow();
            })
            .catch(function (err) {
                console.error('component error:', err);
            });
    }

    function initPayPal() {
        braintree.client.create(
            {
                authorization: braintreeSettings.client_token,
            },
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                braintree.paypalCheckout.create(
                    {
                        client: clientInstance,
                    },
                    function (payPalCheckoutErr, payPalCheckoutInstance) {
                        if (payPalCheckoutErr) {
                            console.error(payPalCheckoutErr);
                            return;
                        }

                        // Set up PayPal with the checkout.js library
                        document
                            .querySelectorAll('.payments__paypal-button')
                            .forEach(function (item) {
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
                                            // Send selected payment method to GA4.
                                            pushDataLayer('PayPal');

                                            return payPalCheckoutInstance.createPayment(
                                                {
                                                    flow: 'checkout',
                                                    amount: personalDetails.amount,
                                                    currency: paymentCurrency,
                                                    enableShippingAddress: false,
                                                },
                                            );
                                        },

                                        onAuthorize: function (data) {
                                            return payPalCheckoutInstance.tokenizePayment(
                                                data,
                                                function (err, payload) {
                                                    if (err) {
                                                        showPaymentErrorMsg(
                                                            'paypal',
                                                        );
                                                        return;
                                                    }

                                                    nonceInput.value =
                                                        payload.nonce;
                                                    paymentModeInput.value =
                                                        'paypal';
                                                    paymentForm.submit();
                                                },
                                            );
                                        },

                                        onCancel: function () {
                                            showErrorMessage(
                                                'paypal',
                                                'PayPal payment cancelled',
                                            );
                                        },

                                        onError: function () {
                                            showPaymentErrorMsg('paypal');
                                        },
                                    },
                                    item,
                                );
                            });
                    },
                );
            },
        );
    }

    function initGooglePay() {
        var threeDSecure;

        function setup3DSecure(clientInstance) {
            braintree.threeDSecure.create(
                {
                    version: 2, // Will use 3DS2 whenever possible
                    client: clientInstance,
                },
                function (threeDSecureErr, threeDSecureInstance) {
                    if (threeDSecureErr) {
                        // Handle error in 3D Secure component creation
                        return;
                    }
                    threeDSecure = threeDSecureInstance;
                },
            );
        }

        function get3DSecureArgs() {
            return {
                amount: personalDetails.amount,
                email: personalDetails.email,
                billingAddress: {
                    givenName: personalDetails.first_name, // ASCII-printable characters required, else will throw a validation error
                    surname: personalDetails.last_name, // ASCII-printable characters required, else will throw a validation error
                    phoneNumber: personalDetails.phone_number,
                    streetAddress: personalDetails.address_line_1,
                    extendedAddress: personalDetails.address_line_2,
                    locality: personalDetails.town,
                    // region: '',
                    postalCode: personalDetails.post_code,
                    countryCodeAlpha2: personalDetails.country,
                },
                // These extra fields are now required for 3D secure authentication according to Braintree.
                collectDeviceData: true,
                additionalInformation: { ipAddress },
            };
        }

        function handle3DSecureVerification(clientInstance, nonce, bin) {
            var threeDSecureArgs = get3DSecureArgs();
            threeDSecureArgs['nonce'] = nonce;
            threeDSecureArgs['bin'] = bin;
            threeDSecureArgs['onLookupComplete'] = function (data, next) {
                if (
                    data.paymentMethod.threeDSecureInfo.liabilityShiftPossible
                ) {
                    next();
                }
            };
            // eligible for 3DS
            threeDSecure.verifyCard(threeDSecureArgs).then(function (response) {
                if (response.liabilityShifted === false) {
                    threeDSecure.cancelVerifyCard(function (err) {
                        if (err) {
                            // Handle error
                            console.error(err.message); // No verification payload available
                            return;
                        }
                        setup3DSecure(clientInstance);
                    });
                    showPaymentErrorMsg('googlepay');
                } else {
                    nonceInput.value = response.nonce;
                    paymentModeInput.value = 'googlepay';
                    paymentForm.submit();
                }
            });
        }

        var paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: braintreeSettings.use_sandbox ? 'TEST' : 'PRODUCTION',
        });

        braintree.client.create(
            {
                authorization: braintreeSettings.client_token,
            },
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                var googlePaymentConfig = {
                    client: clientInstance,
                    googlePayVersion: 2,
                };

                setup3DSecure(clientInstance);

                // googleMerchantId is required only in production
                if (!braintreeSettings.use_sandbox) {
                    googlePaymentConfig.googleMerchantId =
                        braintreeSettings.google_merchant_id;
                }
                braintree.googlePayment.create(
                    googlePaymentConfig,
                    function (googlePaymentErr, googlePaymentInstance) {
                        if (googlePaymentErr) {
                            console.error(googlePaymentErr);
                            return;
                        }

                        paymentsClient
                            .isReadyToPay({
                                apiVersion: 2,
                                apiVersionMinor: 0,
                                allowedPaymentMethods:
                                    googlePaymentInstance.createPaymentDataRequest()
                                        .allowedPaymentMethods,
                            })
                            .then(function (response) {
                                if (response.result) {
                                    Array.from(
                                        document.getElementsByClassName(
                                            'js-google-pay-tab',
                                        ),
                                    ).forEach((googlePayTab) => {
                                        googlePayTab.toggleAttribute(
                                            'hidden',
                                            false,
                                        );
                                    });
                                    const button = paymentsClient.createButton({
                                        buttonColor: 'black',
                                        buttonType: 'plain',
                                        buttonSizeMode: 'fill',
                                        onClick: () => {
                                            clearAllErrorMessages();

                                            // Send selected payment method to GA4.
                                            pushDataLayer('Google Pay');

                                            const paymentDataRequest =
                                                googlePaymentInstance.createPaymentDataRequest(
                                                    {
                                                        transactionInfo: {
                                                            currencyCode:
                                                                paymentCurrency,
                                                            totalPriceStatus:
                                                                'FINAL',
                                                            totalPrice:
                                                                personalDetails.amount,
                                                        },
                                                    },
                                                );
                                            const cardPaymentMethod =
                                                paymentDataRequest
                                                    .allowedPaymentMethods[0];

                                            cardPaymentMethod.parameters.billingAddressRequired = false;
                                            cardPaymentMethod.parameters.billingAddressParameters =
                                                {
                                                    format: 'MIN',
                                                };

                                            paymentsClient
                                                .loadPaymentData(
                                                    paymentDataRequest,
                                                )
                                                .then(function (paymentData) {
                                                    googlePaymentInstance.parseResponse(
                                                        paymentData,
                                                        function (err, result) {
                                                            if (err) {
                                                                showPaymentErrorMsg(
                                                                    'googlepay',
                                                                );
                                                            }

                                                            // Cards that are network-tokenized can't be verified with 3D Secure:
                                                            // we assume here that the extra protection for tokenized cards is
                                                            // enough to still process the transaction
                                                            if (
                                                                result.details
                                                                    .isNetworkTokenized ===
                                                                true
                                                            ) {
                                                                nonceInput.value =
                                                                    result.nonce;
                                                                paymentModeInput.value =
                                                                    'googlepay';
                                                                paymentForm.submit();
                                                            }
                                                            // Otherwise, prompt for 3D Secure verification
                                                            else {
                                                                handle3DSecureVerification(
                                                                    clientInstance,
                                                                    result.nonce,
                                                                    result
                                                                        .details
                                                                        .bin,
                                                                );
                                                            }
                                                        },
                                                    );
                                                })
                                                .catch(function (err) {
                                                    if (
                                                        err.statusCode ==
                                                        'CANCELED'
                                                    ) {
                                                        showErrorMessage(
                                                            'googlepay',
                                                            'Google Pay payment cancelled',
                                                        );
                                                    } else {
                                                        // This is probably a DEVELOPER_ERROR
                                                        showPaymentErrorMsg(
                                                            'googlepay',
                                                        );
                                                    }
                                                });
                                        },
                                    });

                                    if (window.innerWidth > 768) {
                                        if (
                                            !document
                                                .querySelector(
                                                    '.payments__googlepay-button-desktop',
                                                )
                                                .hasChildNodes()
                                        ) {
                                            document
                                                .querySelector(
                                                    '.payments__googlepay-button-desktop',
                                                )
                                                .appendChild(button);
                                        }
                                    } else {
                                        if (
                                            !document
                                                .querySelector(
                                                    '.payments__googlepay-button-mobile',
                                                )
                                                .hasChildNodes()
                                        ) {
                                            document
                                                .querySelector(
                                                    '.payments__googlepay-button-mobile',
                                                )
                                                .appendChild(button);
                                        }
                                    }
                                }
                            })
                            .catch(function (exc) {
                                // This is a DEVELOPER_ERROR
                                console.error(exc);
                            });
                    },
                );
            },
        );
    }

    function initApplePay() {
        // console.log("window.ApplePaySession", window.ApplePaySession);
        // if(window.ApplePaySession) {
        //     console.log("window.ApplePaySession.supportsVersion(3)", window.ApplePaySession.supportsVersion(3));
        //     console.log("window.ApplePaySession.canMakePayments()", window.ApplePaySession.canMakePayments());
        // }

        if (
            !(
                window.ApplePaySession &&
                window.ApplePaySession.supportsVersion(3) &&
                window.ApplePaySession.canMakePayments()
            )
        ) {
            // console.log("Apple Pay is NOT supported");
            return;
        } else {
            // console.log("Apple Pay is supported");
        }

        braintree.client.create(
            { authorization: braintreeSettings.client_token },
            function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }
                braintree.applePay.create(
                    {
                        client: clientInstance,
                    },
                    function (applePayErr, applePayInstance) {
                        if (applePayErr) {
                            console.error(applePayErr);
                            return;
                        }

                        var promise =
                            window.ApplePaySession.canMakePaymentsWithActiveCard(
                                applePayInstance.merchantIdentifier,
                            );
                        promise.then(function (canMakePaymentsWithActiveCard) {
                            // console.log("canMakePaymentsWithActiveCard", canMakePaymentsWithActiveCard);
                            if (canMakePaymentsWithActiveCard) {
                                Array.from(
                                    document.getElementsByClassName(
                                        'js-apple-pay-tab',
                                    ),
                                ).forEach((applePayTab) => {
                                    applePayTab.toggleAttribute(
                                        'hidden',
                                        false,
                                    );
                                });

                                const applePayButtons =
                                    document.querySelectorAll(
                                        '.js-apple-pay-button',
                                    );
                                applePayButtons.forEach((button) => {
                                    button.addEventListener(
                                        'click',
                                        function (e) {
                                            e.preventDefault();

                                            clearAllErrorMessages();

                                            // Send selected payment method to GA4.
                                            pushDataLayer('Apple Pay');

                                            var paymentRequest =
                                                applePayInstance.createPaymentRequest(
                                                    {
                                                        total: {
                                                            amount: personalDetails.amount,
                                                            type: 'final',
                                                            label: 'Samaritans',
                                                        },
                                                        currencyCode:
                                                            paymentCurrency,
                                                        requiredBillingContactFields:
                                                            ['postalAddress'],
                                                    },
                                                );

                                            var session =
                                                new window.ApplePaySession(
                                                    3,
                                                    paymentRequest,
                                                );

                                            session.onvalidatemerchant =
                                                function (event) {
                                                    // console.log("session.onvalidatemerchant() - start");
                                                    applePayInstance.performValidation(
                                                        {
                                                            validationURL:
                                                                event.validationURL,
                                                            displayName:
                                                                'Samaritans',
                                                        },
                                                        function (
                                                            validationErr,
                                                            validationData,
                                                        ) {
                                                            if (validationErr) {
                                                                console.error(
                                                                    validationErr,
                                                                );
                                                                session.abort();
                                                                return;
                                                            }
                                                            session.completeMerchantValidation(
                                                                validationData,
                                                            );
                                                        },
                                                    );
                                                    // console.log("session.onvalidatemerchant() - done");
                                                };

                                            session.onpaymentauthorized =
                                                function (event) {
                                                    // console.log("session.onpaymentauthorized() - start");
                                                    applePayInstance.tokenize(
                                                        {
                                                            token: event.payment
                                                                .token,
                                                        },
                                                        function (
                                                            tokenizeErr,
                                                            payload,
                                                        ) {
                                                            if (tokenizeErr) {
                                                                showPaymentErrorMsg(
                                                                    'applepay',
                                                                );
                                                                session.completePayment(
                                                                    window
                                                                        .ApplePaySession
                                                                        .STATUS_FAILURE,
                                                                );
                                                                return;
                                                            }
                                                            session.completePayment(
                                                                window
                                                                    .ApplePaySession
                                                                    .STATUS_SUCCESS,
                                                            );
                                                            nonceInput.value =
                                                                payload.nonce;
                                                            paymentModeInput.value =
                                                                'applepay';
                                                            paymentForm.submit();
                                                        },
                                                    );
                                                    // console.log("session.onpaymentauthorized() - done");
                                                };

                                            session.oncancel = function () {
                                                // console.log("session.oncancel() - start");
                                                showErrorMessage(
                                                    'applepay',
                                                    'Apple Pay payment cancelled',
                                                );
                                                // console.log("session.oncancel() - done");
                                            };

                                            session.begin();
                                        },
                                    );
                                });
                            } else {
                                // hide apple pay elements if user doesn't have a card set up
                                Array.from(
                                    document.querySelectorAll(
                                        '.js-apple-pay-button, .js-apple-pay-tab',
                                    ),
                                ).forEach((applePayElement) => {
                                    applePayElement.toggleAttribute(
                                        'hidden',
                                        true,
                                    );
                                });
                            }
                        });
                    },
                );
            },
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
