function bindGiftAidCheckboxToHiddenFields() {

    var visibleField = document.getElementById('id_gift_aid'),
        gocardlessFormField = document.getElementById('gocardless_gift_aid_hidden'),
        braintreeFormField = document.getElementById('braintree_gift_aid_hidden');

    function syncFieldValues(e) {
        var val = (visibleField.checked === true) ? 'yes' : 'no';
        gocardlessFormField.value = val;
        braintreeFormField.value = val;
    }

    if (visibleField) {
        // rechecked checkbox if either form was posted with a 'gift_aid' value of 'yes'
        visibleField.checked = (gocardlessFormField.value === 'yes' | braintreeFormField.value === 'yes');

        // update form checkbox values on change
        visibleField.addEventListener('change', syncFieldValues);

        syncFieldValues();
    }
}

export default bindGiftAidCheckboxToHiddenFields;
