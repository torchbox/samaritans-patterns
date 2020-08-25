import MicroModal from 'micromodal';

class RescheduleInterview {
    static selector() {
        return '[data-reschedule-training-form]';
    }

    constructor(node) {
        this.node = node;
        this.formSlot = document.querySelector('[data-form-slot]');
        this.dateSlot = document.querySelector('[data-date-slot]');
        this.venueSlot = document.querySelector('[data-venue-slot]');
        this.openModalButton = this.node.querySelector(
            '[data-reschedule-training]',
        );

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.openModalButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
            this.addFormMarkup(this.node);
        });
    }

    openModal() {
        // open modal on interview form button click
        MicroModal.show('reschedule-interview-modal', {
            onClose: () => this.resetUI(),
        });
    }

    addFormMarkup(form) {
        // copy the form to the modal
        const duplicatedForm = form.cloneNode(true);
        this.formSlot.appendChild(duplicatedForm);
    }

    resetUI() {
        this.formSlot.innerHTML = '';
    }
}

export default RescheduleInterview;
