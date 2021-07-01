// Simple video modal which doesn't use a third party library like lightbox

// Assumes a strcuture as follows
// <div data-video-modal>
//     <a data-modal-open>Open video</a>
//     <div data-modal-window>
//         <a data-modal-close>close</a>
//         Video iframe embed
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
        this.donateHero = document.querySelector('[data-hero-donate-landing]');
        this.iframe = this.modal.querySelector('iframe');
        this.src = this.iframe.getAttribute('src');
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
        this.modalOpen.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToggle();
            // ensure video in donate hero sits above everything when open
            // setting this in css disrupts the page stacking
            if (this.donateHero) {
                this.donateHero.style.zIndex = '27';
            }
            this.modalWindow.classList.add('open');
            if (!this.iframe.getAttribute('src').length) {
                this.iframe.setAttribute('src', this.src);
            }

            // Ensure modal stacks on top of all other UI when open
            document.querySelectorAll('.hero')[0].classList.add('stack-on-top');
        });

        this.modalClose.forEach((value) => {
            value.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToggle();
                if (this.donateHero) {
                    this.donateHero.style.zIndex = '10';
                }
                this.modalWindow.classList.remove('open');
                // stops video playing when window is closed
                this.iframe.setAttribute('src', '');

                // Return stacking to previous state
                document.querySelectorAll('.hero')[0].classList.remove('stack-on-top');
            });
        });
    }
}

export default VideoModal;
