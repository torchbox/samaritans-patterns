class Beta {
    static selector() {
        return '.block-chat';
    }

    constructor(node) {
        this.node = node;
        this.body = document.body;
        this.activeClass = 'show-beta';
        this.cards = [...document.querySelectorAll('.js-beta-check')];
        this.init();
    }

    init() {
        // check cards on contact a samaritan page
        this.cards.forEach(card => {
            if (card.getElementsByClassName('block-chat').length) {
                card.classList.add(this.activeClass);
            }
        });
    }
}

export default Beta;
