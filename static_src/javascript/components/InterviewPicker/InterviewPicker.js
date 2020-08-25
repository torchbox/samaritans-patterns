import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import { ModalProvider, useModal } from 'react-modal-hook';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import DatePicker from './DatePicker/DatePicker';

import { InterviewPickerModal } from './InterviewPickerModal';

import SlotPicker from './SlotPicker/SlotPicker';

import { isSameDay } from './dates.utils';

// Maps Salesforce interview definitions to local values
// name: equal to the object key - salesforce reference for interview type
// key: local reference for interview type
// display:
// shortDisplay:
export const typesOfInterview = {
    'Face-To-Face Interview': {
        name: 'Face-To-Face Interview',
        display: 'Face To Face Interview',
        shortDisplay: 'Face to Face',
        key: 'face-to-face',
    },
    'Telephone Interview': {
        name: 'Telephone Interview',
        display: 'Telephone Interview',
        shortDisplay: 'Telephone',
        key: 'telephone',
    },
    'Video Interview': {
        name: 'Video Interview',
        display: 'Video Interview',
        shortDisplay: 'Video',
        key: 'video',
    },
};

/**
 * Two-part widget to pick an interview slot, first by selecting
 * a date using the date picker, then by showing availabile slots
 * by type / location + time for the selected date.
 **/
const InterviewPicker = ({ interviews, onSubmit, filterTitle }) => {
    const [selectedDate, setDate] = useState(null);

    const [filters, setFilters] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, hideModal] = useModal(
        () => (
            <ReactModal
                isOpen
                onRequestClose={() => {
                    hideModal();
                    setSelectedSlot(null);
                }}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    content: {
                        width: '80%',
                        margin: '0 auto',
                        border: 'none',
                        borderRadius: 0,
                        padding: 0,
                        maxWidth: '500px',
                        position: 'relative',
                        height: 'max-content',
                        top: 'auto',
                        left: 'auto',
                        right: 'auto',
                        bottom: 'auto',
                    },
                }}
            >
                <InterviewPickerModal
                    interviewData={selectedSlot}
                    hideModal={() => {
                        hideModal();
                        setSelectedSlot(null);
                    }}
                    onInterviewChosen={onInterviewChosen}
                />
            </ReactModal>
        ),
        [selectedSlot, setSelectedSlot],
    );
    const slotsRef = useRef(null);
    const showAllFilters = filters.length === 0;

    useEffect(() => {
        if (slotsRef.current && selectedDate) {
            slotsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [slotsRef.current, selectedDate]);

    useEffect(() => {
        setSelectedSlot(null);
        ReactModal.setAppElement('body');
    }, [selectedDate]);

    const asDate = (datetime) => {
        return moment(moment(datetime).format('YYYY-MM-DD'));
    };

    const interviewTypeActive = (interviewType) => {
        return !!filters.includes(typesOfInterview[interviewType].key);
    };

    const visibleInterviews = () => {
        if (!selectedDate) {
            return [];
        }
        const visible = interviews.filter((interview) => {
            if (!isSameDay(moment(selectedDate), asDate(interview.datetime))) {
                return false;
            }
            if (showAllFilters) {
                return true;
            }
            // Do interviews exist for type
            return interviewTypeActive(interview.interview_type);
        });
        return visible;
    };

    const avaliableDates = [
        ...new Set(
            interviews
                .filter(
                    (interview) =>
                        showAllFilters ||
                        interviewTypeActive(interview.interview_type),
                )
                .map((interview) => asDate(interview.datetime)),
        ),
    ].sort();

    const onInterviewChosen = () => {
        onSubmit(selectedSlot);
    };

    const handleChange = (e) => {
        if (e.target.checked) {
            setFilters([...filters, e.target.name]);
        } else {
            setFilters([...filters.filter((name) => name !== e.target.name)]);
        }
    };

    return (
        <div className="interview-picker">
            <div className="filter-container">
                <h3>{filterTitle}</h3>
                <div
                    className="form-item-wrapper form-item-wrapper--group interview-filter"
                    id="donate__contact-prefs"
                >
                    {Object.values(typesOfInterview).map((interviewType) => [
                        <div
                            className="form-item form-item--boolean_field form-item--checkbox_input"
                            key={interviewType.key}
                        >
                            <div className="form-item__wrapper">
                                <input
                                    type="checkbox"
                                    name={interviewType.key}
                                    id={`id_${interviewType.key}`}
                                    onChange={handleChange}
                                    checked={interviewTypeActive(
                                        interviewType.name,
                                    )}
                                />

                                <label
                                    htmlFor={`id_${interviewType.key}`}
                                    className="form-item__label form-item__label--checkbox_input"
                                >
                                    {interviewType.shortDisplay}
                                </label>
                            </div>
                        </div>,
                    ])}
                </div>
            </div>
            <div
                className={`availability-picker ${
                    selectedDate ? 'availability-picker--selected-date' : ''
                }`}
            >
                <div className="availability-picker__date">
                    <DatePicker
                        availableDays={avaliableDates}
                        date={selectedDate}
                        onDateChange={setDate}
                    />
                </div>

                <div
                    className="availability-picker__line"
                    aria-hidden="true"
                ></div>

                <div className="availability-picker__slot" ref={slotsRef}>
                    <SlotPicker
                        filters={filters}
                        date={selectedDate}
                        interviews={visibleInterviews()}
                        onSelect={(slot) => {
                            setSelectedSlot(slot);
                            showModal();
                        }}
                        selectedSlot={selectedSlot}
                    />
                </div>
                <div className="u-hide u-block@tablet-landscape" />
            </div>
        </div>
    );
};

InterviewPicker.propTypes = {
    interviews: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

function getInterviews() {
    return JSON.parse(document.querySelector('#interview_slots').textContent);
}

export const initInterviewPicker = () => {
    const mount = document.querySelector(
        '[data-mount-interview-picker="default"]',
    );
    if (mount) {
        const onSubmit = (selectedSlot) => {
            const slotDatetime = new Date(selectedSlot.datetime);
            locationField.value = selectedSlot.location_name;
            (datetimeField.value = moment(slotDatetime)
                .tz(window.djangoTimezone)
                .format('YYYY-MM-DD HH:mm:ss')),
                (interviewTypeField.value = selectedSlot.interview_type);
            form.submit();
        };

        const interviews = getInterviews();

        // Get form fields that contain the selected slot data.
        const wrapperElement = document.querySelector(
            '.js-interview-picker-wrapper',
        );
        const form = wrapperElement.getElementsByTagName('form')[0];
        const locationField = wrapperElement.querySelector(
            '#id_interview_location',
        );
        const datetimeField = wrapperElement.querySelector(
            '#id_interview_datetime',
        );
        const interviewTypeField = wrapperElement.querySelector(
            '#id_interview_type',
        );
        const filterTitle = document.querySelector(
            '[data-interview-picker-filter-title]',
        ).dataset.interviewPickerFilterTitle;

        ReactDOM.render(
            <ModalProvider>
                <InterviewPicker
                    interviews={interviews}
                    filterTitle={filterTitle}
                    onSubmit={onSubmit}
                />
            </ModalProvider>,
            mount,
        );
    }
};

export default InterviewPicker;
