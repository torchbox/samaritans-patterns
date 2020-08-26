function disableSubmitButtonForForm(formElement) {
    Array.from(
        formElement.querySelectorAll('button[type=submit], input[type=submit]')
    ).forEach((submitElement) => {
        submitElement.disabled = true;
    });
}

/**
 * Disable a submit button attached to the form after submit.
 */
export default function disableButtonAfterSubmit(formElement) {
    if (!formElement) {
        return;
    }
    formElement.addEventListener('submit', ({ target }) =>
        disableSubmitButtonForForm(target)
    );
}
