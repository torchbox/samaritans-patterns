import { MetricsAPIClient } from 'utils/queue-status';

document.addEventListener('DOMContentLoaded', () => {
    const hiddenClass = 'card-new--hidden';
    const hideListeningCTA = (element) =>
        element && element.classList.add(hiddenClass);
    const showListeningCTA = (element) =>
        element && element.classList.remove(hiddenClass);

    const hideCustomChatElements = () =>
        document
            .querySelectorAll('[data-hidden-if-chat-unavailable]')
            .forEach((el) => {
                el.style.display = 'none';
            });
    const showCustomChatElements = () =>
        document
            .querySelectorAll('[data-shown-if-chat-available]')
            .forEach((el) => {
                el.style.display = '';
            });

    // Amazon Connect API config
    // Find the first script tag that starts with 'webchat_queue_config_'
    // and assume that all other CTAs on the page use the same configuration.
    // NB: webchat_queue_config is only present on the page if the chat platform
    // is Amazon Connect.
    const webchatQueueConfigScript = document.querySelector(
        '[id^="webchat_queue_config_"]',
    );
    const webchatQueueConfig = webchatQueueConfigScript
        ? JSON.parse(webchatQueueConfigScript.textContent)
        : null;

    // If the queue config is not present, assume the chat platform is IFS.
    const chatPlatform = webchatQueueConfig?.chat_platform
        ? webchatQueueConfig.chat_platform
        : 'ifs';

    // Legacy IFS API URL
    const rawApiUrl = JSON.parse(
        document.getElementById('webchat_api_url').textContent,
    );
    const apiUrl = rawApiUrl ? new URL(rawApiUrl) : null;

    const chatCTA = document.querySelector(
        '[data-cta-block-large][data-cta-type="chat"]',
    );
    const smallChatCTA = document.querySelector(
        '[data-cta-block-small][data-cta-type="chat"]',
    );

    // There can be several chat CTAs on the same page - primary, sticky, and tabccordion
    const otherCtas = document.querySelectorAll(
        '[data-listening-cta-type="chat"], [data-tabccordion-cta-type="chat"], [data-service-cta-type="chat"]',
    );
    if (apiUrl) {
        // Find the first CTA that has a skill set (if any have it) and assume
        // that all other CTAs on the page are related to this webchat skill.
        const ctaSkill = [chatCTA, smallChatCTA, ...otherCtas]
            .filter(Boolean)
            .map((element) => element.dataset.ctaSkill)
            .find(Boolean);
        if (ctaSkill) {
            apiUrl.searchParams.set('skill', ctaSkill);
        }
    }

    // small and large CTA are rendered as a pair in joint 3rd place.
    // they are first and last of type respectively
    const smallCTA = document.querySelector('[data-cta-block-small]');
    const largeCTAs = document.querySelectorAll('[data-cta-block-large]');
    const largeCTA = largeCTAs[largeCTAs.length - 1];

    const promoteCTA = () => {
        // Do not promote 3rd place CTA if:
        // * No large chat CTA is present
        // * Chat CTA exists as a small CTA

        if (smallChatCTA || !chatCTA) return;

        // promote the 3rd place small cta to a large one
        if (smallCTA) {
            hideListeningCTA(smallCTA);
        }
        if (largeCTA) {
            showListeningCTA(largeCTA);
        }
    };

    const getChatUnavailableCtas = () =>
        document.querySelectorAll('[data-cta-type="chat_unavailable"]');
    const showChatUnavailableCtas = () => {
        getChatUnavailableCtas().forEach((el) => {
            el.classList.remove(hiddenClass);
        });
    };
    const hideChatUnavailableCtas = () => {
        getChatUnavailableCtas().forEach((el) => {
            el.classList.add(hiddenClass);
        });
    };

    const hideOtherCTAs = () => {
        otherCtas.forEach((cta) => {
            cta.classList.add('hidden');
        });
    };

    const showOtherCTAs = () => {
        otherCtas.forEach((cta) => {
            cta.classList.add('active');
        });
    };

    if (!apiUrl && chatPlatform === 'ifs') {
        hideCustomChatElements();
        // Bail if we don't have an API URL. Make sure the element is removed
        hideListeningCTA(chatCTA);
        promoteCTA();
        hideOtherCTAs();
        return;
    }

    if (
        chatPlatform === 'amazon_connect' &&
        (!webchatQueueConfig.ac_metrics_id ||
            !webchatQueueConfig.ac_metrics_endpoint ||
            !webchatQueueConfig.ac_metrics_api_key)
    ) {
        hideCustomChatElements();
        // Bail if we don't have complete configuration.
        hideListeningCTA(chatCTA);
        promoteCTA();
        hideOtherCTAs();
        return;
    }

    const statusCallback = (data) => {
        if (data.active) {
            showCustomChatElements();

            hideChatUnavailableCtas();
            // Ensure the small is visible and the large is hidden
            if (largeCTA) {
                hideListeningCTA(largeCTA);
            }
            if (smallCTA) {
                showListeningCTA(smallCTA);
            }

            const waitMinutes = data.wait_time / 60;
            let status = 'Estimated wait time: ';
            if (waitMinutes <= 10) {
                status += 'up to 10 minutes';
            } else {
                const baseTime = Math.ceil(waitMinutes / 5) * 5;
                status += `${baseTime - 5} - ${baseTime + 5} minutes`;
            }

            // Update wait time text for all CTAs
            document.querySelectorAll('[data-chat-wait-time]').forEach((el) => {
                el.innerText = status;
            });

            showOtherCTAs();
            otherCtas.forEach((cta) => {
                if (cta.tagName === 'A') {
                    const href = cta.getAttribute('data-href');
                    if (href) {
                        cta.setAttribute('href', href);
                    }
                }
                cta.querySelectorAll('.listening-cta__chevron').forEach(
                    (chevron) => {
                        chevron.style.display = 'inline-block';
                    },
                );

                // Add hrefs to all links, populating from data-href attributes
                cta.querySelectorAll('a').forEach((anchor) => {
                    const href = anchor.getAttribute('data-href');
                    if (href) {
                        anchor.setAttribute('href', href);
                    }
                });
            });
        } else {
            showChatUnavailableCtas();
            hideCustomChatElements();
            if (chatCTA) {
                hideListeningCTA(chatCTA);
            }
            promoteCTA();
        }
    };

    if (chatPlatform === 'ifs') {
        fetch(apiUrl.href)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                return response.json();
            })
            .then(statusCallback);
    } else if (chatPlatform === 'amazon_connect') {
        const metricsApiClient = new MetricsAPIClient(
            webchatQueueConfig.ac_metrics_id,
            webchatQueueConfig.ac_metrics_endpoint,
            webchatQueueConfig.ac_metrics_api_key,
        );

        metricsApiClient.getQueueStatus().then((queueState) => {
            statusCallback({
                active: queueState.is_open,
                wait_time: queueState.avg_queue_answer_time,
            });
        });
    }
});
