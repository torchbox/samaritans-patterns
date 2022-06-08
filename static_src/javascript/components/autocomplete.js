import Awesomplete from 'awesomplete';

class Autocomplete {
    static selector() {
        return '.js-autocomplete';
    }

    constructor(node) {
        this.node = node;

        this.input = this.node.getElementsByTagName('input')[0];
        this.listSelector = this.node.dataset.autocompleteList;
        this.list = JSON.parse(
            document.querySelectorAll(this.listSelector)[0].textContent,
        );

        this.init();
    }

    init() {
        new Awesomplete(this.input, {
            minChars: 3,
            maxItems: 5,
            list: this.list,
        });
    }
}

export default Autocomplete;
