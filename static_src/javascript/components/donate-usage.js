class DonateUsage {
    static selector() {
        return '.js-donate-usage';
    }

    constructor(node) {
        this.node = node;
        this.donateInput = this.node.querySelector('#id_amount');
        this.donateSlot = this.node.querySelector('.js-donation-usage-slot');

        // update value on page load
        this.calculateValue(this.donateInput.value);

        this.bindEventListeners();
    }

    bindEventListeners() {
        // listen for updates to the input
        this.donateInput.oninput = e => this.calculateValue(e.target.value);
    }

    calculateValue(value) {
        // work out how many calls will be answered
        const result = Math.floor(Number(value) / 4.75);

        // show the value to the user
        this.donateSlot.innerHTML = `<b>${result}</b> call${result === 1 ? '' : 's'}`;
    }
}

export default DonateUsage;
