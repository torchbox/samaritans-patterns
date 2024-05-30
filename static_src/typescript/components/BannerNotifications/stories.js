import React from 'react';
import BannerNotifications from '.';
import 'react-toggle/style.css';

export default {
    component: BannerNotifications,
    title: 'Banner Notifications',
};

export const enabled = () => <BannerNotifications notifications audio />;

export const disabled = () => (
    <BannerNotifications notifications={false} audio={false} />
);
