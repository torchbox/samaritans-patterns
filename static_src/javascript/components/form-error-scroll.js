// scroll down to the first form error, if there is one
export const formErrorScroll = () => {
    const firstError = document.querySelector('.form-item--errors');

    if (firstError) {
        firstError.scrollIntoView();
    }
};
