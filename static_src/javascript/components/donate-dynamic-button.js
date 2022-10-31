// Donate button with amount set dynamically based on the input text
class DonateDynamicButton {
    static selector() {
        return '.js-donate-button-wrapper';
    }

    constructor(node) {
        this.node = node;
        this.button = this.node.querySelector('button');

        // Get template config and assign to vars
        this.monthlyEnabled = window.donateConfig.monthlyGiving === 'True';
        this.singleEnabled = window.donateConfig.singleGiving === 'True';
        this.monthlyAmount = window.donateConfig.monthlyAmount;
        this.singleAmount = window.donateConfig.singleAmount;

        // Set donation frequency
        this.defaultFrequency = 'single';

        // Declare vars for monthly and single giving modes
        if (this.monthlyEnabled) {
            this.monthlyInput = document
                .getElementById('donate_form--monthly')
                .querySelector('input');
            this.monthlyButton = document.getElementById(
                'donate__form__toggle-monthly',
            );

            // Set donation frequency
            if (document.getElementById('donate__form__toggle-monthly')) {
                // Catch cases where editor has set a default donation frequency
                this.defaultFrequency = document.getElementById(
                    'donate__form__toggle-monthly',
                ).disabled
                    ? 'monthly'
                    : 'single';
            } else {
                this.defaultFrequency =
                    this.monthlyEnabled ||
                    (this.monthlyEnabled && this.singleEnabled)
                        ? 'monthly'
                        : 'single';
            }
        }

        if (this.singleEnabled) {
            this.singleInput = document
                .getElementById('donate_form--single')
                .querySelector('input');
            this.singleButton = document.getElementById(
                'donate__form__toggle-single',
            );

            // Set donation frequency
            if (document.getElementById('donate__form__toggle-single')) {
                // Catch cases where editor has set a default donation frequency
                this.defaultFrequency = document.getElementById(
                    'donate__form__toggle-single',
                ).disabled
                    ? 'single'
                    : 'monthly';
            } else {
                this.defaultFrequency =
                    this.monthlyEnabled ||
                    (this.monthlyEnabled && this.singleEnabled)
                        ? 'monthly'
                        : 'single';
            }
        }

        // Set currency
        this.currency = window.donateConfig.isEuro === 'True' ? '€' : '£';

        // Track amounts and donation frequency
        this.state = {
            currentMonthlyAmount: this.toCurrencyValue(this.monthlyAmount),
            currentSingleAmount: this.toCurrencyValue(this.singleAmount),
            frequency: this.defaultFrequency,
        };

        this.bindEventListeners();
    }

    // Return two decimal places unless it's a whole number
    // 10.00 -> 10
    // 10.01 -> 10.01
    /* eslint-disable class-methods-use-this */
    toCurrencyValue(value) {
        return (Math.round(value * 100) / 100)
            .toFixed(2)
            .replace(/\.?00+$/, '');
    }
    /* eslint-enable class-methods-use-this */

    bindEventListeners() {
        // Set button's value on load
        this.setInitialButtonState();

        // Update button amount on input change
        if (this.monthlyEnabled) {
            this.monthlyInput.addEventListener('input', (e) => {
                this.state.currentMonthlyAmount = this.toCurrencyValue(
                    e.target.value,
                );
                this.updateButton(this.state.currentMonthlyAmount);
            });
        }

        if (this.singleEnabled) {
            this.singleInput.addEventListener('input', (e) => {
                this.state.currentSingleAmount = this.toCurrencyValue(
                    e.target.value,
                );
                this.updateButton(this.state.currentSingleAmount);
            });
        }

        // Update button if monthly or single giving buttons
        // are toggled
        if (this.monthlyEnabled && this.singleEnabled) {
            this.monthlyButton.addEventListener('click', () => {
                this.state.frequency = 'monthly';
                this.updateButton(this.state.currentMonthlyAmount);
            });

            this.singleButton.addEventListener('click', () => {
                this.state.frequency = 'single';
                this.updateButton(this.state.currentSingleAmount);
            });
        }
    }

    // Update button
    updateButton(amount) {
        // Set frequency label
        const frequencyLabel =
            this.state.frequency === 'monthly' ? 'a month' : 'today';

        // Construct markup
        const buttonHTML = `
        <div class="button__shadow"></div>
        <div class="button__inner">
            Donate ${this.currency}${amount} ${frequencyLabel}
            <svg id="icon--chevron" width="40px" height="40px" class="icon icon--medium button__icon" viewBox="0 0 43.1 62.7" fill="currentColor">
                <use xlink:href="#icon-chevron"></use>
            </svg>
        </div>`;

        // Apply markup to DOM element
        this.button.innerHTML = buttonHTML;
    }

    // Set button's default value
    setInitialButtonState() {
        // When both monthly and single giving are enabled, the
        // monthly toggle is active by default
        if (this.state.frequency === 'monthly') {
            this.updateButton(this.toCurrencyValue(this.monthlyAmount));
        } else {
            this.updateButton(this.toCurrencyValue(this.singleAmount));
        }
    }
}

export default DonateDynamicButton;
