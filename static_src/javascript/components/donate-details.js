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
        monthlyPaymentMethods = document.getElementById('donate__methods--monthly'),
        changeFrequencyButton = document.getElementById('donate__change-frequency'),
        displayedAmountSpan = document.getElementById('donate__amount__display'),
        inMemoryInput = document.getElementById('id_in_memory'),
        inMemoryFields = document.getElementById('donate__form__in_memory_fields');

    var toggleDonateAmountEditor = function() {
        if(editBox.hasAttribute('hidden')) {
            editBox.removeAttribute('hidden');
            displayBox.setAttribute('hidden', true);
        } else {
            editBox.setAttribute('hidden', true);
            displayBox.removeAttribute('hidden');
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

            displayedAmountSpan.textContent = newAmount;
            amountInput.value = newAmount;

            toggleDonateAmountEditor();
        });

        // Reset display amount - necessary if user hits back in browser
        displayedAmountSpan.textContent = amountInput.value;

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
            monthlyPaymentMethods.toggleAttribute('hidden', false);
            frequencyInput.value = 'monthly';
            changeFrequencyButton.toggleAttribute('hidden', true);
        });
    }

    // Toggle in memory fields if the user checks this box.
    // Not available for pay-in.
    if(inMemoryInput) {
        inMemoryInput.addEventListener('change', function(e){
            inMemoryFields.toggleAttribute('hidden', !e.target.checked);
        });
    }
}

export default donateDetails;
