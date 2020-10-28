// Simple video modal which doesn't use a third party library like lightbox

// Assumes a strcuture as follows
// <div data-video-modal>
//     <a data-modal-open>Open video</a>
//     <div data-modal-window>
//         <a data-modal-close>close</a>
//         Video iframe embed
//     </div>
// </div>

// Prevent the window scrolling as modal
// Will slide behind other features when open
function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    window.onscroll=function(){};
}
class VideoModal {
    static selector() {
        return '[data-video-modal]';
    }

    constructor(node) {
        this.modal = node;
        this.modalOpen = this.modal.querySelector('[data-modal-open]');
        this.modalWindow = this.modal.querySelector('[data-modal-window]');
        this.modalClose = this.modal.querySelectorAll('[data-modal-close]');
        this.iframe = this.modal.querySelector('iframe');
        this.src = this.iframe.getAttribute('src');
        this.bindEvents();
    }

    bindEvents() {
        this.modalOpen.addEventListener('click', (e) => {
            e.preventDefault();
            disableScrolling();
            this.modalWindow.classList.add('open');
            if (!this.iframe.getAttribute('src').length) {
                this.iframe.setAttribute('src', this.src);
            }
        });

        this.modalClose.forEach((value) => {
            value.addEventListener('click', (e) => {
                e.preventDefault();
                enableScrolling();
                this.modalWindow.classList.remove('open');
                // stops video playing when window is closed
                this.iframe.setAttribute('src', '');
            });
        });
    }
}

export default VideoModal;
