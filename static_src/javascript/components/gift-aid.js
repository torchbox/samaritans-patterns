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
        this.giftAidInput.addEventListener('change', () => {
            this.node.classList.toggle('show-meta');
        });
    }

    checkOnPageLoad() {
        if (this.giftAidInput.checked) {
            this.node.classList.add('show-meta');
        }
    }
}

export default GiftAid;
