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
        MicroModal.init({
            disableScroll: true,
            awaitCloseAnimation: true
        });
    }

}

export default Modal;
