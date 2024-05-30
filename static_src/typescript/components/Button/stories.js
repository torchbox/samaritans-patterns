import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '.';

export default {
    component: Button,
    title: 'Button',
};

export const primary = () => (
    <Button action={action('clicked')}>Hello Button</Button>
);

export const primaryDisabled = () => (
    <Button action={action('clicked')} disabled>
        Hello Button
    </Button>
);

export const secondary = () => (
    <Button action={action('clicked')} secondary>
        Hello Button
    </Button>
);

export const secondaryDisabled = () => (
    <Button action={action('clicked')} secondary disabled>
        Hello Button
    </Button>
);
