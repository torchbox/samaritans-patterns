import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWithTimeout } from 'utils/fetchWithTimeout';
import type { RootState } from '../store';

export type NetworkState = {
    status: 'online' | 'offline' | 'disconnected';
    lastPing: number | null;
    failedPings: number;
};

const initialState: NetworkState = {
    status: 'online',
    lastPing: null,
    failedPings: 0,
};

export const ping = createAsyncThunk<
    void,
    void,
    {
        state: RootState;
    }
>('network/ping', async () => {
    const { origin, pathname } = window.location;

    const pingEndpoint = `${origin}${pathname}ping/`;
    const resp = await fetchWithTimeout(pingEndpoint, 5_000);

    if (!resp.ok) {
        throw new Error('Ping failed');
    }
});

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ping.fulfilled, (state) => {
            if (state.status !== 'disconnected') {
                state.lastPing = Date.now();
                state.failedPings = 0;
                state.status = 'online';
            }
        });
        builder.addCase(ping.rejected, (state) => {
            state.failedPings += 1;

            // If we have failed 3 pings in a row, consider the network to be
            // offline
            if (state.status === 'online' && state.failedPings >= 3) {
                state.status = 'offline';
            }

            // If we haven't received a ping in the last 2 minutes, consider
            // the network to be disconnected
            // Once the network is disconnected, it will remain disconnected
            if (
                state.lastPing !== null &&
                Date.now() - state.lastPing > 120_000
            ) {
                state.status = 'disconnected';
            }
        });
    },
});

export default networkSlice.reducer;
