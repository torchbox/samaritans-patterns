/**
 * Re-type phone number into a mobile number field if it was a mobile number.
 *
 */
function retypePhoneNumberIfItsMobile(value, mobileNumberField) {
    // Do not override if there's a value in the target field.
    if (mobileNumberField.value) {
        return;
    }
    const valueNoWhitespace = value.replace(/\s/g, '');
    const isMobile =
        valueNoWhitespace.startsWith('+447') ||
        valueNoWhitespace.startsWith('+4407') ||
        valueNoWhitespace.startsWith('+44(0)7') ||
        valueNoWhitespace.startsWith('00447') ||
        valueNoWhitespace.startsWith('07') ||
        valueNoWhitespace.startsWith('+3538') ||
        valueNoWhitespace.startsWith('+35308') ||
        valueNoWhitespace.startsWith('+353(0)8') ||
        valueNoWhitespace.startsWith('003538') ||
        valueNoWhitespace.startsWith('08');
    if (isMobile) {
        mobileNumberField.value = value;
    }
}

function initPhoneToMobileAutcomplete(phoneNumberField, mobileNumberField) {
    retypePhoneNumberIfItsMobile(phoneNumberField.value, mobileNumberField);
    phoneNumberField.addEventListener('change', (ev) => {
        const value = ev.target.value;
        retypePhoneNumberIfItsMobile(value, mobileNumberField);
    });
}

export default () => {
    const elements = document.querySelectorAll(
        'input[data-mobile-number-autocomplete-from-phone-number]',
    );
    for (const mobileNumberField of elements) {
        const phoneNumberFieldId =
            mobileNumberField.dataset.mobileNumberAutocompleteFromPhoneNumber;
        if (!phoneNumberFieldId) {
            continue;
        }
        const phoneNumberField = document.getElementById(phoneNumberFieldId);
        if (phoneNumberField) {
            initPhoneToMobileAutcomplete(phoneNumberField, mobileNumberField);
        }
    }
};
