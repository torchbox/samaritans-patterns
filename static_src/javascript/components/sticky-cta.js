class StickyCTA {
    static selector() {
        return '.js-sticky-cta';
    }

    constructor(node) {
        this.node = node;
        this.activeClass = 'sticky-cta--is-stuck';

        this.toggle();
        this.bindEventListeners();
    }

    bindEventListeners() {
        document.addEventListener('scroll', () => {
            this.toggle();
        });

        window.addEventListener('resize', () => {
            this.toggle();
        });
    }

    toggle() {
        if (this.node.getBoundingClientRect().top >= 0) {
            this.node.classList.remove(this.activeClass);
        } else {
            this.node.classList.add(this.activeClass);
        }
    }
}

export default StickyCTA;
