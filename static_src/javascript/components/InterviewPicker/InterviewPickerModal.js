import React from 'react';
import moment from 'moment-timezone';

export const InterviewPickerModal = ({
    interviewData,
    onInterviewChosen,
    hideModal,
}) => {
    const {
        datetime,
        location_name,
        location,
        interview_type,
        location_street,
        location_city,
        location_post_code,
    } = interviewData;
    return (
        <div className="interview-confirmation" aria-modal="true">
            <h3>Your interview slot</h3>
            <div className="interview-confirmation__details">
                <p>
                    You have chosen to a {interview_type} interview on{' '}
                    {moment(datetime)
                        .tz(window.timezone)
                        .format('MMMM Do')}{' '}
                    at{' '}
                    {moment(datetime)
                        .tz(window.timezone)
                        .format('H:mm')}
                </p>
                {location && (
                    <>
                        <h4>{location_name} address</h4>
                        <address>
                            {location_street} <br />
                            {location_city} <br />
                            {location_post_code} <br />
                        </address>
                    </>
                )}
                <button
                    type="button"
                    className="interview-button  "
                    onClick={() => {
                        hideModal();
                        onInterviewChosen();
                    }}
                >
                    <div
                        className="interview-button__shadow"
                        aria-hidden="true"
                    ></div>
                    <div className="interview-button__inner">
                        Book this slot
                        <svg
                            className="icon icon--icon-chevron button__icon button__icon--after"
                            aria-hidden="true"
                        >
                            <use xlinkHref="#icon-chevron"></use>
                        </svg>
                    </div>
                </button>
                <p>
                    Or{' '}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            hideModal();
                        }}
                    >
                        choose different time
                    </a>
                </p>
            </div>
        </div>
    );
};
