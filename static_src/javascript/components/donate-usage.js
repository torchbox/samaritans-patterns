// Sets the donation usage text when there is no slider and no buttons

class DonateUsage {
    static selector() {
        return '.js-donate-usage';
    }

    constructor(node) {
        this.node = node;
        this.donateInput = this.node.querySelector('#id_amount');
        this.maxDonationAmount = Number(this.donateInput.getAttribute('max'));
        this.donateSlot = this.node.querySelector('.js-donation-usage-slot');
        this.mobileCTA = this.node.querySelector('[data-mobile-cta]');

        // update value on page load
        this.calculateValue(Number(this.donateInput.value));

        this.bindEventListeners();
    }

    bindEventListeners() {
        // listen for updates to the input
        this.donateInput.oninput = (e) => {
            const numericValue = Number(e.target.value);
            if (numericValue > this.maxDonationAmount) {
                e.target.value = this.maxDonationAmount;
                return;
            }
            this.calculateValue(numericValue);
        };
    }

    calculateValue(value) {
        // work out how many calls will be answered
        const result = Math.floor(value / 4.75);

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
            if (value === 5) {
                this.mobileCTA.classList.add('is-active');
            } else {
                this.mobileCTA.classList.remove('is-active');
            }
        }
    }
}

export default DonateUsage;
