class SelfDescribeReveal {
    static selector() {
        return 'select[data-self-describe-choice][data-self-describe-field]';
    }

    constructor(node) {
        this.node = node;
        this.selfDescribeChoice = this.node.dataset.selfDescribeChoice;
        if (!this.selfDescribeChoice) {
            return;
        }
        const { selfDescribeField } = this.node.dataset;
        this.selfDescribeSection = document.querySelector(`[data-self-describe-section="${selfDescribeField}"]`);
        if (!this.selfDescribeSection) {
            return;
        }

        // Hide the self describe text fields.
        this.selfDescribeSection.style.display = 'none';

        this.bindEvents();
    }

    bindEvents() {
        this.node.addEventListener('change', (event) => {
            if (
                event.target.value === this.selfDescribeChoice
            ) {
                this.selfDescribeSection.style.display = '';
            } else {
                this.selfDescribeSection.style.display = 'none';
                this.selfDescribeSection.querySelector('input').value = '';
            }
        });
    }
}

export default SelfDescribeReveal;
