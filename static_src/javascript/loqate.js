document.addEventListener('DOMContentLoaded', function() {
    var isChrome = (navigator.userAgent.includes('Chrome/') || navigator.userAgent.includes('Chromium/'));
    var addressInputs = Array.from(document.querySelectorAll('input[data-disable-autocomplete=True]'));

    addressInputs.forEach(input => {
        if (isChrome) {
            input.addEventListener('focus', () => {
                addressInputs.forEach(input => {
                    input.setAttribute('autocomplete', 'new-password');
                });
            });
        } else {
            addressInputs.forEach(input => {
                input.setAttribute('autocomplete', 'off');
            });
        }
    });
});
