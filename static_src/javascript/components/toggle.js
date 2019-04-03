class Toggle {
    static selector() {
        return '.js-toggle-parent';
    }

    constructor(node) {
        this.node = node;

        this.state = {
            open: false,
        };

        this.handle = this.node.querySelector('.js-toggle-handle');
        this.target = this.node.querySelector('.js-toggle-target');

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.handle.addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.state.open ? this.close() : this.open();
    }

    open() {
        this.target.classList.add('is-toggle-active');
        this.state.open = true;
    }

    close() {
        this.target.classList.remove('is-toggle-active');
        this.state.open = false;
    }
}

export default Toggle;
