class MobileMenu {
    static selector() {
        return '.js-mobile-menu-toggle';
    }

    constructor(node) {
        this.node = node;
        this.body = document.getElementsByTagName('body')[0];
        this.headerNav = document.querySelector('.js-header-nav');
        this.animatedClass = 'js-header-nav--is-animated';
        this.menuActiveClass = 'mob-nav-open';

        this.state = {
            open: false,
        };

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.node.addEventListener('click', () => {
            this.toggle();
        });

        this.updatedAnimatedClass();
    }

    toggle() {
        this.body.classList.toggle(this.menuActiveClass);
    }

    updatedAnimatedClass() {
        let timeout;

        window.addEventListener('resize', () => {
            clearTimeout(timeout);

            this.headerNav.classList.remove(this.animatedClass);

            timeout = setTimeout( () => {
                this.headerNav.classList.add(this.animatedClass);
            }, 100);
        });
    }
}

export default MobileMenu;
