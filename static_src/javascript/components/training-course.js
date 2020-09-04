import MicroModal from 'micromodal';

class TrainingCourse {
    static selector() {
        return '[data-training-course]';
    }

    constructor(node) {
        this.node = node;
        this.formSlot = document.querySelector('[data-form-slot]');
        this.dateSlot = document.querySelector('[data-date-slot]');
        this.venueSlot = document.querySelector('[data-venue-slot]');
        this.button = document.querySelector('[data-confirm-course]');
        this.modal = document.getElementById('training-course-modal');
        this.courseDate = this.node.querySelector(
            '[data-course-date]',
        ).textContent;
        this.courseVenue = this.node.querySelector(
            '[data-course-venue]',
        ).textContent;
        this.openModalButton = this.node.querySelector(
            '[data-open-training-modal]',
        );

        this.bindEventListeners();
    }

    bindEventListeners() {
        this.openModalButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
            this.addFormMarkup(this.openModalButton.parentNode.nextElementSibling);
        });
    }

    openModal() {
        // open modal on training course button click
        MicroModal.show('training-course-modal', {
            onClose: () => this.resetUI(),
        });

        this.addMarkup();
    }

    addMarkup() {
        // populate modal with course venue and date
        this.venueSlot.innerHTML = this.courseVenue;
        this.dateSlot.innerHTML = this.courseDate;
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

export default TrainingCourse;
