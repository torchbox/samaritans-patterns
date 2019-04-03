class SearchToggle {
    static selector() {
        return '.js-search-toggle';
    }

    constructor(node) {
        this.node = node;

        this.state = {
            open: false,
        };

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.node.addEventListener('click', () => {
            this.toggle();
        });
    }

    toggle() {
        this.state.open ? this.close() : this.open();
    }

    open() {
        this.node.classList.add('is-open');
        document.querySelector('.js-search').classList.add('is-open');

        this.state.open = true;
    }

    close() {
        this.node.classList.remove('is-open');
        document.querySelector('.js-search').classList.remove('is-open');

        this.state.open = false;
    }
}

export default SearchToggle;
