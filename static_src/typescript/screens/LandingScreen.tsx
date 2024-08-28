import React, { useState } from 'react';

import SafeguardingBanner from 'components/SafeguardingBanner';
import WaitTimePanel from 'components/WaitTimePanel';
import MainPanel from 'components/MainPanel';
import Room from 'components/Room';
import SidePanel from 'components/SidePanel';
import MobileMenu from 'components/MobileMenu';
import { StyledSidePanelInfo } from 'components/SidePanel/styled';
import Button from 'components/Button';
import Banner from 'components/Banner';
import Checkbox from 'components/Checkbox';

import { Label, Small } from 'components/Notifications/styled';

import { useIsMobile } from 'utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setScreen } from '../slices/webchatSlice';

import config from '../config';
import type { RootState } from '../store';

const LandingScreen = () => {
    const isMobile = useIsMobile();
    const dispatch = useDispatch();

    const [fpConsent, setFpConsent] = useState(false);
    const [joinClicked, setJoinClicked] = useState(false);

    const averageQueueAnswerTime = useSelector(
        (state: RootState) => state.queue.averageQueueAnswerTime,
    );

    const joinActionWrapper = () => {
        setJoinClicked(true);

        if (fpConsent) {
            dispatch(setScreen('waiting'));
        }
    };

    return (
        <>
            <Banner showNotifications={false} />
            {!isMobile && config.displayBanner && config.banner && (
                <SafeguardingBanner
                    title={config.banner.title}
                    text={config.banner.message}
                    link_text={config.banner.linkText}
                    link_url={config.banner.linkUrl}
                />
            )}
            <Room>
                <MainPanel>
                    <h1>Chat with us online</h1>
                    <p>
                        Sometimes typing is easier than talking. Our trained
                        volunteers will read your messages and respond in real
                        time, helping you work through what&apos;s on your mind.
                        They won&apos;t judge or tell you what to do, and you
                        don&apos;t have to be suicidal to reach out.
                    </p>

                    <h2>Enter the waiting room when you are ready</h2>

                    <p>
                        This service uses Browser Fingerprinting to help us
                        safeguard our callers and volunteers and prevent misuse.
                        It places a cookie on your device that can allow us to
                        see how your computer, smartphone or tablet has used
                        this service before.
                    </p>

                    <p>
                        You can read more about Browser Fingerprinting and how
                        we use this information in our{' '}
                        <a
                            href="https://www.samaritans.org/privacy-statement/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Statement
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://www.samaritans.org/privacy-statement/cookie-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Cookie Policy
                        </a>
                        .
                    </p>

                    <Checkbox
                        checked={fpConsent}
                        onChange={(event) => setFpConsent(event.target.checked)}
                        labelComponent={Label}
                        id="fingerprinting-consent"
                        ariaLabel="I agree to the use of Browser Fingerprinting"
                        ariaRequired
                    >
                        I agree to the use of Browser Fingerprinting
                        <span className="asterisk" aria-hidden="true">
                            *
                        </span>
                    </Checkbox>
                    <div aria-live="polite">
                        {joinClicked && !fpConsent && (
                            <Small error>
                                You must agree to the use of Browser
                                Fingerprinting to use this service.
                            </Small>
                        )}
                    </div>
                    <Small>
                        If you do not consent to Browser Fingerprinting, you can
                        still access our services for free by phone on{' '}
                        <a href="tel:116123">116 123</a> or by emailing{' '}
                        <a href="mailto:jo@samaritans.org">jo@samaritans.org</a>
                    </Small>

                    <Button action={joinActionWrapper} dataIdentifier="join">
                        <span>Enter the waiting room</span>
                    </Button>
                </MainPanel>
                <SidePanel variants={['vCenter', 'textCenter']}>
                    <MobileMenu>
                        <h3>Other ways to get in touch</h3>
                        <p>
                            Call us:{' '}
                            <a
                                aria-label="Samaritans phone number 116 123"
                                href="tel:116123"
                            >
                                116 123
                            </a>
                        </p>
                        <p>
                            Email us:{' '}
                            <a href="mailto:jo@samaritans.org">
                                jo@samaritans.org
                            </a>
                        </p>
                    </MobileMenu>
                    <WaitTimePanel
                        waitTime={averageQueueAnswerTime}
                        beforeTime="There's currently a"
                        paused
                    >
                        <StyledSidePanelInfo>
                            Estimated wait time
                        </StyledSidePanelInfo>
                    </WaitTimePanel>
                </SidePanel>
            </Room>
            {isMobile && config.displayBanner && config.banner && (
                <SafeguardingBanner
                    title={config.banner.title}
                    text={config.banner.message}
                    link_text={config.banner.linkText}
                    link_url={config.banner.linkUrl}
                />
            )}
        </>
    );
};

export default LandingScreen;
