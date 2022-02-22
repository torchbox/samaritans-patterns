// Enforce clicking a link to read the terms and conditions before checking a box to agree to them
// Displays an error message if the checkbox is clicked before the link
// assumes a code structure like:
// parent element with class of `js-terms`
// child link to tcs and cs with a class of `js-terms-link`
// child checkbox with a class of `js-terms-checkbox`
// avoid totally disabling the checkbox so that it is still tabbable

class TermsAndConditions {
    static selector() {
        return '.js-terms';
    }

    constructor(node) {
        this.parent = node;
        this.checkbox = this.parent.querySelector('.js-terms-checkbox');
        this.link = this.parent.querySelector('.js-terms-link');
        this.errorMessage = this.createErrorMessage();
        this.parent.appendChild(this.errorMessage);
        this.linkClicked = false;
        this.bindEvents();
    }

    createErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.appendChild(
            document.createTextNode(
                'Please read the terms and conditions before checking the box',
            ),
        );
        errorMessage.classList.add('hidden');
        errorMessage.classList.add('form-item__help');
        return errorMessage;
    }

    bindEvents() {
        this.link.addEventListener('click', (e) => {
            e.preventDefault();
            this.linkClicked = true;
            this.errorMessage.classList.add('hidden');
            this.checkbox.classList.remove('inactive');
            window.open(this.link.getAttribute('href'), '_blank');
        });

        this.checkbox.addEventListener('click', (e) => {
            if (!this.linkClicked) {
                e.preventDefault();
                this.errorMessage.classList.remove('hidden');
            }
        });
    }
}

export default TermsAndConditions;
