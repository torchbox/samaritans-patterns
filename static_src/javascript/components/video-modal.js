import lazyframe from 'lazyframe';

// Simple video modal which doesn't use a third party library like lightbox
// Accepts either <iframe>'s or lazy iFrames handled via lazyframe (https://github.com/vb/lazyframe)

// Assumes a strcuture as follows
// <div data-video-modal>
//     <a data-modal-open>Open video</a>
//     <div data-modal-window>
//         <a data-modal-close>close</a>
//         <iframe> or <div class="lazyframe" data-vendor="youtube" data-src="{{ page.embed }}"></div>
//     </div>
// </div>

class VideoModal {
    static selector() {
        return '[data-video-modal]';
    }

    constructor(node) {
        this.modal = node;
        this.body = document.getElementsByTagName('body')[0];
        this.noScroll = 'no-scroll';
        this.modalOpen = this.modal.querySelector('[data-modal-open]');
        this.modalWindow = this.modal.querySelector('[data-modal-window]');
        this.modalClose = this.modal.querySelectorAll('[data-modal-close]');
        this.iframe = this.modal.querySelector('iframe');
        this.src = this.iframe ? this.iframe.getAttribute('src') : null;
        this.lazyIframe = this.modal.querySelector('.lazyframe');
        this.lazyIframeSrc = this.lazyIframe ? this.lazyIframe.getAttribute('data-src') : null;
        this.bindEvents();
    }

    scrollToggle() {
        if (this.body.classList.contains('no-scroll')) {
            this.body.classList.remove('no-scroll');
        } else {
            this.body.classList.add('no-scroll');
        }
    }

    bindEvents() {
        if (this.lazyIframe) {
            lazyframe('.lazyframe');
            this.handleLazyIframe();
        } else {
            this.handleIframe();
        }
    }

    handleLazyIframe() {
        this.modalOpen.addEventListener('click', (e) => {
            this.handleCommonOpenEvents(e);

            // there won't be an iframe the first time the modal is opened
            if (this.modal.querySelector('iframe')) {
                // re-instate the iframe src as it was removed on modal close
                this.modal.querySelector('iframe').setAttribute('src', this.lazyIframeSrc);
            }
        });

        this.modalClose.forEach((value) => {
            value.addEventListener('click', (e) => {
                this.handleCommonCloseEvents(e);

                // there won't be an iframe the first time the modal is opened
                if (this.modal.querySelector('iframe')) {
                    // stops video playing when window is closed
                    this.modal.querySelector('iframe').setAttribute('src', '');
                }
            });
        });
    }

    handleIframe() {
        this.modalOpen.addEventListener('click', (e) => {
            this.handleCommonOpenEvents(e);

            if (!this.iframe.getAttribute('src').length) {
                this.iframe.setAttribute('src', this.src);
            }
        });

        this.modalClose.forEach((value) => {
            value.addEventListener('click', (e) => {
                this.handleCommonCloseEvents(e);

                // stops video playing when window is closed
                this.modal.querySelector('iframe').setAttribute('src', '');
            });
        });
    }

    handleCommonOpenEvents(e) {
        e.preventDefault();
        this.scrollToggle();
        this.modalWindow.classList.add('open');
        // Ensure modal stacks on top of all other UI when open
        document.querySelectorAll('.hero')[0].classList.add('stack-on-top');
    }

    handleCommonCloseEvents(e) {
        e.preventDefault();
        this.scrollToggle();
        this.modalWindow.classList.remove('open');
        // Return stacking to previous state
        document.querySelectorAll('.hero')[0].classList.remove('stack-on-top');
    }
}

export default VideoModal;
