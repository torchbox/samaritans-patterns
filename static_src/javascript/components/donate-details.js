// pca is a window var - tell eslint it's a global so it doesn't complain it is undefined
/* global pca */

import Utilities from '../utilities';

const donateDetails = () => {
    if (!document.getElementById('donate__personal-details-wrapper')) {
        // We're not on the personal details page page.
        return;
    }

    const editBox = document.getElementById('donate__amount-edit');

    let changeAmountInput;
    if (editBox) {
        changeAmountInput = editBox.querySelector('#change-amount-input');
    }
    const displayBox = document.getElementById('donate__amount');
    const changeAmountButton = document.getElementById('donate__change-amount');
    const saveAmountButton = document.getElementById('donate__amount__save');
    const amountInput = document.getElementById('id_amount');
    const frequencyInput = document.getElementById('id_frequency');
    const singlePaymentHeading = document.getElementById(
        'donate__heading--single',
    );
    const monthlyPaymentHeading = document.getElementById(
        'donate__heading--monthly',
    );
    const singlePaymentMethods = document.getElementById(
        'donate__methods--single',
    );
    const monthlyPaymentMethodsGbp = document.getElementById(
        'donate__methods--monthly-gbp',
    );
    const monthlyPaymentMethodsEur = document.getElementById(
        'donate__methods--monthly-eur',
    );
    const changeFrequencyButton = document.getElementById(
        'donate__change-frequency',
    );
    const donateAmountCurrency = document.getElementById(
        'donate_amount-currency',
    );
    const currencyToggleEUR = document.getElementById('id_currency_1');
    const currencyToggleGBP = document.getElementById('id_currency_0');
    const currencyToggle = document.getElementById('id_currency');
    const currencySymbol = document.getElementById('donate__heading--currency');
    const displayedAmountSpan = document.getElementById(
        'donate__amount__display',
    );
    const inMemoryInput = document.getElementById('id_in_memory');
    const inMemoryFields = document.getElementById(
        'donate__form__in_memory_fields',
    );
    const branchDonationToggle = document.getElementById(
        'id_is_branch_donation',
    );
    const branchDonationField = document.getElementById(
        'donate__form__branch_donation_selection',
    );
    const branchDonationGroup = document.getElementById(
        'donate__form__branch_donation',
    );
    const currencyStep = document.getElementById('currency-step');
    const amountField = document.getElementById('amount_form_field');
    const originChoice = document.getElementById('id_payment_origin_choice');
    const originOther = document.getElementById('id_payment_origin');
    const originOtherWrapper = document.getElementById(
        'payment_origin_other_field',
    );
    const currencyGbpSymbol = '£';
    const currencyEurSymbol = '€';

    let donationMaxAmount;
    if (changeAmountInput) {
        donationMaxAmount = Number(changeAmountInput.getAttribute('max'));
    }
    const hiddenAddressFields = document.querySelector(
        '.js-donate-address-toggle',
    );
    const enterManualAddressButton = document.querySelector(
        '.js-donate-manual-address',
    );
    const addressLineOneInput = document.querySelector('#id_address_line_1');

    const toggleDonateAmountEditor = () => {
        if (editBox.hasAttribute('hidden')) {
            editBox.removeAttribute('hidden');
            displayBox.setAttribute('hidden', true);
        } else {
            editBox.setAttribute('hidden', true);
            displayBox.removeAttribute('hidden');
        }
    };

    const convertCurrency = (symbol, value) => {
        if (symbol === currencyEurSymbol) {
            return (
                value * donateAmountCurrency.dataset.conversionRate
            ).toFixed(2);
        }
        return (value / donateAmountCurrency.dataset.conversionRate).toFixed(2);
    };

    // Amount/frequency update bar - only applicable for donations rather than pay-ins
    if (changeAmountButton) {
        changeAmountButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDonateAmountEditor();
        });

        saveAmountButton.addEventListener('click', () => {
            let newAmount = parseFloat(changeAmountInput.value).toFixed(2);

            // it's possible to alter the amound by typing it in rather than
            // using the dial buttons. If an amount is entered is less than one
            // make it equal to one as the selected value and the value shown
            // in the amount box.
            if (newAmount < 1) {
                newAmount = parseFloat('1').toFixed(2);
                changeAmountInput.value = newAmount;
            } else if (newAmount > donationMaxAmount) {
                newAmount = parseFloat(donationMaxAmount.toString()).toFixed(2);
            }

            newAmount = Utilities.number_format(newAmount, 2, '.', ',');

            let currentCurrency = currencyGbpSymbol;

            if (currencyToggleEUR.checked) {
                currentCurrency = currencyEurSymbol;
            }

            currencySymbol.innerHTML = `${currentCurrency}
                <span id="donate__amount__display">
                ${newAmount}
                </span>`;

            amountInput.value = newAmount;
            toggleDonateAmountEditor();
        });

        // Reset display amount - necessary if user hits back in browser
        const displayNumber = Number(amountInput.value);
        displayedAmountSpan.textContent = Utilities.number_format(
            displayNumber,
            2,
            '.',
            ',',
        );

        // Return key handling
        changeAmountInput.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                saveAmountButton.click();
            }
        });
    }

    // Change to monthly if allowed. Switching from monthly back to single isn't supported.
    if (changeFrequencyButton) {
        changeFrequencyButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Frequency
            singlePaymentHeading.toggleAttribute('hidden', true);
            monthlyPaymentHeading.toggleAttribute('hidden', false);
            singlePaymentMethods.toggleAttribute('hidden', true);

            // Currency
            if (currencyToggleEUR.checked) {
                monthlyPaymentMethodsEur.toggleAttribute('hidden', false);
            } else {
                monthlyPaymentMethodsGbp.toggleAttribute('hidden', false);
            }
            // Remove branch selection
            // It's not available on monthly
            if (branchDonationGroup) {
                branchDonationGroup.remove();
            }

            frequencyInput.value = 'monthly';
            changeFrequencyButton.toggleAttribute('hidden', true);
            document
                .getElementById('donate__personal-details-wrapper')
                .querySelector('h1').innerHTML = 'Your monthly donation';
        });
    }

    // Only show (and require) the 'Please tell us the name of your event' field if the 'Other' option
    // is selected for 'What did you fundraise for?'
    if (originChoice) {
        // Set correct state on load
        if (originChoice.options[originChoice.options.length - 1].selected) {
            originOther.toggleAttribute('required', true);
        } else {
            originOtherWrapper.toggleAttribute('hidden', true);
            originOther.toggleAttribute('required', false);
        }
        // Set correct state on changes to 'What did you fundraise for?'
        originChoice.addEventListener('change', (e) => {
            e.preventDefault();
            if (
                originChoice.options[originChoice.options.length - 1].selected
            ) {
                originOtherWrapper.toggleAttribute('hidden', false);
                originOther.toggleAttribute('required', true);
            } else {
                originOtherWrapper.toggleAttribute('hidden', true);
                originOther.toggleAttribute('required', false);
            }
        });
    }

    // Toggle in memory fields if the user checks this box.
    // Not available for pay-in.
    if (inMemoryInput) {
        inMemoryInput.addEventListener('change', (e) => {
            inMemoryFields.toggleAttribute('hidden', !e.target.checked);
        });
    }
    if (branchDonationToggle) {
        branchDonationToggle.addEventListener('change', (e) => {
            branchDonationField.toggleAttribute('hidden', !e.target.checked);
        });
        // On failed submission, show the dropdown
        if (branchDonationToggle.checked) {
            branchDonationField.toggleAttribute('hidden', false);
        }
    }
    // amount input is present but hidden in the normal donation flow,
    // but visible for pay in
    const isAmountHidden = amountInput.getAttribute('type') === 'hidden';
    let buttonClickedFlag = currencyToggleEUR.checked
        ? currencyEurSymbol
        : currencyGbpSymbol;
    currencyToggle.addEventListener('click', () => {
        // Toggle between Euros and GBP
        // Donate one-off and monthly
        if (isAmountHidden) {
            let newAmount = parseFloat(changeAmountInput.value).toFixed(2);
            let donateAmountInner;

            if (
                currencyToggleEUR.checked &&
                buttonClickedFlag !== currencyEurSymbol
            ) {
                newAmount = convertCurrency(currencyEurSymbol, newAmount);
                donateAmountInner = `<span id="donate__amount__display">
                    ${newAmount}
                    </span>`;
                currencySymbol.innerHTML =
                    currencyEurSymbol + donateAmountInner;
                donateAmountCurrency.innerText = currencyEurSymbol;
                // currency step will only be present on pages that have the progress bar showing
                if (currencyStep) {
                    currencyStep.innerText = currencyEurSymbol;
                }
                buttonClickedFlag = currencyEurSymbol;
            } else if (
                currencyToggleGBP.checked &&
                buttonClickedFlag !== currencyGbpSymbol
            ) {
                newAmount = convertCurrency(currencyGbpSymbol, newAmount);
                donateAmountInner = `<span id="donate__amount__display">
                    ${newAmount}
                    </span>`;
                currencySymbol.innerHTML =
                    currencyGbpSymbol + donateAmountInner;
                donateAmountCurrency.innerText = currencyGbpSymbol;
                // currency step will only be present on pages that have the progress bar showing
                if (currencyStep) {
                    currencyStep.innerText = currencyGbpSymbol;
                }
                buttonClickedFlag = currencyGbpSymbol;
            }

            changeAmountInput.value = newAmount;
            amountInput.value = newAmount;

            // Toggle payment methods for monthly
            // Single donations have no difference
            if (frequencyInput.value === 'monthly') {
                if (currencyToggleEUR.checked) {
                    monthlyPaymentMethodsEur.toggleAttribute('hidden', false);
                    monthlyPaymentMethodsGbp.toggleAttribute('hidden', true);
                } else {
                    monthlyPaymentMethodsEur.toggleAttribute('hidden', true);
                    monthlyPaymentMethodsGbp.toggleAttribute('hidden', false);
                }
            }
        } else {
            /* eslint-disable no-lonely-if */
            // Toggle between Euros and GBP
            // Pay-in
            if (currencyToggleEUR.checked) {
                // Toggle the amount field class for Euro
                amountField.className = 'form__euro-field-wrapper';
                // currency step will only be present on pages that have the progress bar showing
                if (currencyStep) {
                    currencyStep.innerText = currencyEurSymbol;
                }
            } else {
                // Toggle the amount field class for GBP
                amountField.className = 'form__gbp-field-wrapper';
                // currency step will only be present on pages that have the progress bar showing
                if (currencyStep) {
                    currencyStep.innerText = currencyGbpSymbol;
                }
            }
            /* eslint-enable no-lonely-if */
        }
    });

    // Show address fields when the user selects an address from loqate
    pca.on('load', (type, id, control) => {
        control.listen('populate', () => {
            hiddenAddressFields.classList.remove('hidden');
        });

        // These are placed here since we need to be able to disable `control`.
        // Option to enter address manually - only if the element is present in the form - if the page is reloaded with exisitng address details then it won't be
        if (enterManualAddressButton) {
            enterManualAddressButton.addEventListener('click', () => {
                // Remove address lookup when selecting 'enter address manually'.
                control.destroy();
                hiddenAddressFields.classList.remove('hidden');
            });
        }

        if (addressLineOneInput) {
            addressLineOneInput.addEventListener('change', () => {
                /**
                 * Remove address lookup when address line one already has an input
                 * and show all the fields. This can happen when using autocomplete.
                 * We use setTimeout to handle the case where a user types in their address
                 * line 1 and then selects on an address in Loqate so we don't immediately
                 * disable loqate.
                 */
                hiddenAddressFields.classList.remove('hidden');

                setTimeout(() => {
                    control.destroy();
                }, 2000);
            });
        }
    });
};

export default donateDetails;
