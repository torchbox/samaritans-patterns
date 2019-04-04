class RegionField {
    static selector() {
        return '.js-region-field';
    }

    constructor(node) {
        this.node = node;
        this.countrySelect = document.getElementById('id_country');
        this.bindEvents();
    }

    bindEvents() {
        // Show region field if country is US
        this.countrySelect.addEventListener('change', () => {
            if (this.countrySelect.selectedOptions[0].value === 'US') {
                this.node.toggleAttribute('hidden', false);
            } else {
                this.node.toggleAttribute('hidden', true);
            }
        });
    }
}

export default RegionField;
