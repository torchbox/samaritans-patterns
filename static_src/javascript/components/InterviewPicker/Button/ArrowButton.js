import React from 'react';

import Button from './Button';
import Icon from '../Icon/Icon';

const ArrowButton = ({ children, ...props }) => {
    return (
        <Button theme="primary" {...props}>
            <div className="interview-button__shadow"></div>
            <div className="interview-button__inner">
                {children}
                <Icon
                    name={'icon-chevron'}
                    className="button__icon button__icon--after"
                />
            </div>
        </Button>
    );
};

export default ArrowButton;
