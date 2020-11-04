import noUiSlider from 'nouislider';

const currencyCode = document.getElementById('id_currency');
const toNumbers = arr => arr.map(Number);
const differenceBetween = (numberOne, numberTwo) => Number(numberOne) - Number(numberTwo);


function getSliderSteps(sliderStepValues){
    var stepsDict = {};

    // Cast to numbers
    sliderStepValues = toNumbers(sliderStepValues);

    sliderStepValues.forEach((stepValue, index) => {
        // The first and last values need a slightly different syntax
        // see: https://refreshless.com/nouislider/slider-values/
        if (index === 0) {
            stepsDict['min'] = [sliderStepValues[0], differenceBetween(sliderStepValues[index + 1], sliderStepValues[0])];
        }
        else if (index == sliderStepValues.length - 1){
            stepsDict['max'] = [sliderStepValues[index], differenceBetween(sliderStepValues[index], sliderStepValues[index - 1])];
        }
        else {
            // Calculate % ratio for placement of point
            stepValue = (index / (sliderStepValues.length - 1) * 100);
            stepsDict[String(stepValue)] = [sliderStepValues[index], differenceBetween(sliderStepValues[index + 1], sliderStepValues[index])];
        }
    });

    return stepsDict;
}
class DonateAmountSlider {
    constructor(node, config) {
        // Only initialise if the node to bind to exists.
        if (node !== null) {
            this.node = node;
            this.config = config;

            this.init();
            this.bindEventListeners();
        }
    }

    init() {
        const donateSlider = this.node;
        const currency = this.config.currency;

        noUiSlider.create(donateSlider, {
            connect: true,
            behaviour: 'tap-drag',
            start: this.config.start,
            range: this.config.range,
            pips: {
                mode: 'count',
                values: this.config.pipValues.length,
                density: this.config.pipValues.length,
                stepped: true,
                format: {
                    to: (value) => `${currency}${formatAmount(value)}`,
                },
            },
            callToActionSvg: this.config.callToActionSvg,
            callToActionText: this.config.callToActionText,
            callCounter: this.config.callCounter,
        });
    }

    bindEventListeners() {
        const mobileCTA = document.getElementById('donate-landing__mobile-cta');
        const donateSlider = this.node;
        const pipValues = this.config.pipValues;
        const amount = this.config.callCounter;
        let icon = this.config.icon;
        const iconValues = this.config.iconValues;
        let text = this.config.text;
        const textValues = this.config.textValues;

        // There are two #id_amount's in the DOM. Selecting by the name is more reliable
        const pips = donateSlider.querySelectorAll('.noUi-value');
        donateSlider.noUiSlider.on('update', function (values, handle) {
            // Update the input value when the slider is updated
            const sliderAmount = Number(values[handle]);
            const node = amount;
            node.value = formatAmount(sliderAmount);

            // Trigger input event to update donation usage counters
            node.dispatchEvent(new Event('input'));

            // Bailout if we're not at a defined pricepoint
            let pricePointFlag = false;
            const sliderPricePoint = parseFloat(sliderAmount).toFixed(2);


            pipValues.forEach((element) => {
                if (sliderPricePoint == parseFloat(element).toFixed(2));{
                    pricePointFlag = true;
                }
            });
            if (!pricePointFlag) {
                return;
            }

            let index = pipValues.indexOf(sliderPricePoint);

            text.innerHTML = textValues[index];
            icon.innerHTML = iconValues[index];
            for (let i = 0; i < pips.length; i++) {
                const node = pips[i];
                node.classList.remove('active');
            }
            donateSlider
                .querySelector(`.noUi-value[data-value='${sliderAmount}']`)
                .classList.add('active');

            if (mobileCTA) {
                // Determine if mobile CTA should be visible
                // CTA should only be visible when the amount to donate is 5
                const mobileCTAVisible = sliderAmount === 5;
                mobileCTA.style.display = mobileCTAVisible ? 'block' : 'none';
            }
        });

        const node = amount;

        node.addEventListener('keyup', function (e) {
            const num = Number(e.target.value);
            if (pipValues.includes(num)) {
                for (let i = 0; i < pips.length; i++) {
                    const node = pips[i];
                    node.classList.remove('active');
                }
                donateSlider
                    .querySelector(`.noUi-value[data-value='${num}']`)
                    .classList.add('active');
                donateSlider.noUiSlider.updateOptions({
                    start: [num],
                });
            }
        });
        // Delete the uimarkers from the DOM in the Donate slider only
        const ticks = donateSlider.querySelectorAll(
            '.noUi-marker.noUi-marker-horizontal.noUi-marker-normal, .noUi-marker.noUi-marker-horizontal.noUi-marker-large'
        );
        for (let i = 0; i < ticks.length; i++) {
            const node = ticks[i];
            node.remove();
        }
    }
}

function parseDonationValues(values) {
    // fetch amounts
    const amounts = [];
    const icons = [];
    const text = [];

    values.forEach((element, index) => {
        amounts[index] = element['amount'];
        icons[index] = element['icon'];
        text[index] = element['text'];
    });

    return [amounts, icons, text];
}

function formatAmount(pricePoint){
    const amount = pricePoint.toFixed(2).toString();

    // Handle decimals that can be integers
    if (amount.charAt((amount.length - 2)) == '0' && amount.charAt((amount.length - 1)) == '0') {
        return pricePoint;
    }

    return amount;
}

function initDonationSliders() {
    // localise currency
    let currency = '£';
    
    let monthly_values = document.getElementById('monthly_slider_values');
    
    let single_values = document.getElementById('single_slider_values');

    // There will always be at least one amount input.
    const single_call_counter = document.querySelectorAll('[name="amount"]')[0];
    let monthly_call_counter = document.querySelectorAll('[name="amount"]')[0];

    // If both sliders are enabled, there will be two
    if(monthly_values && single_values) {
        monthly_call_counter = document.querySelectorAll('[name="amount"]')[1];
    } 
    else if (!(monthly_values || single_values)) {
        // Bail if we cannot find either
        return;
    }

    if (currencyCode && currencyCode.value == 'EUR'){
        currency = '€';
    }
    
    // Set up recurring donations slider
    if (document.getElementById('monthly_slider_values')) {
        monthly_values = JSON.parse(monthly_values.textContent);
        const monthly_suggested_amount = document.getElementById('donate_slider--monthly').dataset.suggestedAmount;
        
        const [
            monthlyAmounts,
            monthlyIcons,
            monthlyText ] = parseDonationValues(monthly_values);
        
        const sliderMonthlyRange = getSliderSteps(monthlyAmounts);
        
        new DonateAmountSlider(document.getElementById('donate_slider--monthly'), {
            pipValues: monthlyAmounts,
            currency: currency,
            start: monthlyAmounts[monthlyAmounts.indexOf(monthly_suggested_amount)],
            range: sliderMonthlyRange,
            icon: document.getElementById('donate_slider--monthly-icon'),
            iconValues: monthlyIcons,
            text: document.getElementById('donate_slider--monthly-text'),
            textValues: monthlyText,
            callCounter: single_call_counter,
        });
    }

    // Set up single donation values
    if (document.getElementById('single_slider_values')) {
        single_values = JSON.parse(single_values.textContent);

        const single_suggested_amount = document.getElementById('donate_slider--one_off').dataset.suggestedAmount;
        const [
            singleAmounts,
            singleIcons,
            singleText ] = parseDonationValues(single_values);
            
        const sliderSingleRange = getSliderSteps(singleAmounts);

        new DonateAmountSlider(document.getElementById('donate_slider--one_off'), {
            pipValues: singleAmounts,
            currency: currency,
            start: singleAmounts[singleAmounts.indexOf(single_suggested_amount)],
            range: sliderSingleRange,
            icon: document.getElementById('donate_slider--single-icon'),
            iconValues: singleIcons,
            text: document.getElementById('donate_slider--single-text'),
            textValues: singleText,
            callCounter: monthly_call_counter,
        });
    }
}

export default initDonationSliders;
