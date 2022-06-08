function disableButtonElement(buttonElement) {
    buttonElement.disabled = true;
    buttonElement.setAttribute('data-loading', '');

    if (buttonElement.querySelector('.button__inner') !== null) {
        buttonElement.querySelector('.button__inner').innerText = 'Submitting…';
    } else if (
        buttonElement.querySelector('.interview-button__inner') !== null
    ) {
        buttonElement.querySelector('.interview-button__inner').innerText =
            'Submitting…';
    }

    if (buttonElement.getAttribute('data-long-wait') !== null) {
        var pleaseWaitElement = document.createElement('P');
        pleaseWaitElement.classList.add('submit-help-text');
        pleaseWaitElement.innerText =
            'This can take a few moments - please wait.';
        buttonElement.after(pleaseWaitElement);
    }
}

export function disableFormAfterSubmit(formElement) {
    if (!formElement) {
        return;
    }
    formElement.addEventListener('submit', ({ target }) =>
        Array.from(
            target.querySelectorAll('button[type=submit], input[type=submit]'),
        ).forEach((buttonElement) => {
            disableButtonElement(buttonElement);
        }),
    );
}

export function disableButton(buttonElement) {
    if (!buttonElement) {
        return;
    }

    disableButtonElement(buttonElement);
}

export default { disableFormAfterSubmit, disableButton };
