class SelectAllCheckboxToggle {
    static selector() {
        return '.js-select-all-checkbox-toggle';
    }

    constructor(node) {
        this.node = node;
        this.toggleAnchor = this.node.querySelector('.js-select-all');
        this.bindEvents();
    }

    bindEvents() {
        this.toggleAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            this.node.querySelectorAll('input').forEach(function (input) {
                input.checked = true;
            });
        });
    }
}

export default SelectAllCheckboxToggle;
