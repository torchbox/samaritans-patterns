import React from 'react';
import ConnectionPanel from '../ConnectionPanel';

export default {
    component: ConnectionPanel,
    title: 'Connection Panel',
};

const defaultProps = {
    moreInfo: false,
};

export const problem = () => <ConnectionPanel {...defaultProps} />;

export const problemTimeout = () => (
    <ConnectionPanel {...defaultProps} moreInfo={true} />
);
