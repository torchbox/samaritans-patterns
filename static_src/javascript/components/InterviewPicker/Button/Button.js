import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const THEMES = {
    primary: 'interview-button',
    slot: 'button-slot',
    slotSelected: 'button-slot button-slot--selected',
};
export const BUTTON_THEMES = Object.keys(THEMES);

const Button = ({
    children,
    href,
    theme,
    className,
    icon,
    iconBefore,
    iconAfter,
    ...rest
}) => {
    const btnClassName = `${THEMES[theme]} ${className || ''} ${
        icon ? 'button--icon-only' : ''
    }`;

    const contents = (
        <>
            {iconBefore ? (
                <Icon
                    name={iconBefore}
                    className="button__icon button__icon--before"
                />
            ) : null}
            {icon ? (
                <Icon
                    name={icon}
                    className="button__icon button__icon--center"
                />
            ) : (
                children
            )}
            {iconAfter ? (
                <Icon
                    name={iconAfter}
                    className="button__icon button__icon--after"
                />
            ) : null}
        </>
    );

    if (href) {
        return (
            <a href={href} {...rest} className={btnClassName}>
                {contents}
            </a>
        );
    }

    return (
        <button type="button" {...rest} className={btnClassName}>
            {contents}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
    theme: PropTypes.oneOf(BUTTON_THEMES),
    className: PropTypes.string,
    icon: PropTypes.string,
    iconBefore: PropTypes.string,
    iconAfter: PropTypes.string,
};

Button.defaultProps = {
    children: null,
    href: null,
    theme: 'default',
    className: null,
    icon: null,
    iconBefore: null,
    iconAfter: null,
};

export default Button;
