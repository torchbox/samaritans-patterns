import noUiSlider from 'nouislider';

const currencyCode = document.getElementById('id_currency');
const toNumbers = (arr) => arr.map(Number);
const differenceBetween = (numberOne, numberTwo) =>
    Number(numberOne) - Number(numberTwo);

function getSliderSteps(sliderStepValues) {
    var stepsDict = {};

    // Cast to numbers
    sliderStepValues = toNumbers(sliderStepValues);

    sliderStepValues.forEach((stepValue, index) => {
        // The first and last values need a slightly different syntax
        // see: https://refreshless.com/nouislider/slider-values/
        if (index === 0) {
            stepsDict['min'] = [
                sliderStepValues[0],
                differenceBetween(
                    sliderStepValues[index + 1],
                    sliderStepValues[0],
                ),
            ];
        } else if (index == sliderStepValues.length - 1) {
            stepsDict['max'] = [
                sliderStepValues[index],
                differenceBetween(
                    sliderStepValues[index],
                    sliderStepValues[index - 1],
                ),
            ];
        } else {
            // Calculate % ratio for placement of point
            stepValue = (index / (sliderStepValues.length - 1)) * 100;
            stepsDict[String(stepValue)] = [
                sliderStepValues[index],
                differenceBetween(
                    sliderStepValues[index + 1],
                    sliderStepValues[index],
                ),
            ];
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
            handleAttributes: [
                {
                    'aria-label':
                        'Use the slider to choose an amount to donate',
                },
            ],
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
            const sliderAmount = formatAmount(values[handle]);
            const node = amount;
            node.value = sliderAmount;

            // Trigger input event to update donation usage counters
            let event;
            if (typeof Event === 'function') {
                node.dispatchEvent(new Event('input'));
            } else {
                event = document.createEvent('Event');
                event.initEvent('input', true, true);
            }

            let pricePointFlag = false;
            const sliderPricePoint = formatAmount(sliderAmount);

            let index = 0;

            pipValues.forEach((element) => {
                // Handle comparison between integers or decimals by forcing decimal representation
                if (Number(sliderPricePoint) == Number(element)) {
                    pricePointFlag = true;
                    index = pipValues.indexOf(element);
                }
            });
            // Bailout if we're not at a defined price point
            if (!pricePointFlag) {
                return;
            }

            text.innerHTML = textValues[index];
            icon.innerHTML = iconValues[index];

            // Style the active pip
            for (let i = 0; i < pips.length; i++) {
                const node = pips[i];
                node.classList.remove('active');
            }

            pips[index].classList.add('active');

            if (mobileCTA) {
                // Determine if mobile CTA should be visible
                // CTA should only be visible when the amount to donate is 5
                const mobileCTAVisible = Number(sliderAmount) === 5;
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
            '.noUi-marker.noUi-marker-horizontal.noUi-marker-normal, .noUi-marker.noUi-marker-horizontal.noUi-marker-large',
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
        amounts[index] = formatAmount(element['amount']);
        icons[index] = element['icon'];
        text[index] = element['text'];
    });

    return [amounts, icons, text];
}

function formatAmount(pricePoint) {
    const amount = parseFloat(pricePoint).toFixed(2);

    // Handle decimals that can be integers
    if (
        amount.charAt(amount.length - 2) == '0' &&
        amount.charAt(amount.length - 1) == '0'
    ) {
        return pricePoint;
    }

    return amount;
}

function getIndex(arr, amount) {
    let index = -1;

    arr.forEach((element) => {
        // Handle comparison between integers or decimals by forcing decimal representation
        if (Number(amount) == Number(element)) {
            index = arr.indexOf(element);
        }
    });
    return index;
}

function initDonationSliders() {
    // localise currency
    let currency = '£';

    let monthlyValues = document.getElementById('monthly_slider_values');

    let singleValues = document.getElementById('single_slider_values');

    // There will always be at least one amount input.
    const single_call_counter = document.querySelectorAll('[name="amount"]')[0];
    let monthly_call_counter = document.querySelectorAll('[name="amount"]')[0];

    // If both sliders are enabled, there will be two
    if (monthlyValues && singleValues) {
        monthly_call_counter = document.querySelectorAll('[name="amount"]')[1];
    } else if (!(monthlyValues || singleValues)) {
        // Bail if we cannot find either
        return;
    }

    if (currencyCode && currencyCode.value == 'EUR') {
        currency = '€';
    }

    // Set up recurring donations slider
    if (
        document.getElementById('monthly_slider_values') &&
        document.getElementById('donate_slider--monthly')
    ) {
        monthlyValues = JSON.parse(monthlyValues.textContent);

        const monthlySuggestedAmount = formatAmount(
            document.getElementById('donate_slider--monthly').dataset
                .suggestedAmount,
        );

        const [monthlyAmounts, monthlyIcons, monthlyText] =
            parseDonationValues(monthlyValues);

        const sliderMonthlyRange = getSliderSteps(monthlyAmounts);
        const monthlyAmountStartIndex = getIndex(
            monthlyAmounts,
            monthlySuggestedAmount,
        );

        new DonateAmountSlider(
            document.getElementById('donate_slider--monthly'),
            {
                pipValues: monthlyAmounts,
                currency: currency,
                start: monthlyAmounts[monthlyAmountStartIndex],
                range: sliderMonthlyRange,
                icon: document.getElementById('donate_slider--monthly-icon'),
                iconValues: monthlyIcons,
                text: document.getElementById('donate_slider--monthly-text'),
                textValues: monthlyText,
                callCounter: single_call_counter,
            },
        );
    }

    // Set up single donation values
    if (
        document.getElementById('single_slider_values') &&
        document.getElementById('donate_slider--one_off')
    ) {
        singleValues = JSON.parse(singleValues.textContent);

        const singleSuggestedAmount = formatAmount(
            document.getElementById('donate_slider--one_off').dataset
                .suggestedAmount,
        );

        const [singleAmounts, singleIcons, singleText] =
            parseDonationValues(singleValues);

        const sliderSingleRange = getSliderSteps(singleAmounts);
        const SingleAmountStartIndex = getIndex(
            singleAmounts,
            singleSuggestedAmount,
        );

        new DonateAmountSlider(
            document.getElementById('donate_slider--one_off'),
            {
                pipValues: singleAmounts,
                currency: currency,
                start: singleAmounts[SingleAmountStartIndex],
                range: sliderSingleRange,
                icon: document.getElementById('donate_slider--single-icon'),
                iconValues: singleIcons,
                text: document.getElementById('donate_slider--single-text'),
                textValues: singleText,
                callCounter: monthly_call_counter,
            },
        );
    }
}

export default initDonationSliders;
