// Donate buttons - mutually exclusive to the donate slider
// Includes updating donation usage text linked to the buttons
class DonateButtons {
    static selector() {
        return '.js-donate-buttons';
    }

    constructor(node) {
        this.node = node;
        this.frequency = this.node.getAttribute('data-frequency');

        // One set of buttons - this code will be initiated for both the monthly and single sets
        this.buttons = this.node.querySelectorAll('.js-donate-button');

        // iniially selected button (will be null if only one button is added, as by default it is the second)
        // back-end validation should prevent this from happening
        const selectedButton = this.node.querySelector('.selected');
        if (selectedButton) {
            this.defaultAmount = selectedButton.getAttribute('data-value');
        }

        // get the form these buttons are in (there is one for each of monthly and single)
        this.donateForm = this.node.closest('form');

        // Gets the associated donate input in the same form as the buttons
        this.donateInput = this.donateForm.querySelector('#id_amount');
        this.maxDonationAmount = Number(this.donateInput.getAttribute('max'));
        //
        this.donationUsageSlot = this.donateForm.querySelector(
            '.js-donate-buttons-usage-slot',
        );

        // Get a reference to the values for the buttons - monthly and single
        const monthlyValuesScript = document.getElementById(
            'monthly_button_values',
        );
        if (monthlyValuesScript) {
            this.monthlyValues = JSON.parse(monthlyValuesScript.textContent);
        }
        const singleValuesScript = document.getElementById(
            'single_button_values',
        );
        if (singleValuesScript) {
            this.singleValues = JSON.parse(singleValuesScript.textContent);
        }
        this.init();
        this.bindEventListeners();
    }

    init() {
        if (this.defaultAmount) {
            // Change the value of the donate input
            this.donateInput.value = this.defaultAmount;

            // set the usage text
            this.setUsageText(this.defaultAmount);
        }
    }

    setUsageText(amount) {
        const getTextFromAmount = (amountInner, values) => {
            const match = values.find((value) => value.amount === amountInner);
            return match.text;
        };
        let usageText = '';
        if (this.frequency === 'monthly' && this.monthlyValues) {
            usageText = getTextFromAmount(amount, this.monthlyValues);
        } else if (this.frequency === 'single' && this.singleValues) {
            usageText = getTextFromAmount(amount, this.singleValues);
        }
        this.donationUsageSlot.innerHTML = usageText;
    }

    bindEventListeners() {
        // Clicking a button updates the input value
        this.buttons.forEach((button) => {
            button.addEventListener('click', () => {
                // clear all current 'selected' classes
                this.buttons.forEach((buttonInner) => {
                    buttonInner.classList.remove('selected');
                });

                // Change the value of the donate input
                const currentAmount = button.getAttribute('data-value');
                this.donateInput.value = currentAmount;

                // Trigger input event which is needed to update the button text - see donate-dyamic-buttons.js - must happen after the input is updated
                this.donateInput.dispatchEvent(new Event('input'));

                // update this button to be selected - needs to happen after the input change event is fired, because the selected classes are removed when changed
                button.classList.add('selected');

                // Update the donation usage text
                this.setUsageText(currentAmount);
            });
        });

        // Listen for updates to the input and remove the selected button styling if it is changed
        this.donateInput.oninput = (e) => {
            this.buttons.forEach((button) => {
                button.classList.remove('selected');
            });
            // duplicated from donate-usage.js - prevents amount going above the maximum - note that this doesn't work well in the pattern library
            const numericValue = Number(e.target.value);
            if (numericValue > this.maxDonationAmount) {
                e.target.value = this.maxDonationAmount;
                return;
            }
        };
    }
}

export default DonateButtons;
