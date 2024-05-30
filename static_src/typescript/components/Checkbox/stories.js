import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import CheckBox from '.';

export default {
    component: CheckBox,
    title: 'CheckBox',
    decorators: [withKnobs],
};

const defaultProps = {
    onChange: action('Clicked'),
};

export const unchecked = () => <CheckBox {...defaultProps} checked={false} />;

export const checked = () => <CheckBox {...defaultProps} checked />;

const InteractiveCheckbox = () => {
    const [checked, setChecked] = useState(false);
    return <CheckBox onChange={() => setChecked(!checked)} checked={checked} />;
};

export const interactive = () => <InteractiveCheckbox />;

export const withLabel = () => (
    <CheckBox {...defaultProps} checked={false}>
        This is the default label
    </CheckBox>
);

const myLabel = ({ children }) => {
    const style = {
        border: '2px black solid',
        borderRadius: '30px',
        padding: '1rem',
        position: 'absolute',
    };
    return <label style={style}>{children}</label>;
};

export const CustomLabel = () => (
    <CheckBox {...defaultProps} checked={false} labelComponent={myLabel}>
        This is my label text
    </CheckBox>
);
