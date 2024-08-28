import React from 'react';
import { isIOS, isIE, isAndroid } from 'react-device-detect';

import BannerDropdown from 'components/BannerDropdown';
import LinkButton from 'components/LinkButton';
import BannerNotifications from 'components/BannerNotifications';
import Version from 'components/Version';
import { useWindowSize } from 'utils/hooks';
import { ReactComponent as BellIcon } from 'assets/svgs/bell.svg';
import { useDispatch, useSelector } from 'react-redux';
import StyledBanner, { BannerLabel, BannerCopy, Column } from './styled';
import { RootState } from '../../store';
import {
    setIsAudioNotificationEnabled,
    setIsPushNotificationEnabled,
} from '../../slices/webchatSlice';

type Props = {
    showNotifications: boolean;
};

const Banner = ({ showNotifications }: Props) => {
    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth > 1023;

    return (
        <StyledBanner>
            <Column>
                <BannerLabel>Pilot</BannerLabel>
                <BannerCopy>
                    This is a new service. Please call{' '}
                    <a
                        aria-label="Samaritans phone number on 116 123"
                        href="tel:116123"
                    >
                        116 123
                    </a>{' '}
                    for urgent support.
                </BannerCopy>
            </Column>
            {isDesktop && (
                <Column right>
                    {showNotifications && !isIOS && !isIE && !isAndroid && (
                        <BannerDropdown
                            title={
                                <>
                                    <BellIcon aria-hidden="true" />
                                    Notification settings
                                </>
                            }
                        >
                            <BannerNotifications />
                        </BannerDropdown>
                    )}

                    <BannerDropdown title="Other ways to talk">
                        <p>
                            Whatever you're going through, call us free any
                            time, from any phone&hellip;
                        </p>
                        <div>Call us now 116 123</div>
                        <LinkButton
                            aria-label="A link to more ways of contacting a Samaritan"
                            href="https://www.samaritans.org/how-we-can-help/contact-samaritan/"
                        >
                            Find out more
                        </LinkButton>
                        <Version isHidden />
                    </BannerDropdown>
                </Column>
            )}
        </StyledBanner>
    );
};

export default Banner;
