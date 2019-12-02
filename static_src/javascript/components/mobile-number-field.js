function toggleMobileNumberField(visible, mobileNumberField) {
    if (visible) {
        mobileNumberField.closest('div.form-item').style.display = 'block';
    } else {
        mobileNumberField.closest('div.form-item').style.display = 'none';
    }
}

function initMobileNumberField(radioYes, radioNo, mobileNumberField) {
    toggleMobileNumberField(radioYes.checked, mobileNumberField);
    radioYes.addEventListener('change', ev => {
        toggleMobileNumberField(radioYes.checked, mobileNumberField);
    });

    radioNo.addEventListener('change', ev => {
        toggleMobileNumberField(radioYes.checked, mobileNumberField);
    });
}

export default () => {

    const elements = document.querySelectorAll(
        'input[data-mobile-number-field-shown]'
    );
    for (const mobileNumberField of elements) {
        const [showRadioYesId,showRadioNoId] = mobileNumberField.dataset.mobileNumberFieldShown.split(',');
        if (!showRadioYesId || !showRadioNoId) {
            continue;
        }
        const radioYes = document.getElementById(showRadioYesId);
        const radioNo = document.getElementById(showRadioNoId);
        initMobileNumberField(radioYes, radioNo, mobileNumberField);
    }
};
