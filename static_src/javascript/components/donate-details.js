import Utilities from '../utilities';

function donateDetails() {

    if(!document.getElementById('donate__personal-details-wrapper')){
        // We're not on the personal details page page.
        return;
    }

    var editBox = document.getElementById('donate__amount-edit'),
        displayBox = document.getElementById('donate__amount'),
        changeAmountButton = document.getElementById('donate__change-amount'),
        saveAmountButton = document.getElementById('donate__amount__save'),
        amountInput = document.getElementById('id_amount'),
        frequencyInput = document.getElementById('id_frequency'),
        singlePaymentHeading = document.getElementById('donate__heading--single'),
        monthlyPaymentHeading = document.getElementById('donate__heading--monthly'),
        singlePaymentMethods = document.getElementById('donate__methods--single'),
        monthlyPaymentMethodsGbp = document.getElementById('donate__methods--monthly-gbp'),
        monthlyPaymentMethodsEur = document.getElementById('donate__methods--monthly-eur'),
        changeFrequencyButton = document.getElementById('donate__change-frequency'),
        donateAmountCurrency = document.getElementById('donate_amount-currency'),
        currencyToggleEUR = document.getElementById('id_currency_1'),
        currencyToggleGBP = document.getElementById('id_currency_0'),
        currencyToggle = document.getElementById('id_currency'),
        currencySymbol = document.getElementById('donate__heading--currency'),
        displayedAmountSpan = document.getElementById('donate__amount__display'),
        inMemoryInput = document.getElementById('id_in_memory'),
        inMemoryFields = document.getElementById('donate__form__in_memory_fields'),
        currencyStep = document.getElementById('currency-step'),
        amountField = document.getElementById('amount_form_field');

    const
        currencyGbpSymbol = '£',
        currencyEurSymbol = '€';

    var toggleDonateAmountEditor = function() {
        if(editBox.hasAttribute('hidden')) {
            editBox.removeAttribute('hidden');
            displayBox.setAttribute('hidden', true);
        } else {
            editBox.setAttribute('hidden', true);
            displayBox.removeAttribute('hidden');
        }
    };

    var convertCurrency = function(symbol, value) {
        if(symbol === currencyEurSymbol) {
            return (value * donateAmountCurrency.dataset.conversionRate).toFixed(2);
        }
        else {
            return (value / donateAmountCurrency.dataset.conversionRate).toFixed(2);
        }
    };

    // Amount/frequency update bar - only applicable for donations rather than pay-ins
    if(changeAmountButton){
        changeAmountButton.addEventListener('click', function(e){
            e.preventDefault();
            toggleDonateAmountEditor();
        });

        saveAmountButton.addEventListener('click', function(){
            var newAmount = parseFloat(editBox.querySelector('input').value).toFixed(2);

            // it's possible to alter the amound by typing it in rather than 
            // using the dial buttons. If an amount is entered is less than one 
            // make it equal to one as the selected value and the value shown
            // in the amount box.
            if (newAmount < 1) {
                newAmount = parseFloat('1').toFixed(2);
                editBox.querySelector('input').value = newAmount;
            }

            displayedAmountSpan.textContent = Utilities.number_format(newAmount, 2, '.', ',');

            var currentCurrency = currencyGbpSymbol;

            if (currencyToggleEUR.checked) {
                currentCurrency = currencyEurSymbol;
            }

            currencySymbol.innerHTML =  currentCurrency + '<span id="donate__amount__display">' + newAmount + '</span>';

            amountInput.value = newAmount;
            toggleDonateAmountEditor();
        });

        // Reset display amount - necessary if user hits back in browser
        const displayNumber = Number(amountInput.value);
        displayedAmountSpan.textContent = Utilities.number_format(displayNumber, 2, '.', ',');

        // Return key handling
        editBox.querySelector('input').addEventListener('keyup', function(event) {
            if (event.keyCode === 13) {
                saveAmountButton.click();
            }
        });
    }

    // Change to monthly if allowed. Switching from monthly back to single isn't supported.
    if(changeFrequencyButton) {
        changeFrequencyButton.addEventListener('click', function(e){
            e.preventDefault();
            singlePaymentHeading.toggleAttribute('hidden', true);
            monthlyPaymentHeading.toggleAttribute('hidden', false);
            singlePaymentMethods.toggleAttribute('hidden', true);
            if (currencyToggleEUR.checked) {
                monthlyPaymentMethodsEur.toggleAttribute('hidden', false);
            } else {
                monthlyPaymentMethodsGbp.toggleAttribute('hidden', false);
            }
            frequencyInput.value = 'monthly';
            changeFrequencyButton.toggleAttribute('hidden', true);
            document.getElementById('donate__personal-details-wrapper').querySelector('h1').innerHTML = 'Your monthly donation';
        });
    }

    // Toggle in memory fields if the user checks this box.
    // Not available for pay-in.
    if(inMemoryInput) {
        inMemoryInput.addEventListener('change', function(e){
            inMemoryFields.toggleAttribute('hidden', !e.target.checked);
        });
    }
    var isAmountHidden = amountInput.getAttribute('type') == 'hidden',
        buttonClickedFlag = ((currencyToggleEUR.checked) ? currencyEurSymbol : currencyGbpSymbol);
    currencyToggle.addEventListener('click', function() {
        // Toggle between Euros and GBP
        // Donate one-off and monthly
        if (isAmountHidden){

            var newAmount = parseFloat(editBox.querySelector('input').value).toFixed(2);
            var donateAmountInner;

            if (currencyToggleEUR.checked && buttonClickedFlag != currencyEurSymbol){
                newAmount = convertCurrency(currencyEurSymbol, newAmount);
                donateAmountInner = '<span id="donate__amount__display">' + newAmount + '</span>';
                currencySymbol.innerHTML = currencyEurSymbol + donateAmountInner;
                donateAmountCurrency.innerText = currencyEurSymbol;
                currencyStep.innerText = currencyEurSymbol;
                buttonClickedFlag = currencyEurSymbol;
            }
            else if (currencyToggleGBP.checked && buttonClickedFlag != currencyGbpSymbol) {
                newAmount = convertCurrency(currencyGbpSymbol, newAmount);
                donateAmountInner = '<span id="donate__amount__display">' + newAmount + '</span>';
                currencySymbol.innerHTML = currencyGbpSymbol + donateAmountInner;
                donateAmountCurrency.innerText = currencyGbpSymbol;
                currencyStep.innerText = currencyGbpSymbol;
                buttonClickedFlag = currencyGbpSymbol;
            }

            editBox.querySelector('input').value = newAmount;
            amountInput.value = newAmount;

            // Toggle payment methods for monthly
            // Single donations have no difference
            if (frequencyInput.value == 'monthly'){
                if (currencyToggleEUR.checked) {
                    monthlyPaymentMethodsEur.toggleAttribute('hidden', false);
                    monthlyPaymentMethodsGbp.toggleAttribute('hidden', true);
                } else {
                    monthlyPaymentMethodsEur.toggleAttribute('hidden', true);
                    monthlyPaymentMethodsGbp.toggleAttribute('hidden', false);
                }
            }
        }
        else {
            // Toggle between Euros and GBP
            // Pay-in
            if (currencyToggleEUR.checked){
                // Toggle the amount field class for Euro
                amountField.className = 'form__euro-field-wrapper';
                currencyStep.innerText = currencyEurSymbol;
            } else {
                // Toggle the amount field class for GBP
                amountField.className = 'form__gbp-field-wrapper';
                currencyStep.innerText = currencyGbpSymbol;
            }
        }
    });
}

export default donateDetails;
