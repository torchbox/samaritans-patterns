import React from 'react';
import PropTypes from 'prop-types';

const THEMES = {
    left: 'calendar-button calendar-button--left',
    right: 'calendar-button calendar-button--right',
};
export const BUTTON_THEMES = Object.keys(THEMES);

const CalendarButton = ({ theme, className }) => {
    const btnClassName = `${THEMES[theme]} ${className || ''}`;

    return <div className={btnClassName} />;
};

CalendarButton.propTypes = {
    theme: PropTypes.oneOf(BUTTON_THEMES),
    className: PropTypes.string,
};

CalendarButton.defaultProps = {
    theme: 'right',
    className: null,
};

export default CalendarButton;
