// opens an optional hidden form field

class FormFieldExpand {
    static selector() {
        return '.js-form-field-expand';
    }

    constructor(node) {
        this.parent = node;
        this.opener = this.parent.querySelector('.js-form-field-expand-opener');
        this.opened = this.parent.querySelector('.js-form-field-expand-opened');
        this.bindEvents();
    }

    bindEvents() {
        this.opener.addEventListener('click', (e) => {
            this.parent.classList.add('open');
            this.opened.setAttribute('aria-expanded', 'true');
        });
    }
}

export default FormFieldExpand;
