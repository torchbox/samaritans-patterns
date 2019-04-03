class Feedback {
    static selector() {
        return '.js-feedback';
    }

    constructor(node, openCb = () => {}) {
        this.node = node;

        // Any callbacks to be called on open or close.
        this.openCb = openCb;

        this.state = {
            open: false,
        };

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.node.querySelector('.js-feedback-yes').addEventListener('click', () => {
            this.open();
            this.selectYes();
        });

        this.node.querySelector('.js-feedback-no').addEventListener('click', () => {
            this.open();
            this.selectNo();
        });
    }

    open() {
        this.node.classList.add('is-open');
        this.openCb();

        this.state.open = true;
    }

    selectYes() {
        this.node.classList.remove('no-selected');
        this.node.classList.add('yes-selected');
        document.getElementById('id_is_helpful_0').checked = true;
    }

    selectNo() {
        this.node.classList.remove('yes-selected');
        this.node.classList.add('no-selected');
        document.getElementById('id_is_helpful_1').checked = true;
    }
}

export default Feedback;
