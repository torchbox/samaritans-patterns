import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { FeedbackAPI } from 'utils/feedback';
import type { RootState } from '../store';
import config from '../config';

export type FeedbackState = {
    preFeedbackScore: number | null;
    postFeedbackScore: number | null;
    feedbackStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
};

const initialState: FeedbackState = {
    preFeedbackScore: null,
    postFeedbackScore: null,
    feedbackStatus: 'idle',
};

type SubmitFeedbackProps = {
    contactId: string;
    distressScoreBefore: number;
    distressScoreAfter: number;
};

export const submitFeedback = createAsyncThunk<
    void,
    SubmitFeedbackProps,
    { state: RootState }
>(
    'feedback/submitFeedback',
    async ({ contactId, distressScoreBefore, distressScoreAfter }) => {
        const feedbackApi = new FeedbackAPI(
            config.feedbackEndpoint,
            config.feedbackApiKey,
        );

        await feedbackApi.submitPreFeedbackScore({
            contactId,
            distressScoreBefore,
        });

        await feedbackApi.submitPostFeedbackScore({
            contactId,
            distressScoreAfter,
        });
    },
);

export const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        setPreFeedback: (state, action: PayloadAction<number>) => {
            state.preFeedbackScore = action.payload;
        },
        setPostFeedback: (state, action: PayloadAction<number>) => {
            state.postFeedbackScore = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(submitFeedback.pending, (state) => {
            state.feedbackStatus = 'pending';
        });
        builder.addCase(submitFeedback.fulfilled, (state) => {
            state.feedbackStatus = 'fulfilled';
        });
        builder.addCase(submitFeedback.rejected, (state) => {
            state.feedbackStatus = 'rejected';
        });
    },
});

export const { setPreFeedback, setPostFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;
