document.addEventListener('DOMContentLoaded', function () {
    const hiddenClass = 'card-new--hidden';
    const hideListeningCTA = (element) => element && element.classList.add(hiddenClass);
    const showListeningCTA = (element) => element && element.classList.remove(hiddenClass);

    const hideCustomChatElements = () => document.querySelectorAll('[data-hidden-if-chat-unavailable]').forEach(el => {
        el.style.display = 'none';
    });
    const showCustomChatElements = () => document.querySelectorAll('[data-shown-if-chat-available]').forEach(el => {
        el.style.display = '';
    });

    var api_url = JSON.parse(
        document.getElementById('webchat_api_url').textContent
    );

    const chatCTA = document.querySelector(
        '[data-cta-block-large][data-cta-type="chat"]'
    );


    // small and large CTA are rendered as a pair in joint 3rd place.
    // they are first and last of type respectively
    const smallCTA = document.querySelector('[data-cta-block-small]');
    const largeCTAs = document.querySelectorAll('[data-cta-block-large]');
    const largeCTA = largeCTAs[largeCTAs.length - 1];

    const promoteCTA = () => {
        // Do not promote 3rd place CTA if:
        // * No large chat CTA is present
        // * Chat CTA exists as a small CTA

        const smallChatCTA = document.querySelector(
            '[data-cta-block-small][data-cta-type="chat"]'
        );
        if (smallChatCTA || !chatCTA) return;

        // promote the 3rd place small cta to a large one
        smallCTA && hideListeningCTA(smallCTA);
        largeCTA && showListeningCTA(largeCTA);
    };

    // There can be several chat CTAs on the same page - primary, sticky, and tabccordion
    var otherCtas = document.querySelectorAll(
        '[data-listening-cta-type="chat"], [data-tabccordion-cta-type="chat"], [data-service-cta-type="chat"]'
    );

    const hideOtherCTAs = () => {
        for (var cta of otherCtas) {
            cta.classList.add('hidden');
        }
    };

    const showOtherCTAs = () => {
        for (var cta of otherCtas) {
            cta.classList.add('active');
        }
    };

    if (!api_url) {
        hideCustomChatElements();
        // Bail if we don't have an API URL. Make sure the element is removed
        hideListeningCTA(chatCTA);
        promoteCTA();
        hideOtherCTAs();
        return;
    }

    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === window.XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                if (data['active']) {
                    showCustomChatElements();

                    // Ensure the small is visible and the large is hidden
                    largeCTA && hideListeningCTA(largeCTA);
                    smallCTA && showListeningCTA(smallCTA);

                    let waitMinutes = data['wait_time'] / 60;
                    let status = 'Estimated wait time: ';
                    if (waitMinutes <= 10) {
                        status += 'up to 10 minutes';
                    } else {
                        let baseTime = Math.ceil(waitMinutes / 5) * 5;
                        status += `${baseTime - 5} - ${baseTime + 5} minutes`;
                    }

                    showOtherCTAs();
                    for (var cta of otherCtas) {
                        for (var waitTimeNode of cta.querySelectorAll(
                            '[data-chat-wait-time]'
                        )) {
                            waitTimeNode.innerText = status;
                        }

                        if (cta.tagName === 'A') {
                            let href = cta.getAttribute('data-href');
                            if (href) {
                                cta.setAttribute('href', href);
                            }
                        }
                        for (var chevron of cta.querySelectorAll(
                            '.listening-cta__chevron'
                        )) {
                            chevron.style.display = 'inline-block';
                        }

                        // Add hrefs to all links, populating from data-href attributes
                        for (var anchor of cta.querySelectorAll('a')) {
                            let href = anchor.getAttribute('data-href');
                            if (href) {
                                anchor.setAttribute('href', href);
                            }
                        }
                    }
                } else {
                    hideCustomChatElements();
                    chatCTA && hideListeningCTA(chatCTA);
                    // hideOtherCTAs();
                    promoteCTA();
                }
            }
        }
    };
    xhr.open('GET', api_url);
    xhr.timeout = 2000;
    xhr.send();
});
