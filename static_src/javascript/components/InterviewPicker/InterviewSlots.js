import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Button from './Button/Button';

/**
 * Widget to display a list of interver slots ordered by type,
 * so the user can select one for their interview.
 */
const Slots = ({ slots, isSelected, onSelect }) => {
    return slots.map((slot) => {
        const label = moment(slot.datetime)
            .tz(window.djangoTimezone)
            .format('H:mm');
        return (
            <Button
                key={`${slot.interview_type}-${slot.datetime}-${slot.location_name}`}
                onClick={() => onSelect(slot)}
                theme={isSelected(slot) ? 'slotSelected' : 'slot'}
            >
                {label}
            </Button>
        );
    });
};

Slots.propTypes = {
    slots: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedSlot: PropTypes.object,
};

const InterviewSlots = ({ title, slots, groupBy, onSelect, isSelected }) => {
    const grouped = useMemo(() => {
        return slots.reduce((acc, slot) => {
            const key = groupBy ? slot[groupBy] : '';
            if (!(key in acc)) {
                acc[key] = [];
            }
            acc[key].push(slot);
            return acc;
        }, {});
    }, [slots]);
    return (
        <fieldset className="slotpicker__slots">
            <legend className="slotpicker__legend">
                <span className="slotpicker__legend-text">
                    <span className="slotpicker__interview-type">{title}</span>
                </span>
            </legend>
            {slots.length === 0 && 'We do not have any slots for this date.'}
            {Object.keys(grouped).map((group, i) => {
                const groupData = grouped[group][i];
                return (
                    <React.Fragment key={group}>
                        {group && (
                            <h3 className="slotpicker__interview-group">
                                {group}
                                <div className="slotpicker__information">
                                    <address>
                                        {`${groupData.location_street},
                                                        ${groupData.location_city},
                                                        ${groupData.location_post_code}`}
                                    </address>
                                    {groupData.accessibility_details && (
                                        <div>
                                            {groupData.accessibility_details}
                                        </div>
                                    )}
                                </div>
                            </h3>
                        )}
                        {
                            <Slots
                                key={group}
                                slots={grouped[group].sort((a, b) =>
                                    moment(a.datetime).diff(moment(b.datetime)),
                                )}
                                isSelected={isSelected}
                                onSelect={onSelect}
                            />
                        }
                    </React.Fragment>
                );
            })}
        </fieldset>
    );
};

InterviewSlots.propTypes = {
    title: PropTypes.string.isRequired,
    slots: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedSlot: PropTypes.object,
    groupBy: PropTypes.string,
};

export default InterviewSlots;
