class Considerations {
    static selector() {
        return '.js-considerations';
    }

    constructor(node) {
        this.node = node;
        this.allConsiderationButtons = this.node.querySelectorAll('.js-consideration-button');

        this.bindEvents();
    }

    bindEvents() {
        this.allConsiderationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNextConsideration(e.target);
            });
        });
    }

    handleNextConsideration(button) {


        // complete current consideration
        const current = button.closest('.js-consideration');
        current.classList.add('is-complete');
        const clickedButton = button.closest('.js-consideration-button');
        clickedButton.classList.add('is-hidden');

        const next = current.nextElementSibling;
        if (next) {
            // show next consideration
            next.classList.remove('is-hidden');

            // scroll to next consideration
            setTimeout(this.scrollToNext, 200, next);
        }
    }

    scrollToNext(next) {
        next.scrollIntoView({ behavior: 'smooth' });
    }
}

export default Considerations;
