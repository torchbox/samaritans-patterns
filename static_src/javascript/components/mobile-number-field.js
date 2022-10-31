// Hides and shows the mobile field on the contact preferences form, based on radio button or checkbox options for SMS contact
// Note that the donation form now uses checkboxes for the preferences, so we need 2 versions of this code - one that works with radio buttons, and one that works with checkboxes
function toggleMobileNumberField(visible, mobileNumberField) {
    if (visible) {
        mobileNumberField.closest('div.form-item').style.display = 'block';
    } else {
        mobileNumberField.closest('div.form-item').style.display = 'none';
    }
}

// This version works with the radio buttons in molecules/gdpr/gdpr_marketing_form_fields.html
function initMobileNumberFieldWithRadios(radioYes, radioNo, mobileNumberField) {
    toggleMobileNumberField(radioYes.checked, mobileNumberField);
    radioYes.addEventListener('change', () => {
        toggleMobileNumberField(radioYes.checked, mobileNumberField);
    });

    radioNo.addEventListener('change', () => {
        toggleMobileNumberField(radioYes.checked, mobileNumberField);
    });
}

// This version works with the checkboxes in pages/donate/partials/donate_gdpr_marketing_form_fields.html
function initMobileNumberFieldWithCheckboxes(checkbox, mobileNumberField) {
    toggleMobileNumberField(checkbox.checked, mobileNumberField);
    checkbox.addEventListener('change', () => {
        toggleMobileNumberField(checkbox.checked, mobileNumberField);
    });
}

export default () => {
    // Initiation for radio button version
    const elements = document.querySelectorAll(
        'input[data-mobile-number-field-shown]',
    );
    if (elements) {
        for (const mobileNumberField of elements) {
            const [showRadioYesId, showRadioNoId] =
                mobileNumberField.dataset.mobileNumberFieldShown.split(',');
            if (!showRadioYesId || !showRadioNoId) {
                continue;
            }
            const radioYes = document.getElementById(showRadioYesId);
            const radioNo = document.getElementById(showRadioNoId);
            initMobileNumberFieldWithRadios(
                radioYes,
                radioNo,
                mobileNumberField,
            );
        }
    }

    // Initiation for checkbox version, which has a different data attribue for the mobile number field
    const mobileField = document.querySelector('[data-mobile-number]');
    const smsCheckbox = document.querySelector('[data-sms-pref]');
    if (mobileField && smsCheckbox) {
        initMobileNumberFieldWithCheckboxes(smsCheckbox, mobileField);
    }
};
