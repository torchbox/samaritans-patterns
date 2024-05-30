import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TertiaryButton from 'components/TertiaryButton';
import Tiler, { Tile } from 'components/Tiler';
import FeelingSlider from 'components/FeelingSlider';

import TileHeader, {
    TileHeading,
    TileCopy,
    TileProgressBar,
    TileContent,
} from 'components/Tiler/styled';
import StyledFeedbackRoom from './styled';
import type { AppDispatch, RootState } from '../../store';
import {
    setPostFeedback,
    setPreFeedback,
    submitFeedback,
} from '../../slices/feedbackSlice';
import { endSession } from '../../slices/webchatSlice';

const FeedbackRoom = () => {
    const dispatch = useDispatch<AppDispatch>();
    const amazonConnectContactId = useSelector(
        (state: RootState) => state.webchat.amazonConnectContactId,
    );
    const { preFeedbackScore, postFeedbackScore } = useSelector(
        (state: RootState) => state.feedback,
    );

    const onFeedback = async () => {
        // It technically shouldn't be possible for these to be null
        // as the user should have to select a value before continuing
        if (
            preFeedbackScore !== null &&
            postFeedbackScore !== null &&
            amazonConnectContactId
        ) {
            // NB: Submitting feedback is an async action. The following code
            // will trigger the feedback submission and end the session
            // immediately.
            //
            // However, this is not an issue because then end session handling
            // waits for the feedback submission to complete before ending the
            // session (e.g. before redirecting them to the feedback
            // form/Samaritans.org).
            //
            // End session handling is found in App.tsx.
            dispatch(
                submitFeedback({
                    contactId: amazonConnectContactId,
                    distressScoreBefore: preFeedbackScore,
                    distressScoreAfter: postFeedbackScore,
                }),
            );
        }

        dispatch(endSession());
    };

    return (
        <StyledFeedbackRoom>
            <h1 hidden>Feedback room</h1>
            <Tiler>
                <Tile
                    name="thank-you"
                    nextButtonText="Yes, continue"
                    content={
                        <>
                            <TileHeader>
                                <h3>Your conversation has ended</h3>
                            </TileHeader>
                            <TileContent>
                                <TileHeading bold>
                                    Thank you for being a part of our pilot
                                </TileHeading>
                                <p>We hope it helped you in some way</p>
                                <TileCopy>
                                    Would you be able to give us some feedback
                                    to help us improve our web chat service?
                                </TileCopy>
                                <small>
                                    We&apos;ll use your feedback to help us
                                    learn how we can make the service better, as
                                    we&apos;re aiming to offer it to more people
                                    in the future.
                                </small>
                            </TileContent>
                        </>
                    }
                    otherButtons={
                        <TertiaryButton
                            action={() => dispatch(endSession())}
                            dataIdentifier="skipFeedback"
                        >
                            No, go to
                            <br />
                            Samaritans.org
                        </TertiaryButton>
                    }
                />
                <Tile
                    name="pre-feedback"
                    nextButtonText="Continue"
                    content={
                        <>
                            <TileHeader>
                                <p>1 of 3</p>
                                <TileProgressBar>
                                    <div style={{ width: '33%' }} />
                                </TileProgressBar>
                            </TileHeader>
                            <TileContent>
                                <TileHeading>
                                    How were you feeling <i>before</i> talking
                                    to a Samaritan?
                                </TileHeading>
                                <FeelingSlider
                                    updateFeeling={(value) =>
                                        dispatch(setPreFeedback(value))
                                    }
                                    ariaLabel="How were you feeling before talking to a Samaritan?"
                                />
                            </TileContent>
                        </>
                    }
                />
                <Tile
                    name="post-feedback"
                    goBack
                    onNext={onFeedback}
                    nextButtonText="Continue to survey"
                    content={
                        <>
                            <TileHeader>
                                <p>2 of 3</p>
                                <TileProgressBar>
                                    <div style={{ width: '66%' }} />
                                </TileProgressBar>
                            </TileHeader>
                            <TileContent>
                                <TileHeading>
                                    How are you feeling <i>after</i> talking to
                                    a Samaritan?
                                </TileHeading>
                                <FeelingSlider
                                    updateFeeling={(value) =>
                                        dispatch(setPostFeedback(value))
                                    }
                                    ariaLabel="How were you feeling after talking to a Samaritan?"
                                />
                            </TileContent>
                        </>
                    }
                />
            </Tiler>
        </StyledFeedbackRoom>
    );
};

export default FeedbackRoom;
