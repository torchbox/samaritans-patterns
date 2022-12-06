class ProgressBar {
    static selector() {
        return '.js-progress';
    }

    constructor(node) {
        this.node = node;
        this.footer = document.querySelector('footer');
        this.progressBar();
    }

    progressBar() {
        // excludes the footer from the calculated max height to scroll
        const getMax = () =>
            document.documentElement.scrollHeight -
            this.footer.clientHeight -
            window.innerHeight;

        const getValue = () => window.pageYOffset;

        const scrollListener = () => {
            // On scroll only the value attr needs to be calculated
            this.node.setAttribute('value', getValue());
        };

        const windowListener = () => {
            // On resize, both max/value attr needs to be calculated
            this.node.setAttribute('max', getMax());
            this.node.setAttribute('value', getValue());
        };

        // Check browser supports progress element
        if ('max' in document.createElement('progress')) {
            // Set the max attr for the first time
            this.node.setAttribute('max', getMax());

            document.addEventListener('scroll', scrollListener, {
                passive: true,
            });

            window.addEventListener('resize', windowListener, {
                passive: true,
            });
        }
    }
}

export default ProgressBar;
