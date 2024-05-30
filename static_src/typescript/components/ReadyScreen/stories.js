import React from 'react';

import { action } from '@storybook/addon-actions';

import ReadyScreen from '.';

export default {
    component: ReadyScreen,
    title: 'Ready Screen',
};

const defaultProps = {
    notifications: false,
    audio: false,
    joinAction: action('joined'),
};

export const ready = () => <ReadyScreen {...defaultProps} />;
