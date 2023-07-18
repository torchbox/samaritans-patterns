// pca is a window var - tell eslint it's a global so it doesn't complain it is undefined
/* global pca */
import DonateValidation from './donate-validation';
import { MONTHLY, SINGLE } from './shared/constants';

const braintree = require('braintree-web');

function setupPayment() {
    const paymentForm = document.querySelector('[data-donation-form]');
    if (!paymentForm) {
        return;
    }

    const donateValidation = new DonateValidation(paymentForm);

    const nonceInput = document.getElementById('id_braintree_nonce');
    const paymentModeInput = document.getElementById('id_payment_mode');
    const submitButton = document.getElementById('payments__payment-submit');

    const braintreeSettings = JSON.parse(
        document.getElementById('payments__braintree-settings').textContent,
    );

    function getFormValues() {
        const form = new FormData(paymentForm);

        return {
            currency: form.get('currency'),
            email: form.get('email'),
            amount: form.get('amount'),
            givenName: form.get('first_name'), // ASCII-printable characters required, else will throw a validation error
            surname: form.get('last_name'), // ASCII-printable characters required, else will throw a validation error
            phoneNumber: form.get('phone_number'),
            streetAddress: form.get('address_line_1'),
            extendedAddress: form.get('address_line_2'),
            locality: form.get('town'),
            postalCode: form.get('post_code'),
            countryCodeAlpha2: form.get('country'),
        };
    }

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

    function showErrorMessage(target, msg) {
        const targetElement = document.getElementById(
            'payments__braintree-errors-' + target,
        );
        targetElement.toggleAttribute('hidden', false);
        targetElement.innerHTML = msg;
    }

    function showPaymentErrorMsg(payment_method) {
        return showErrorMessage(
            payment_method,
            `There was an error processing your ${getPaymentMethodLabel(
                payment_method,
            )} payment - please check your details and try again.`,
        );
    }

    function clearAllErrorMessages() {
        document
            .querySelectorAll('.payments__error-wrapper span')
            .forEach((error_msg) => {
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
                .then((payload) => {
                    const currentForm = getFormValues();

                    return threeDS.verifyCard({
                        onLookupComplete: (data, next) => {
                            next();
                        },
                        amount: currentForm.amount,
                        nonce: payload.nonce,
                        bin: payload.details.bin,
                        email: currentForm.email,
                        billingAddress: {
                            givenName: currentForm.first_name, // ASCII-printable characters required, else will throw a validation error
                            surname: currentForm.last_name, // ASCII-printable characters required, else will throw a validation error
                            phoneNumber: currentForm.phone_number,
                            streetAddress: currentForm.address_line_1,
                            extendedAddress: currentForm.address_line_2,
                            locality: currentForm.town,
                            postalCode: currentForm.post_code,
                            countryCodeAlpha2: currentForm.country,
                        },
                    });
                })
                .then((payload) => {
                    if (!payload.liabilityShifted) {
                        showPaymentErrorMsg('card');
                        enablePayNow();
                        return;
                    }

                    nonceInput.value = payload.nonce;
                    paymentModeInput.value = 'card';
                    paymentForm.submit();
                })
                .catch((err) => {
                    console.error(err);
                    showPaymentErrorMsg('card');
                    enablePayNow();
                });
        });

        setupComponents(braintreeSettings.client_token)
            .then((instances) => {
                hf = instances[0];
                threeDS = instances[1];

                hf.on('validityChange', (event) => {
                    const field = event.fields[event.emittedBy];

                    if (field.isValid || field.isPotentiallyValid) {
                        clearFieldError(field.container);
                    } else {
                        showFieldError(field.container);
                    }
                });

                enablePayNow();
            })
            .catch((err) => {
                console.error('Component error:', err);
            });
    }

    function initPayPal() {
        braintree.client.create(
            {
                authorization: braintreeSettings.client_token,
            },
            (clientErr, clientInstance) => {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                braintree.paypalCheckout.create(
                    {
                        client: clientInstance,
                    },
                    (payPalCheckoutErr, payPalCheckoutInstance) => {
                        if (payPalCheckoutErr) {
                            console.error(payPalCheckoutErr);
                            return;
                        }

                        // Set up PayPal with the checkout.js library
                        document
                            .querySelectorAll('.payments__paypal-button')
                            .forEach((item) => {
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
                                        // What happens when user clicks PayPal button when
                                        // it is enabled.
                                        payment: () => {
                                            const form = getFormValues();
                                            return payPalCheckoutInstance.createPayment(
                                                {
                                                    flow: 'checkout',
                                                    amount: form.amount,
                                                    currency: form.currency,
                                                    enableShippingAddress: false,
                                                },
                                            );
                                        },
                                        // What happens when user comes back from PayPal.
                                        onAuthorize: (data) =>
                                            payPalCheckoutInstance.tokenizePayment(
                                                data,
                                                (err, payload) => {
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
                                            ),
                                        // What happens when user cancels the payment.
                                        onCancel: () => {
                                            showErrorMessage(
                                                'paypal',
                                                'PayPal payment cancelled',
                                            );
                                        },
                                        // What happens on any errors.
                                        onError: () => {
                                            showPaymentErrorMsg('paypal');
                                        },
                                        validate: (actions) => {
                                            const runCheckValidity = () => {
                                                if (
                                                    // `false` here means that that no error messages
                                                    // will be displayed.
                                                    donateValidation.checkValidity(
                                                        false,
                                                    )
                                                ) {
                                                    actions.enable();
                                                } else {
                                                    actions.disable();
                                                }
                                            };

                                            // onInit isn't supported so we immediately check first.
                                            runCheckValidity();

                                            /**
                                             * To add validation for the PayPal button, we'll need to
                                             * listen to every time the form changes and then enable
                                             * or disable the button.
                                             */
                                            paymentForm.addEventListener(
                                                'change',
                                                runCheckValidity,
                                            );

                                            // Check validity also when the user clicks on an item in Loqate.
                                            pca.on(
                                                'load',
                                                (type, id, control) => {
                                                    control.listen(
                                                        'populate',
                                                        runCheckValidity,
                                                    );
                                                },
                                            );
                                        },
                                        // This runs every time the button is clicked even if
                                        // it is disabled.
                                        onClick: () => {
                                            // Send selected payment method to GA4.
                                            pushDataLayer('PayPal');

                                            donateValidation.checkValidity();
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
        let threeDSecure;

        function setup3DSecure(clientInstance) {
            braintree.threeDSecure.create(
                {
                    version: 2, // Will use 3DS2 whenever possible
                    client: clientInstance,
                },
                (threeDSecureErr, threeDSecureInstance) => {
                    if (threeDSecureErr) {
                        // Handle error in 3D Secure component creation
                        return;
                    }
                    threeDSecure = threeDSecureInstance;
                },
            );
        }

        function get3DSecureArgs() {
            const currentForm = getFormValues();
            return {
                amount: currentForm.amount,
                email: currentForm.email,
                billingAddress: {
                    givenName: currentForm.first_name, // ASCII-printable characters required, else will throw a validation error
                    surname: currentForm.last_name, // ASCII-printable characters required, else will throw a validation error
                    phoneNumber: currentForm.phone_number,
                    streetAddress: currentForm.address_line_1,
                    extendedAddress: currentForm.address_line_2,
                    locality: currentForm.town,
                    // region: '',
                    postalCode: currentForm.post_code,
                    countryCodeAlpha2: currentForm.country,
                },
            };
        }

        function handle3DSecureVerification(clientInstance, nonce, bin) {
            const threeDSecureArgs = get3DSecureArgs();
            threeDSecureArgs.nonce = nonce;
            threeDSecureArgs.bin = bin;
            threeDSecureArgs.onLookupComplete = function (data, next) {
                if (
                    data.paymentMethod.threeDSecureInfo.liabilityShiftPossible
                ) {
                    next();
                }
            };
            // eligible for 3DS
            threeDSecure.verifyCard(threeDSecureArgs).then((response) => {
                if (response.liabilityShifted === false) {
                    threeDSecure.cancelVerifyCard((err) => {
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

        const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: braintreeSettings.use_sandbox ? 'TEST' : 'PRODUCTION',
        });

        braintree.client.create(
            {
                authorization: braintreeSettings.client_token,
            },
            (clientErr, clientInstance) => {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }

                const googlePaymentConfig = {
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
                    (googlePaymentErr, googlePaymentInstance) => {
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
                            .then((response) => {
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
                                            // Send selected payment method to GA4.
                                            pushDataLayer('Google Pay');

                                            if (
                                                donateValidation.checkValidity()
                                            ) {
                                                clearAllErrorMessages();

                                                const currentForm =
                                                    getFormValues();
                                                const paymentDataRequest =
                                                    googlePaymentInstance.createPaymentDataRequest(
                                                        {
                                                            transactionInfo: {
                                                                currencyCode:
                                                                    currentForm.currency,
                                                                totalPriceStatus:
                                                                    'FINAL',
                                                                totalPrice:
                                                                    currentForm.amount,
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
                                                    .then((paymentData) => {
                                                        googlePaymentInstance.parseResponse(
                                                            paymentData,
                                                            (err, result) => {
                                                                if (err) {
                                                                    showPaymentErrorMsg(
                                                                        'googlepay',
                                                                    );
                                                                }

                                                                // Cards that are network-tokenized can't be verified with 3D Secure:
                                                                // we assume here that the extra protection for tokenized cards is
                                                                // enough to still process the transaction
                                                                if (
                                                                    result
                                                                        .details
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
                                                    .catch((err) => {
                                                        if (
                                                            err.statusCode ===
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
                                            }
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
                            });
                    },
                );
            },
        );
    }

    function initApplePay() {
        // Check if Apple Pay is supported.
        if (
            !(
                window.ApplePaySession &&
                window.ApplePaySession.supportsVersion(3) &&
                window.ApplePaySession.canMakePayments()
            )
        ) {
            return;
        }

        braintree.client.create(
            { authorization: braintreeSettings.client_token },
            (clientErr, clientInstance) => {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }
                braintree.applePay.create(
                    {
                        client: clientInstance,
                    },
                    (applePayErr, applePayInstance) => {
                        if (applePayErr) {
                            console.error(applePayErr);
                            return;
                        }

                        const promise =
                            window.ApplePaySession.canMakePaymentsWithActiveCard(
                                applePayInstance.merchantIdentifier,
                            );
                        promise.then((canMakePaymentsWithActiveCard) => {
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
                                    button.addEventListener('click', () => {
                                        // Send selected payment method to GA4.
                                        pushDataLayer('Apple Pay');

                                        if (donateValidation.checkValidity()) {
                                            clearAllErrorMessages();

                                            const currentForm = getFormValues();
                                            const paymentRequest =
                                                applePayInstance.createPaymentRequest(
                                                    {
                                                        total: {
                                                            amount: currentForm.amount,
                                                            type: 'final',
                                                            label: 'Samaritans',
                                                        },
                                                        currencyCode:
                                                            currentForm.currency,
                                                        requiredBillingContactFields:
                                                            ['postalAddress'],
                                                    },
                                                );

                                            const session =
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
                                                        (
                                                            validationErr,
                                                            validationData,
                                                        ) => {
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
                                                        (
                                                            tokenizeErr,
                                                            payload,
                                                        ) => {
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
                                        }
                                    });
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
}

export default setupPayment;
