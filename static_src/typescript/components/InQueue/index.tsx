import React from 'react';
import Push from 'push.js';
import { isIOS, isIE, isAndroid } from 'react-device-detect';

import Room from 'components/Room';
import InfoPanel, { IconInfoPanel } from 'components/InfoPanel';
import MainPanel from 'components/MainPanel';
import Tiler, { Tile } from 'components/Tiler';
import SidePanel from 'components/SidePanel';
import MobileMenu from 'components/MobileMenu';

import Notifications from 'components/Notifications';
import BannerNotifications from 'components/BannerNotifications';
import HorizontalWaitTimePanel from 'components/HorizontalWaitTimePanel';
import ClockIcon from 'components/ClockIcon';
import { useNotifications } from 'utils/hooks';
import useTitle from 'react-use/lib/useTitle';
import ScreenReaderAnnounce from 'components/ScreenReaderAnnounce';
import { Heading2 } from 'components/Text';

export type Props = {
    goToChat: () => void;
};

export const InQueue = ({ goToChat }: Props) => {
    useTitle("You're waiting for a Samaritan | Webchat");

    const browserPermission = Push.Permission.get();

    const { isPushNotificationEnabled, updateNotifications } =
        useNotifications();

    const handleNotifications = (onClick: () => void) => {
        if (isPushNotificationEnabled) {
            const onDenied = () => updateNotifications(false);
            Push.Permission.request(onClick, onDenied);
        } else {
            onClick();
        }
    };

    return (
        <Room>
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
                    <a href="mailto:jo@samaritans.org">jo@samaritans.org</a>
                </p>
                {!isIOS && !isIE && !isAndroid && (
                    <>
                        <h4>Notification settings</h4>
                        <BannerNotifications />
                    </>
                )}
            </MobileMenu>
            <MainPanel>
                <h1 hidden>Waiting Room</h1>
                <Tiler>
                    {!isIOS && !isIE && !isAndroid && (
                        <Tile
                            name="notifications"
                            onNext={handleNotifications}
                            nextButtonText={
                                browserPermission === 'denied'
                                    ? 'Continue'
                                    : 'Confirm your choice'
                            }
                            content={<Notifications />}
                        />
                    )}
                    <Tile
                        name="advice"
                        onNext={goToChat}
                        nextButtonText="Write your first message"
                        content={
                            <>
                                <Heading2 as="h1">
                                    Getting the most from your web chat
                                </Heading2>
                                <ScreenReaderAnnounce text="Getting the most from your web chat" />
                                <InfoPanel heading="This space is for you">
                                    <p>
                                        You can write however feels natural and
                                        comfortable to you. And you can take the
                                        time you need to write your messages.
                                        You don’t need to worry about spelling
                                        mistakes and we won’t judge your
                                        English.
                                    </p>
                                </InfoPanel>
                                <InfoPanel heading="Write your first message">
                                    <p>
                                        If you want, you can start writing your
                                        first message while you wait, to help
                                        you to organise your thoughts. When a
                                        volunteer joins the chat, they’ll get
                                        this message.
                                    </p>
                                </InfoPanel>
                            </>
                        }
                    />
                </Tiler>
            </MainPanel>
            <SidePanel>
                <HorizontalWaitTimePanel />

                <IconInfoPanel
                    icon={<ClockIcon paused />}
                    heading="When your wait time is up..."
                    variant="light"
                    headingAs="h3"
                >
                    <p>
                        A trained volunteer will be there to have a one-to-one
                        conversation with you. This will always be a real
                        person.
                    </p>
                </IconInfoPanel>

                <InfoPanel
                    heading="If you can't wait this long..."
                    variant="light"
                    headingAs="h3"
                >
                    <p>
                        Calling us on <a href="tel:116123">116 123</a> is
                        usually the quickest way to get through to a Samaritan.
                        It&apos;s free to call any time, day or night.
                    </p>
                </InfoPanel>
            </SidePanel>
        </Room>
    );
};

export default InQueue;
