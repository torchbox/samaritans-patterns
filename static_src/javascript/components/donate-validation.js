// A variant of the GdprFields class, because we now have a different version
// of the GDPR contact prefs on the donation page, but other forms keep the original. This also adds extra client-side validation for the donation form.
// Note that the validation does not run here, but instead runs in payments.js when the payment buttons are clicked

class DonateValidation {
    static selector() {
        return '[data-donation-form]';
    }

    constructor(node) {
        // If we find the form element, we have a form.
        this.node = node;

        if (!this.node) {
            return;
        }

        // Conset wrapper and consent reasons
        this.consentWrapper = this.node.querySelector('[data-contact-prefs]');
        this.learnMorePref = this.node.querySelector('[data-learn-more-pref]');

        // Contact methods wrapper and contact methods
        this.contactMethodsWrapper = this.node.querySelector(
            '[data-contact-methods-wrapper]',
        );

        this.phonePrefs = this.node.querySelector('[data-phone-pref]');
        this.emailPrefs = this.node.querySelector('[data-email-pref]');
        this.smsPrefs = this.node.querySelector('[data-sms-pref]');

        // Mobile number field and wrapper
        this.mobileNumberField = this.node.querySelector(
            '[data-mobile-number]',
        );
        this.mobileNumberFieldWrapper =
            this.mobileNumberField.closest('.js-mobile-wrapper');

        // Phone number field and wrapper
        this.phoneNumberField = this.node.querySelector('[data-phone-number]');
        this.phoneNumberFieldWrapper =
            this.phoneNumberField.closest('.js-phone-wrapper');

        // Keep track of different types of errors
        this.contactReasonErrors = false;
        this.contactMethodErrors = false;
        this.mobileFieldErrors = false;
        this.phoneFieldErrors = false;

        // Keep track of all errors
        this.errorsFound = false;

        this.setInitialAriaExpanded();
        this.bindEvents();
        this.watchIsCorporateField();
    }

    watchIsCorporateField() {
        /**
         * If the users selects that they are donating on behalf of an organisation,
         * the gift aid box should be hidden, and if the user has already ticked the
         * gift aid box, it should be cleared.
         */
        const giftAidContainer = this.node.querySelector('.gift-aid');
        const stayInTouchNumberContainer = this.node.querySelector(
            '#stay-in-touch-step-number',
        );
        const paymentStepContainer = this.node.querySelector(
            '#payment-step-number',
        );

        this.node
            .querySelector('input[name="is_corporate"]')
            .addEventListener('change', (e) => {
                if (e.target.checked) {
                    giftAidContainer.style.display = 'none';
                    this.node.querySelector(
                        'input[name="gift_aid"]',
                    ).checked = false;
                    stayInTouchNumberContainer.innerHTML = '2';
                    paymentStepContainer.innerHTML = '3';
                } else {
                    giftAidContainer.style.display = 'block';
                    stayInTouchNumberContainer.innerHTML = '3';
                    paymentStepContainer.innerHTML = '4';
                }
            });
    }

    setInitialAriaExpanded() {
        // Check if the contact methods are initially hidden or not and set aria-expanded accordingly
        if (this.contactMethodsWrapper.hasAttribute('hidden')) {
            this.learnMorePref.setAttribute('aria-expanded', 'false');
        } else {
            this.learnMorePref.setAttribute('aria-expanded', 'true');
        }
    }

    bindEvents() {
        this.learnMorePref.addEventListener('change', () => {
            this.checkContactMethods();
        });
    }

    checkContactMethods() {
        if (this.learnMorePref.checked) {
            this.showContactMethods();
        } else {
            this.hideContactMethods();
        }
    }

    showContactMethods() {
        this.contactMethodsWrapper.removeAttribute('hidden');
        this.learnMorePref.setAttribute('aria-expanded', 'true');
    }

    hideContactMethods() {
        this.contactMethodsWrapper.setAttribute('hidden', 'hidden');
        this.learnMorePref.setAttribute('aria-expanded', 'false');
        // deselect contact methods and hide mobile number
        this.phonePrefs.checked = false;
        this.smsPrefs.checked = false;
        this.emailPrefs.checked = false;
        this.mobileNumberField.closest('div.form-item').style.display = 'none'; // follows same logic as mobile-number-field.js which doesn't use a class
    }

    checkValidity(showErrorMessage = true) {
        // custom validity checks
        this.customValidityChecks(showErrorMessage);

        // we have novalidate on the form - here we check any browser validation issues and update our var that tracks if we have any errors if we find a problem
        if (this.node.checkValidity() === false) {
            this.errorsFound = true;
            // show the address fields if we have any errors as otherwise the reportValidity function may try to focus on hidden form fields
            if (showErrorMessage) {
                const jsDonateAddressToggle = this.node.querySelector(
                    '.js-donate-address-toggle',
                );

                if (jsDonateAddressToggle) {
                    jsDonateAddressToggle.classList.remove('hidden');
                }
            }
        }

        if (this.errorsFound) {
            // call reportValidity to also pick up any automatic browser validation issues
            if (showErrorMessage) {
                this.node.reportValidity();
            }
            // Show message at the top if we don't already have one
            // No need to remove it as if there are no errors the form will submit
            if (
                !document.querySelector('[data-general-error-message]') &&
                showErrorMessage
            ) {
                const generalErrorsMessage = document.createElement('div');
                generalErrorsMessage.className = 'form__errors';
                generalErrorsMessage.setAttribute(
                    'data-general-error-message',
                    '',
                );
                generalErrorsMessage.innerText =
                    'There were some errors with your form. Please amend the fields highlighted below.';
                this.node.insertBefore(
                    generalErrorsMessage,
                    this.node.firstChild,
                );
                this.node
                    .querySelector('[data-general-error-message]')
                    .scrollIntoView({
                        behavior: 'smooth',
                    });
            }
            return false;
        }

        return true;
    }

    customValidityChecks = (showErrorMessage) => {
        // This checks if we have a contact method, but no contact reason
        // This should be no longer possible as the methods are deselected when the reason is deselected, but leaving in just in case
        const checkConctactMethodButNoReason = () => {
            if (
                (this.phonePrefs.checked ||
                    this.emailPrefs.checked ||
                    this.smsPrefs.checked) &&
                !this.learnMorePref.checked
            ) {
                // Apply error and styling if we have not already done so
                if (!this.contactReasonErrors && showErrorMessage) {
                    this.consentWrapper.classList.add(
                        'form-item__wrapper--error',
                    );

                    const error = document.createElement('p');
                    error.setAttribute('data-contact-error', '');
                    error.className = 'form-item__errors';
                    error.innerText =
                        'Please select at least one reason we can contact you, since you\x27ve selected a contact method.';

                    this.consentWrapper.appendChild(error);
                }
                this.contactReasonErrors = true;
                // Show the contact methods as they need to display if we have an error relating to them
                this.showContactMethods();
            } else {
                // clear any existing styling
                this.contactReasonErrors = false;
                if (showErrorMessage) {
                    this.consentWrapper.classList.remove(
                        'form-item__wrapper--error',
                    );
                    this.node.querySelector('[data-contact-error]')?.remove();
                }
            }
        };

        // This checks if we have a contact reason, but no contact method
        const checkConctactReasonButNoMethod = () => {
            if (
                this.learnMorePref.checked &&
                !this.emailPrefs.checked &&
                !this.smsPrefs.checked &&
                !this.phonePrefs.checked
            ) {
                // Apply error and styling if we have not already done so
                if (
                    !this.contactMethodErrors &&
                    showErrorMessage &&
                    !document.querySelector('[data-contact-reason-error]')
                ) {
                    this.contactMethodsWrapper.classList.add(
                        'form-item__wrapper--error',
                    );

                    const error = document.createElement('p');
                    error.setAttribute('data-contact-reason-error', '');
                    error.className = 'form-item__errors';
                    error.innerText =
                        'Please select at least one contact method.';

                    this.contactMethodsWrapper.appendChild(error);
                }
                this.contactMethodErrors = true;
                // Show the contact methods as they need to display if we have an error relating to them
                this.showContactMethods();
            } else {
                // clear any existing styling
                this.contactMethodErrors = false;
                if (showErrorMessage) {
                    this.contactMethodsWrapper.classList.remove(
                        'form-item__wrapper--error',
                    );
                    this.node
                        .querySelector('[data-contact-reason-error]')
                        ?.remove();
                }
            }
        };

        // This checks if we have an SMS contact pref but no mobile number added
        const checkMobileNumber = () => {
            if (this.smsPrefs.checked && this.mobileNumberField.value === '') {
                // Apply error and styling if we have not already done so
                if (
                    !this.mobileFieldErrors &&
                    showErrorMessage &&
                    !document.querySelector('[data-mobile-field-error]')
                ) {
                    this.mobileNumberFieldWrapper.classList.add(
                        'form-item__wrapper--error',
                    );

                    const error = document.createElement('p');
                    error.setAttribute('data-mobile-field-error', '');
                    error.className = 'form-item__errors';
                    error.innerText = `Please enter your mobile phone number as you've asked us contact you via sms`;

                    this.mobileNumberFieldWrapper.appendChild(error);
                }
                this.mobileFieldErrors = true;
                // Show the contact methods as they need to display if we have an error relating to them
                this.showContactMethods();
            } else {
                // clear any existing styling
                this.mobileFieldErrors = false;
                if (showErrorMessage) {
                    this.mobileNumberFieldWrapper.classList.remove(
                        'form-item__wrapper--error',
                    );
                    this.node
                        .querySelector('[data-mobile-field-error]')
                        ?.remove();
                }
            }
        };

        // This checks if we have a phone number contact preference, but no Phone number
        const checkPhoneNumber = () => {
            if (this.phonePrefs.checked && this.phoneNumberField.value === '') {
                // Apply error and styling if we have not already done so
                if (
                    !this.phoneFieldErrors &&
                    showErrorMessage &&
                    !document.querySelector('[data-phone-field-error]')
                ) {
                    this.phoneNumberFieldWrapper.classList.add(
                        'form-item__wrapper--error',
                    );

                    const error = document.createElement('p');
                    error.setAttribute('data-phone-field-error', '');
                    error.className = 'form-item__errors';
                    error.innerText =
                        'Please enter your phone number as you have asked us to contact you via phone';

                    this.phoneNumberFieldWrapper.appendChild(error);
                }
                this.phoneFieldErrors = true;
                // Show the contact methods as they need to display if we have an error relating to them
                this.showContactMethods();
            } else {
                // clear any existing styling
                this.phoneFieldErrors = false;
                if (showErrorMessage) {
                    this.phoneNumberFieldWrapper.classList.remove(
                        'form-item__wrapper--error',
                    );
                    this.node
                        .querySelector('[data-phone-field-error]')
                        ?.remove();
                }
            }
        };

        checkConctactMethodButNoReason();
        checkMobileNumber();
        checkPhoneNumber();
        checkConctactReasonButNoMethod();

        if (
            this.contactReasonErrors ||
            this.contactMethodErrors ||
            this.mobileFieldErrors ||
            this.phoneFieldErrors
        ) {
            this.errorsFound = true;
        } else {
            this.errorsFound = false;
        }
    };
}

export default DonateValidation;
