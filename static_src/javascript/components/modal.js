import MicroModal from 'micromodal';

class Modal {
    static selector() {
        return '.js-modal';
    }

    constructor(node) {
        this.node = node;
        this.Modal();
    }

    Modal() {
        // Disable default action of the triggering element, e.g. a link or a
        // button.
        [...document.querySelectorAll('[data-micromodal-trigger]')].forEach(
            (el) => {
                el.addEventListener('click', (evt) => {
                    evt.preventDefault();
                });
            },
        );

        MicroModal.init({
            disableScroll: true,
            awaitCloseAnimation: true,
        });
    }
}

export default Modal;
