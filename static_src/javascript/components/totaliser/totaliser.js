import { currencyWithCommas, raisedValueAsPercentage, confettiAnimation } from './utils';

class Totaliser {
    static selector() {
        return '[data-totaliser]';
    }

    constructor(node) {
        this.node = node;

        // Template config
        this.configTargetValue = Number(window.totaliserConfig.targetValue);
        this.configRaisedValue = Number(window.totaliserConfig.raisedValue);

        // DOM nodes
        this.progressBar = this.node.querySelector('[data-totaliser-progress]');
        this.percentageValue = this.node.querySelector('[data-totaliser-percentage-value]');
        this.percentagePosition = this.node.querySelector('[data-totaliser-percentage-position]');
        this.UIraisedValue = this.node.querySelector('[data-totaliser-raised]');
        this.UItargetValue = this.node.querySelector('[data-totaliser-target]');

        // UI config
        this.delay = 10;
        this.animationSpeed = 2000;
        this.confettiDelay = 1900;
        this.progressBarColour = '#00a690';

        this.bindEventListeners();
    }

    // Animate value from 0 to target
    countUpValue(element, startValue, endValue, duration, currency) {
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;

            const progressValue = Math.min((timestamp - startTimestamp) / duration, 1);
            const incrementValue = Math.floor(progressValue * (endValue - startValue) + startValue);

            // If currency value, format accordingly
            element.innerHTML = currency ? currencyWithCommas(incrementValue) : incrementValue;

            if (progressValue < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    progressBarUI() {
        // Don't allow width to exceed 100%
        let width = raisedValueAsPercentage() > 100 ? 100 : raisedValueAsPercentage();
        this.progressBar.style.width = width + '%';
        this.progressBar.style.backgroundColor = this.progressBarColour;

        // Do some confetti if target exceeded
        if (this.configRaisedValue >= this.configTargetValue) {
            setTimeout(() => {
                confettiAnimation();
            }, this.confettiDelay);
        }
    }

    percentageUI() {
        // Don't allow offset to exceed 100%
        let offset = raisedValueAsPercentage() > 100 ? 100 : raisedValueAsPercentage();
        this.percentagePosition.style.left = offset + '%';
        this.percentagePosition.style.opacity = '100%';
    }

    // Format target value
    targetUI() {
        this.UItargetValue.innerHTML = currencyWithCommas(window.totaliserConfig.targetValue);
    }

    bindEventListeners() {
        setTimeout(() => {
            // Update UI
            this.progressBarUI();
            this.percentageUI();
            this.targetUI();

            // Animate and increment percentage/raised values
            this.countUpValue(this.percentageValue, 0, raisedValueAsPercentage(), this.animationSpeed, false);
            this.countUpValue(this.UIraisedValue, 0, this.configRaisedValue, this.animationSpeed, true);

        }, this.delay);
    }
}

export default Totaliser;
