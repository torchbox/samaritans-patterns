class GiftAid {
    static selector() {
        return '.js-gift-aid';
    }

    constructor(node) {
        this.node = node;
        this.giftAidInput = this.node.querySelector('input[type="checkbox"]');

        this.bindEventListeners();
        this.checkOnPageLoad();
    }

    bindEventListeners() {
        this.giftAidInput.addEventListener('change', (event) => {
            if (event.target.checked) {
                this.node.classList.add('show-meta');
            } else {
                this.node.classList.remove('show-meta');
            }
        });
    }

    checkOnPageLoad() {
        if (this.giftAidInput.checked) {
            this.node.classList.add('show-meta');
        }
    }
}

export default GiftAid;
