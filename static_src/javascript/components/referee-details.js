import MicroModal from 'micromodal';

document.addEventListener('DOMContentLoaded', function () {
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
        let details = {};
        let hasAddedInfo = false;

        const allInputs = [...fieldset.querySelectorAll('input')];

        allInputs.forEach((input) => {
            let labelText = input.id;
            if (input.labels.length > 0) {
                labelText = input.labels[0].textContent.replace('*', '').trim();
            }
            details[labelText] = input.value.trim();
            if (input.value && !hasAddedInfo) {
                hasAddedInfo = true;
                hintText.classList.add('is-hidden');
            }
        });

        createMarkup(details);
    }

    // create markup
    function createMarkup(details) {
        const markup = `
            <div class="referees__item">
                ${Object.entries(details)
                    .map(([k, v]) => {
                        return `<p class="referees__text">${k}: ${v.trim()}</p>`;
                    })
                    .join('')}
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
