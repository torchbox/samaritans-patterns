class Tabccordion {
    static selector() {
        return '.js-tabccordion';
    }

    constructor(node) {
        this.node = node;
        this.activeClass = 'is-active';
        this.activeClassMobile = 'is-active--mobile';

        // <nav> containing the tab links
        this.tabs = this.node.querySelector('.js-tabccordion-nav');

        // the tab links
        this.tabLinks = Array.from(this.tabs.querySelectorAll('a'));

        // the tab content panels
        this.tabPanels = Array.from(
            this.node.querySelectorAll('.js-tabccordion-panel'),
        );

        this.bindEventListeners();
    }

    bindEventListeners() {
        // start
        this.tabLinks.forEach((tabLink) => {
            tabLink.addEventListener('click', (e) => {
                e.preventDefault();

                // update <nav> <a>'s classes
                this.updateNav(e.target);

                // update active content
                this.updateActiveTab(e.target.getAttribute('href'));
            });
        });
        this.tabPanels.forEach((tabPanel) => {
            tabPanel.firstElementChild.addEventListener('click', (e) => {
                if (
                    e.target.parentElement.classList.contains(
                        this.activeClassMobile,
                    )
                ) {
                    e.preventDefault();
                }

                this.updateAccordions(e.target);
            });
        });
    }

    // update the <nav> <a>'s
    updateNav(clickedItem) {
        this.tabLinks.forEach((tabLink) => {
            tabLink.classList.remove(this.activeClass);
        });

        clickedItem.classList.add(this.activeClass);
    }

    // update the active tab content
    updateActiveTab(href) {
        this.tabPanels.forEach((panel) => {
            panel.classList.remove(this.activeClass);
            if (`#${panel.id}` === href) {
                panel.classList.add(this.activeClass);
            }
        });
    }

    // update accordions content - mobile
    updateAccordions(clickedItem) {
        this.tabPanels.forEach((panel) => {
            panel.classList.remove(this.activeClass);
        });

        this.tabLinks.forEach((tabLink) => {
            tabLink.classList.remove(this.activeClass);

            // keep the tab <nav> in sync with the active accordion
            if (
                tabLink.getAttribute('href') ===
                `#${clickedItem.parentElement.id}`
            ) {
                tabLink.classList.add(this.activeClass);
            }
        });
        clickedItem.parentElement.classList.add(this.activeClass);

        if (
            clickedItem.parentElement.classList.contains(this.activeClassMobile)
        ) {
            clickedItem.parentElement.classList.remove(this.activeClassMobile);
        } else {
            this.tabPanels.forEach((panel) => {
                panel.classList.remove(this.activeClassMobile);
            });
            clickedItem.parentElement.classList.add(this.activeClassMobile);
        }
    }
}

export default Tabccordion;
