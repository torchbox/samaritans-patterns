class GenderReveal {
    static selector() {
        return '[data-gender-reveal]';
    }

    constructor(node) {
        this.node = node;
        this.genderDropdown = this.node.querySelector('select');
        this.bindEvents();
    }

    bindEvents() {
        this.genderDropdown.addEventListener('change', (event) => {
            if (
                event.target.value.replace(/\s+/g, '-').toLowerCase() ===
                'prefer-to-self-describe'
            ) {
                this.node.classList.add('reveal-gender-input');
            } else {
                this.node.classList.remove('reveal-gender-input');
            }
        });
    }
}

export default GenderReveal;
