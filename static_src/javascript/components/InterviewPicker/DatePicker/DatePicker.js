import React from 'react';
import PropTypes from 'prop-types';

import DayPickerSingleDateController from 'react-dates/lib/components/DayPickerSingleDateController';

import { isSameDay } from '../dates.utils';
import { useBreakpoints, useWindowDimensions } from '../hooks.utils';
import CalendarButton from '../CalendarButton/CalendarButton';

const mobileSize = (width) => Math.floor((0.86 * width) / 7);
const midSizeMobile = 60;
const largeSizeMobile = 80;
const daySizeDesktop = 60;

const defaultMonthPadding = 13;

const DatePicker = ({ date, onDateChange, availableDays, calendarInfo }) => {
    const breakpoints = useBreakpoints();
    const { width } = useWindowDimensions();

    let daySize = daySizeDesktop;
    let monthPadding = defaultMonthPadding;

    const currentBreakpoint = breakpoints[breakpoints.length - 1];
    if (
        ['med-tablet-portrait', 'tablet-portrait'].includes(currentBreakpoint)
    ) {
        daySize = largeSizeMobile;
        monthPadding = defaultMonthPadding;
    } else if (currentBreakpoint === 'mob-landscape') {
        daySize = midSizeMobile;
        monthPadding = defaultMonthPadding;
    } else if (
        ['mob-landscape', 'mob-portrait', 'mob-portrait-med'].includes(
            currentBreakpoint,
        )
    ) {
        daySize = mobileSize(width);
        monthPadding = 0;
    }

    const initialMonth = () => {
        return availableDays[0];
    };

    return (
        <DayPickerSingleDateController
            horizontalMonthPadding={monthPadding}
            focused={true}
            initialVisibleMonth={initialMonth}
            navPrev={<CalendarButton theme="left" />}
            navNext={<CalendarButton theme="right" />}
            date={date}
            onDateChange={onDateChange}
            numberOfMonths={1}
            noBorder
            hideKeyboardShortcutsPanel
            firstDayOfWeek={1}
            isDayBlocked={(day1) => {
                const slotsAvailable = availableDays.some((day2) =>
                    isSameDay(day1, day2),
                );
                if (!slotsAvailable && date && isSameDay(date, day1)) {
                    // Do not mark a day as blocked if it is already selected and
                    // filters that hide only remaining slots have been applied.
                    return false;
                }
                return !slotsAvailable;
            }}
            transitionDuration={0}
            daySize={daySize}
            renderDayContents={(day) => (
                <span className="CalendarDay__inner">{day.format('D')}</span>
            )}
            renderCalendarInfo={() => calendarInfo}
        />
    );
};

DatePicker.propTypes = {
    availableDays: PropTypes.array,
    onDateChange: PropTypes.func.isRequired,
    date: PropTypes.object,
    calendarInfo: PropTypes.node,
};

DatePicker.defaultProps = {
    availableDays: [],
    date: null,
    calendarInfo: null,
};

export default DatePicker;
