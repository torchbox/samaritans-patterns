function homepageDonateToggle() {

    if(!document.getElementById('homepage')){
        // We're not on the home page.
        return;
    }

    var donateFormMonthlyToggle = document.getElementById('donate__form__toggle-monthly'),
        donateFormSingleToggle = document.getElementById('donate__form__toggle-single'),
        donateFormMonthly = document.getElementById('donate_form--monthly'),
        donateFormSingle = document.getElementById('donate_form--single');


    function formMonthlyToggleOn() {
        if(!donateFormMonthlyToggle.hasAttribute('disabled')) {
            donateFormMonthlyToggle.toggleAttribute('disabled', true);
            donateFormSingleToggle.toggleAttribute('disabled', false);
            donateFormMonthly.toggleAttribute('hidden', false);
            donateFormSingle.toggleAttribute('hidden', true);
        }
    }

    function formSingleToggleOn() {
        if(!donateFormSingleToggle.hasAttribute('disabled')) {
            donateFormSingleToggle.toggleAttribute('disabled', true);
            donateFormMonthlyToggle.toggleAttribute('disabled', false);
            donateFormSingle.toggleAttribute('hidden', false);
            donateFormMonthly.toggleAttribute('hidden', true);
        }
    }

    donateFormMonthlyToggle.addEventListener('click', function() {
        formMonthlyToggleOn();
    });

    donateFormSingleToggle.addEventListener('click', function() {
        formSingleToggleOn();
    });
}

export default homepageDonateToggle;
