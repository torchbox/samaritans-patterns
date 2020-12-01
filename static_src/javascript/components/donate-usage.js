class DonateUsage {
    static selector() {
        return '.js-donate-usage';
    }

    constructor(node) {
        this.node = node;
        this.donateInput = this.node.querySelector('#id_amount');
        this.donateSlot = this.node.querySelector('.js-donation-usage-slot');
        this.mobileCTA = this.node.querySelector('[data-mobile-cta]');

        // update value on page load
        this.calculateValue(this.donateInput.value);

        this.bindEventListeners();
    }

    bindEventListeners() {
        // listen for updates to the input
        this.donateInput.oninput = (e) => this.calculateValue(e.target.value);
    }

    calculateValue(value) {
        // work out how many calls will be answered
        const result = Math.floor(Number(value) / 4.75);

        if (this.donateSlot) {
            // show the value to the user if number of calls > 1
            if (result >= 1) {
                this.donateSlot.innerHTML = `<b>${result}</b> call${
                    result === 1 ? '' : 's'
                }`;
            } else {
                this.donateSlot.innerHTML = 'a call';
            }
        }

        if (this.mobileCTA) {
            if (value == 5) {
                this.mobileCTA.classList.add('is-active');
            } else {
                this.mobileCTA.classList.remove('is-active');
            }
        }
    }
}

export default DonateUsage;
