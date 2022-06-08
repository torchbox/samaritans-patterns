class GdprFields {
    static selector() {
        return '[data-gdpr-fields]';
    }

    constructor() {
        // If we find the form element, we have a form.
        this.node = document.querySelector('[id="gdpr-form"]');
        if (!this.node) {
            return;
        }
        this.bindEvents();
        this.errorAdded = false;
    }

    bindEvents() {
        this.node.onsubmit = this.submitted.bind(this.node);
    }

    submitted(event) {
        // Stop form submission
        event.preventDefault();

        // Contact methods
        const phonePrefs = document.getElementById('id_prefs_phone_0');
        const emailPrefs = document.getElementById('id_prefs_email_0');
        const smsPrefs = document.getElementById('id_prefs_sms_0');

        // Contact reasons
        const volunteeringPref = document.getElementById('id_prefs_fun_vw');
        const fundraisingPref = document.getElementById(
            'id_prefs_volunteering',
        );

        const consentWrapper = document.getElementById('donate__contact-prefs');

        if (
            (phonePrefs.checked || emailPrefs.checked || smsPrefs.checked) &&
            !volunteeringPref.checked &&
            !fundraisingPref.checked
        ) {
            // Apply error and styling if not already done so
            if (!this.errorAdded) {
                consentWrapper.classList.add('form-item__wrapper--error');

                const error = document.createElement('p');
                error.className = 'form-item__errors';
                error.innerText =
                    'Please select at least one reason we can contact you for, since you\x27ve selected a contact method.';

                consentWrapper.appendChild(error);
                this.errorAdded = true;
            }
            consentWrapper.parentNode.parentNode.scrollIntoView({
                behavior: 'smooth',
            });
        } else {
            this.submit();
        }
    }
}

export default GdprFields;
