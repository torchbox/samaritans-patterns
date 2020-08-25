/*
 * Toggle visibility of an element based on a state of checkbox or
 * radio input elements.
 *
 */
function toggleElement({ element, showCheckbox, hideCheckbox }) {
    if (
        (showCheckbox && !showCheckbox.checked) ||
        (hideCheckbox && hideCheckbox.checked)
    ) {
        element.style.display = 'none';
    } else {
        element.style.display = '';
    }
}

export default function initialiseHideIfCheckedElement({
    element,
    showCheckbox,
    hideCheckbox,
}) {
    // Needs one or the other for the checkbox, for radio input both are needed
    // because events are be fired for both.
    if (!showCheckbox && !hideCheckbox) {
        return;
    }

    // Initial load based on what's on the page already.
    toggleElement({
        element,
        showCheckbox,
        hideCheckbox,
    });

    if (showCheckbox) {
        showCheckbox.addEventListener('change', () => {
            toggleElement({ element, showCheckbox });
        });
    }
    if (hideCheckbox) {
        hideCheckbox.addEventListener('change', () => {
            toggleElement({ element, hideCheckbox });
        });
    }
}
