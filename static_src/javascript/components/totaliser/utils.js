// https://www.npmjs.com/package/canvas-confetti
import confetti from 'canvas-confetti';

// Return raised value as a percentage of the target value
export function raisedValueAsPercentage() {
    return Math.floor((window.totaliserConfig.raisedValue / window.totaliserConfig.targetValue) * 100);
}

// Return a number with currency comma spacing
export function currencyWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Create some confetti
export function confettiAnimation() {
    const count = 200;

    // Create canvas element, set position and add to body
    const canvasTopOffset = document.querySelector('[data-totaliser-percentage-position]').getBoundingClientRect().top;
    const canvasLeftOffset = document.querySelector('[data-totaliser-percentage-position]').getBoundingClientRect().left;
    const canvas = document.createElement('canvas');
    canvas.classList.add('totaliser-bar__confetti');
    canvas.style.top = (canvasTopOffset - 550 )+ 'px';
    canvas.style.left = (canvasLeftOffset - 490 ) + 'px';
    document.body.appendChild(canvas);

    canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });

    const defaults = {
        origin: { y: 0.55 }
    };

    function fire(particleRatio, opts) {
        canvas.confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));

        // Remove canvas once finished
        setTimeout(() => {
            canvas.remove();
        }, 5000);
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 50,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 30,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 45,
        startVelocity: 45,
    });

}

