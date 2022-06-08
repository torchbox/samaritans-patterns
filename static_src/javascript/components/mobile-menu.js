import { createFocusTrap } from 'focus-trap';

class MobileMenu {
    static selector() {
        return '.js-mobile-menu-toggle';
    }

    constructor(node) {
        this.node = node;
        this.body = document.getElementsByTagName('body')[0];
        this.headerNav = document.querySelector('.js-header-nav');
        this.menuActiveClass = 'mob-nav-open';
        this.animateClass = 'animate-mob-nav';
        this.visibleClass = 'is-visible';
        this.openButton = document.querySelector('.js-open-mobile-menu');
        this.closeButton = document.querySelector('.js-close-mobile-menu');
        this.fistMenuItem = document.querySelector('.js-open-header-menu');
        this.focusTrap = createFocusTrap(this.headerNav);

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.openButton.addEventListener('click', () => this.handleOpen());
        this.closeButton.addEventListener('click', () => this.handleClose());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleClose();
            }
        });
    }

    handleOpen() {
        this.node.setAttribute('aria-expanded', 'true');

        // remove 'display: none' from the menu
        this.headerNav.classList.add(this.visibleClass);

        setTimeout(() => {
            // animate the menu in
            this.body.classList.add(this.animateClass);
        }, 100);

        setTimeout(() => {
            // hide the body content once the transition has finished
            this.body.classList.add(this.menuActiveClass);

            // move focus to the first menu item
            this.fistMenuItem.focus();
        }, 260);

        // activate focus trap
        this.focusTrap.activate();
    }

    handleClose() {
        this.node.setAttribute('aria-expanded', 'false');

        // show the body content
        this.body.classList.remove(this.menuActiveClass);

        setTimeout(() => {
            // animate the menu out
            this.body.classList.remove(this.animateClass);
        }, 100);

        setTimeout(() => {
            // add 'display: none' to the menu so it can't be focussed
            this.headerNav.classList.remove(this.visibleClass);

            // move the focus to the first nav item
            document.querySelector('.nav__link').focus();
        }, 260);

        // remove focus trap
        this.focusTrap.deactivate();
    }
}

export default MobileMenu;
