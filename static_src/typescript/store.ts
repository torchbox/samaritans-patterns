import { configureStore } from '@reduxjs/toolkit';
import webchatReducer from './slices/webchatSlice';
import queueReducer from './slices/queueSlice';
import feedbackReducer from './slices/feedbackSlice';
import networkReducer from './slices/networkSlice';

export const store = configureStore({
    reducer: {
        webchat: webchatReducer,
        queue: queueReducer,
        feedback: feedbackReducer,
        network: networkReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
