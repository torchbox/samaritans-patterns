import Utilities from './../utilities';

class ChapterBar {
    static selector() {
        return '[data-chapter-bar]';
    }

    constructor(node) {
        this.node = node;
        this.chapterSelect = this.node.querySelector('[data-chapter-bar-select]');

        this.bindEvents();
    }

    bindEvents() {
        // add class when chapter bar sticks
        window.addEventListener(
            'scroll',
            Utilities.throttle(() => {
                this.node.classList.toggle(
                    'is-sticky',
                    this.node.offsetTop <= window.scrollY
                );
            }, 50)
        );

        // navgiate to chapter on select change
        this.chapterSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                window.location.href = e.target.value;
            }
        });
    }
}

export default ChapterBar;
