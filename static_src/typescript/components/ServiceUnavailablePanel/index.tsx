import React from 'react';

import LinkButton from 'components/LinkButton';

import { useIsMobile } from 'utils/hooks';
import SafeguardingBanner from 'components/SafeguardingBanner';
import config from '../../config';

import {
    StyledServiceUnavailablePanel,
    FullPageCoverPanel,
    StyledBannerWrapper,
} from './styled';

export const ServiceUnavailablePanel = () => {
    const isMobile = useIsMobile();

    return (
        <>
            {!isMobile && config.displayBanner && config.banner && (
                <StyledBannerWrapper>
                    <SafeguardingBanner
                        title={config.banner.title}
                        text={config.banner.message}
                        link_text={config.banner.linkText}
                        link_url={config.banner.linkUrl}
                    />
                </StyledBannerWrapper>
            )}
            <FullPageCoverPanel>
                <StyledServiceUnavailablePanel>
                    <h1 hidden>Service unavailable</h1>
                    <h2>Web Chat Service Unavailable</h2>
                    <p>
                        We’re sorry, our web chat service isn’t available right
                        now.
                    </p>
                    <p>
                        As we’re currently running the web chat as a pilot, we
                        can’t provide consistent opening hours yet. This means
                        availability may change.
                    </p>
                    <p>
                        {' '}
                        We understand this might be frustrating, and we
                        appreciate your patience. Once we’re ready, we’ll expand
                        the web chat’s hours and availability.
                    </p>
                    <p>
                        In the meantime, you can call us for free, anytime, day
                        or night, on{' '}
                        <a
                            aria-label="Samaritans phone number 116 123"
                            href="tel:116123"
                        >
                            116 123
                        </a>
                    </p>
                    <LinkButton href="https://www.samaritans.org/how-we-can-help/contact-samaritan/">
                        Find another service
                    </LinkButton>
                </StyledServiceUnavailablePanel>
                {isMobile && config.displayBanner && config.banner && (
                    <StyledBannerWrapper>
                        <SafeguardingBanner
                            title={config.banner.title}
                            text={config.banner.message}
                            link_text={config.banner.linkText}
                            link_url={config.banner.linkUrl}
                        />
                    </StyledBannerWrapper>
                )}
            </FullPageCoverPanel>
        </>
    );
};

export default ServiceUnavailablePanel;
