import MicroModal from 'micromodal';

document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('referee-modal')) {
        // We're not on the referee details page
        return;
    }

    const hintText = document.querySelector('[data-referees-hint]');
    const fieldsets = [...document.querySelectorAll('[data-referee-fieldset]')];
    const submitButton = document.querySelector('[data-referee-form-submit]');
    const modalRefereesContainer = document.querySelector(
        '[data-modal-referees]',
    );

    // listen for form submit
    submitButton.addEventListener('click', (e) => {
        // prevent form from submitting
        e.preventDefault();

        fieldsets.forEach((fieldset) => getRefereeDetails(fieldset));

        // show confirmation modal
        MicroModal.show('referee-modal', {
            onClose: () => resetUI(),
        });
    });

    // get input contents
    function getRefereeDetails(fieldset) {
        let details = [];
        let hasAddedInfo = false;

        const allInputs = [...fieldset.querySelectorAll('input')];

        allInputs.forEach((input) => {
            details.push(input.value);
            if (input.value && !hasAddedInfo) {
                hasAddedInfo = true;
                hintText.classList.add('is-hidden');
            }
        });

        createMarkup(details);
    }

    // create markup
    function createMarkup(details) {
        const name = `${details[0]} ${details[1]}`;
        const email = `${details[2]}`;
        const phone = `${details[3]}`;

        const markup = `
            <div class="referees__item">
                <p class="referees__text referees__text--standout">${name}</p>
                <p class="referees__text">${email}</p>
                <p class="referees__text">${phone}</p>
            </div>
        `;

        addMarkup(markup);
    }

    // populate modal
    function addMarkup(markup) {
        modalRefereesContainer.innerHTML += markup;
    }

    // reset referees content
    function resetUI() {
        modalRefereesContainer.innerHTML = '';
    }
});
