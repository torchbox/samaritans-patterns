class Reveal {
    static selector() {
        return '[data-reveal]';
    }

    constructor(node) {
        this.node = node;
        this.revealLink = this.node.querySelector('[data-reveal-link]');

        this.bindEvents();
    }

    bindEvents() {
        this.revealLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.node.classList.toggle('is-open');
        });
    }
}

export default Reveal;
