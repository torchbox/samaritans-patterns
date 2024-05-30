import React from 'react';
import JoiningQueue from '.';

export default {
    component: JoiningQueue,
    title: 'Joining Queue',
};

const defaultProps = {
    moreInfo: false,
};

export const joining = () => <JoiningQueue {...defaultProps} />;

export const joiningTimeout = () => <JoiningQueue {...defaultProps} moreInfo />;
