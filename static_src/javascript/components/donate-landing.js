function donateLanding() {
    if (!document.getElementById('donate__landing')) {
        // We're not on the landing page.
        return;
    }

    var donateFormMonthlyToggle = document.getElementById(
            'donate__form__toggle-monthly',
        ),
        donateFormSingleToggle = document.getElementById(
            'donate__form__toggle-single',
        ),
        donateFormMonthly = document.getElementById('donate_form--monthly'),
        donateFormSingle = document.getElementById('donate_form--single');

    var donateExamplesMonthlyToggle = document.getElementById(
            'donate__examples__toggle-monthly',
        ),
        donateExamplesSingleToggle = document.getElementById(
            'donate__examples__toggle-single',
        ),
        donateExamplesMonthly = document.getElementById(
            'donate__examples--monthly',
        ),
        donateExamplesSingle = document.getElementById(
            'donate__examples--single',
        );

    // If there are no toggles it means the page only allows one of monthly or one-off donations.
    if (!donateFormMonthlyToggle && !donateExamplesMonthlyToggle) {
        return;
    }

    function examplesMonthlyToggleOn() {
        if (!donateExamplesMonthlyToggle.getAttribute('disabled')) {
            donateExamplesMonthlyToggle.toggleAttribute('disabled', true);
            donateExamplesSingleToggle.toggleAttribute('disabled', false);
            donateExamplesMonthly.toggleAttribute('hidden', false);
            donateExamplesSingle.toggleAttribute('hidden', true);
            donateExamplesMonthlyToggle.setAttribute('aria-pressed', true);
            donateExamplesSingleToggle.setAttribute('aria-pressed', false);
        }
    }

    function examplesSingleToggleOn() {
        if (!donateExamplesSingleToggle.getAttribute('disabled')) {
            donateExamplesSingleToggle.toggleAttribute('disabled', true);
            donateExamplesMonthlyToggle.toggleAttribute('disabled', false);
            donateExamplesSingle.toggleAttribute('hidden', false);
            donateExamplesMonthly.toggleAttribute('hidden', true);
            donateExamplesMonthlyToggle.setAttribute('aria-pressed', false);
            donateExamplesSingleToggle.setAttribute('aria-pressed', true);
        }
    }

    function formMonthlyToggleOn() {
        if (!donateFormMonthlyToggle.hasAttribute('disabled')) {
            donateFormMonthlyToggle.toggleAttribute('disabled', true);
            donateFormSingleToggle.toggleAttribute('disabled', false);
            donateFormMonthly.toggleAttribute('hidden', false);
            donateFormSingle.toggleAttribute('hidden', true);
            donateFormMonthlyToggle.setAttribute('aria-pressed', true);
            donateFormSingleToggle.setAttribute('aria-pressed', false);
        }
    }

    function formSingleToggleOn() {
        if (!donateFormSingleToggle.hasAttribute('disabled')) {
            donateFormSingleToggle.toggleAttribute('disabled', true);
            donateFormMonthlyToggle.toggleAttribute('disabled', false);
            donateFormSingle.toggleAttribute('hidden', false);
            donateFormMonthly.toggleAttribute('hidden', true);
            donateFormMonthlyToggle.setAttribute('aria-pressed', false);
            donateFormSingleToggle.setAttribute('aria-pressed', true);
        }
    }

    donateFormMonthlyToggle.addEventListener('click', function () {
        formMonthlyToggleOn();
        examplesMonthlyToggleOn();
    });

    donateFormSingleToggle.addEventListener('click', function () {
        formSingleToggleOn();
        examplesSingleToggleOn();
    });

    donateExamplesMonthlyToggle.addEventListener('click', function () {
        formMonthlyToggleOn();
        examplesMonthlyToggleOn();
    });

    donateExamplesSingleToggle.addEventListener('click', function () {
        formSingleToggleOn();
        examplesSingleToggleOn();
    });
}

export default donateLanding;
