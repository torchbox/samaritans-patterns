function eventDetails() {
    if (!document.getElementById('events__personal-details-wrapper')) {
        // We're not on the events details page.
        return;
    }

    var eventFormEuro = document.getElementById('event__form__euro'),
        eventFormGbp = document.getElementById('event__form__gbp'),
        eventFormCurrency = document.getElementById('id_currency'),
        eventFormAmount = document.getElementById('id_amount'),
        currencyToggleEUR = document.getElementById('id_currency_1'),
        currencyStep = document.getElementById('currency-step');

    function toggleEurosOn() {
        eventFormEuro.toggleAttribute('hidden', false);
        eventFormGbp.toggleAttribute('hidden', true);
        eventFormCurrency.setAttribute('value', 'EUR');
    }

    function toggleEurosOff() {
        eventFormEuro.toggleAttribute('hidden', true);
        eventFormGbp.toggleAttribute('hidden', false);
        eventFormCurrency.setAttribute('value', 'GBP');
    }

    function toggleCurrencyAmountEuro() {
        var currency = eventFormEuro.getAttribute('data-amount');
        eventFormAmount.setAttribute('value', currency);
        currencyStep.innerText = '€';
    }

    function toggleCurrencyAmountGbp() {
        var currency = eventFormGbp.getAttribute('data-amount');
        eventFormAmount.setAttribute('value', currency);
        currencyStep.innerText = '£';
    }

    eventFormCurrency.addEventListener('click', function () {
        if (currencyToggleEUR.checked) {
            toggleEurosOn();
            toggleCurrencyAmountEuro();
        } else {
            toggleEurosOff();
            toggleCurrencyAmountGbp();
        }
    });
}

export default eventDetails;
