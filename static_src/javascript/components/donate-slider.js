import noUiSlider from 'nouislider';

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

        noUiSlider.create(donateSlider, {
            connect: true,
            behaviour: 'tap',
            start: this.config.start,
            range: this.config.range,
            pips: {
                mode: 'count',
                values: this.config.pipValues.length,
                density: 4,
                stepped: true,
                format: {
                    to: (value) => `£${value}`,
                },
            },
        });
    }

    bindEventListeners() {
        const mobileCTA = document.getElementById('donate-landing__mobile-cta');
        const donateSlider = this.node;
        const pipValues = this.config.pipValues;

        // There are two #id_amount's in the DOM. Selecting by the name is more reliable
        const amounts = document.querySelectorAll('[name="amount"]');
        const pips = donateSlider.querySelectorAll('.noUi-value');
        donateSlider.noUiSlider.on('update', function (values, handle) {
            // Update the input value when the slider is updated
            const sliderAmount = Number(values[handle]);
            for (let i = 0; i < amounts.length; i++) {
                const node = amounts[i];
                node.value = sliderAmount;

                // Trigger input event to update donation usage counters
                node.dispatchEvent(new Event('input'));
            }
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

        for (let i = 0; i < amounts.length; i++) {
            const node = amounts[i];
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
        }
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

function initDonationSliders() {
    // One off donations slider
    new DonateAmountSlider(document.getElementById('donate_slider--one_off'), {
        pipValues: [5, 10, 15, 25, 50, 75],
        start: 25,
        range: {
            // Starting at 5, step the value by 5 until 15 is reached.
            // from 15, step the value by 10 until 25 is reached.
            // then starting from 25, step the value by 25 until 75 is reached.
            'min': [5, 5],
            '20%': [10, 5],
            '40%': [15, 10],
            '60%': [25, 25],
            '80%': [50, 25],
            'max': [75],
        },
    });
    // Monthly recurring donations slider
    new DonateAmountSlider(document.getElementById('donate_slider--monthly'), {
        pipValues: [5, 10, 15, 20],
        start: 10,
        range: {
            // Starting at 5, step the value by 5 until 20 is reached.
            'min': [5, 5],
            '33%': [10, 5],
            '67%': [15, 5],
            'max': [20],
        },
    });
}

export default initDonationSliders;
