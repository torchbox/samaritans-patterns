class HeaderMenu {
    static selector() {
        return '.js-header-menu';
    }

    constructor(node) {
        this.node = node;
        this.activeClass = 'is-open--header-menu';
        this.navLink = this.node.querySelector('.js-open-header-menu');
        this.allNavItems = Array.from(
            document.querySelectorAll('.js-header-menu'),
        );
        this.overlay = document.querySelector('.js-header-menu-overlay');

        this.bindEventListeners();
    }

    bindEventListeners() {
        if (this.navLink) {
            this.navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenus();
            });
        }
    }

    closeMenus() {
        this.allNavItems.forEach((navItem) => {
            if (navItem.classList.contains(this.activeClass)) {
                navItem.classList.remove(this.activeClass);
                this.overlay.classList.remove(this.activeClass);
            }
        });
    }

    toggle() {
        this.node.classList.contains(this.activeClass)
            ? this.close()
            : this.open();
    }

    open() {
        this.closeMenus();
        this.node.classList.add(this.activeClass);
        if (this.overlay) {
            this.overlay.classList.add(this.activeClass);
        }
    }

    close() {
        this.node.classList.remove(this.activeClass);
        this.overlay.classList.remove(this.activeClass);
    }
}

export default HeaderMenu;
