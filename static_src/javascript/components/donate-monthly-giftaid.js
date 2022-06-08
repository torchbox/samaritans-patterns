function bindGiftAidCheckboxToHiddenFields() {
    var visibleField = document.getElementById('id_gift_aid'),
        gocardlessFormField = document.getElementById('id_gocardless-gift_aid'),
        braintreeFormField = document.getElementById('id_braintree-gift_aid');

    function syncFieldValues() {
        var val = visibleField.checked === true;
        if (gocardlessFormField) {
            gocardlessFormField.value = val;
        }
        if (braintreeFormField) {
            braintreeFormField.value = val;
        }
    }

    if (visibleField) {
        // rechecked checkbox if either form was posted with a 'gift_aid' value of 'yes'
        visibleField.checked =
            (gocardlessFormField &&
                gocardlessFormField.value.toLowerCase() === 'true') ||
            (braintreeFormField &&
                braintreeFormField.value.toLowerCase() === 'true');
        // Emit an event to ensure the change event trigger visual updates
        visibleField.dispatchEvent(new Event('change'));

        // update form checkbox values on change
        visibleField.addEventListener('change', syncFieldValues);

        syncFieldValues();
    }
}

export default bindGiftAidCheckboxToHiddenFields;
