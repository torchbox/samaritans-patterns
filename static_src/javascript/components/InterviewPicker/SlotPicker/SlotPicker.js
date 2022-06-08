import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { typesOfInterview } from '../InterviewPicker';
import InterviewSlots from '../InterviewSlots';

/**
 * Widget to display a list of interview slots ordered by type,
 * so the user can select one for their interview.
 */
const SlotPicker = ({
    date,
    interviews,
    selectedSlot,
    onSelect,
    children,
    filters,
    visibleInterviewTypes,
}) => {
    if (!date) {
        return <div className="slotpicker slotpicker__empty" />;
    }

    const groupedByType = interviews.reduce((grouped, interview) => {
        grouped[interview.interview_type] = [
            ...(grouped[interview.interview_type] || []),
            interview,
        ];
        return grouped;
    }, {});

    const showAllFilters = filters.length === 0;

    return (
        <div className="slotpicker">
            <div className="slotpicker__date">
                {date.format('Do MMMM')} interview slots
            </div>
            {Object.values(typesOfInterview)
                .filter(({ name }) => visibleInterviewTypes.has(name))
                .map((interviewType) => {
                    if (
                        !showAllFilters &&
                        !filters.includes(interviewType.key)
                    ) {
                        return <Fragment key={interviewType.key}></Fragment>;
                    }
                    const interviews = groupedByType[interviewType.name] || [];
                    switch (interviewType.key) {
                        case typesOfInterview['Face-To-Face Interview'].key:
                            return (
                                <InterviewSlots
                                    key={interviewType.key}
                                    slots={interviews}
                                    groupBy="location_name"
                                    title={interviewType.display}
                                    onSelect={(slot) =>
                                        onSelect({
                                            ...slot,
                                            location: slot.location_name,
                                        })
                                    }
                                    selectedSlot={selectedSlot}
                                    isSelected={(slot) =>
                                        selectedSlot &&
                                        slot.interview_type ===
                                            selectedSlot.interview_type &&
                                        slot.location_name ===
                                            selectedSlot.location &&
                                        slot.datetime === selectedSlot.datetime
                                    }
                                />
                            );
                        default:
                            return (
                                <InterviewSlots
                                    key={interviewType.key}
                                    slots={interviews}
                                    title={interviewType.display}
                                    onSelect={(slot) =>
                                        onSelect({
                                            ...slot,
                                            location: null,
                                        })
                                    }
                                    selectedSlot={selectedSlot}
                                    isSelected={(slot) =>
                                        selectedSlot &&
                                        slot.interview_type ===
                                            selectedSlot.interview_type &&
                                        selectedSlot.location === null &&
                                        slot.datetime === selectedSlot.datetime
                                    }
                                />
                            );
                    }
                })}
            {children}
        </div>
    );
};

SlotPicker.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selectedSlot: PropTypes.object,
    interviews: PropTypes.array.isRequired,
    children: PropTypes.node,
};

SlotPicker.defaultProps = {
    children: null,
};

export default SlotPicker;
