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
                    <h2>
                        Unfortunately, the web chat service isn’t available
                        right now.
                    </h2>
                    <p>
                        At the moment, we’re not able to provide consistent
                        opening hours for the web chat service. That’s because
                        we’re running the web chat as a pilot, meaning it’s
                        still small scale and its opening times will change.
                    </p>
                    <p>
                        We know this might be frustrating. We hope you bear with
                        us. When we’re confident and ready, we’ll expand the web
                        chat opening hours and availability.
                    </p>
                    <p>
                        Until then you can call us for free, any time, day or
                        night, on{' '}
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
