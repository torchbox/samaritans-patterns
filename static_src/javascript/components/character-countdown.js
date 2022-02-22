class CharacterCountdown {
    static selector() {
        return '[data-character-countdown]';
    }

    constructor(node) {
        this.node = node;
        this.field = this.node.querySelector('textarea');
        this.label = this.node.querySelector(
            '[data-character-countdown-value]',
        );
        this.maxLength = this.field.getAttribute('maxlength');

        this.bindEventListeners();
    }

    updateLabel(currentValue) {
        const count = this.maxLength - currentValue;
        const characters = count === 1 ? 'character' : 'characters';
        this.label.innerHTML = `${count} ${characters} remaining`;
    }

    setDefaultLabel() {
        this.label.innerHTML = `${this.maxLength} characters remaining`;
        this.label.classList.add('character-countdown__count--show');
    }

    bindEventListeners() {
        // Set default label
        this.setDefaultLabel();

        // Update label on user input
        this.field.addEventListener('input', (e) => {
            this.updateLabel(e.currentTarget.value.length);
        });
    }
}

export default CharacterCountdown;
