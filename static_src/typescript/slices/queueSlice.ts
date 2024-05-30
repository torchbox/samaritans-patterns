import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MetricsAPIClient, QueueStatusResponse } from 'utils/queue-status';
import config from '../config';
import type { RootState } from '../store';

export type QueueState = {
    lastUpdated: number | null; // Epoch
    agentsStaffed: number | null;
    agentsOnline: number | null;
    agentsAvailable: number | null;
    isOpen: boolean | null;
    averageQueueAnswerTime: number | null;
    averageQueueAnswerTimePeriod: 'Hour' | 'Day' | 'Week' | null;
};

const initialState: QueueState = {
    lastUpdated: null,
    agentsStaffed: null,
    agentsOnline: null,
    agentsAvailable: null,
    isOpen: null,
    averageQueueAnswerTime: null,
    averageQueueAnswerTimePeriod: null,
};

const client = new MetricsAPIClient(
    config.metricsId,
    config.metricsEndpoint,
    config.metricsApiKey,
);

export const refreshQueueStatus = createAsyncThunk<
    QueueStatusResponse,
    void,
    { state: RootState }
>('queue/refreshQueueStatus', async () => client.getQueueStatus());

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(refreshQueueStatus.fulfilled, (state, action) => {
            state.lastUpdated = Date.now();
            state.agentsStaffed = action.payload.agents_staffed;
            state.agentsOnline = action.payload.agents_online;
            state.agentsAvailable = action.payload.agents_available;
            state.isOpen = action.payload.is_open;
            state.averageQueueAnswerTime = action.payload.avg_queue_answer_time;
            state.averageQueueAnswerTimePeriod =
                action.payload.avg_queue_answer_time_period;
        });
        builder.addCase(refreshQueueStatus.rejected, (state) => {
            if (state.lastUpdated === null) {
                state.lastUpdated = Date.now();
                state.isOpen = false;
            }
        });
    },
});

export default queueSlice.reducer;
