import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type WebchatState = {
    screen: 'landing' | 'waiting' | 'chat' | 'feedback';
    lexWebUiStatus: 'unloaded' | 'loading' | 'loaded' | 'error';
    volunteerJoined: boolean;
    isConfirmExitVisible: boolean;
    sessionEnded: boolean;
    failedToReconnect: boolean;
    failedToEstablish: boolean;
    amazonConnectContactId?: string;
    amazonConnectParticipantId?: string;
    amazonConnectParticipantToken?: string;
    isPushNotificationEnabled: boolean;
    isAudioNotificationEnabled: boolean;
};

const initialState: WebchatState = {
    screen: 'landing',
    lexWebUiStatus: 'unloaded',
    volunteerJoined: false,
    isConfirmExitVisible: false,
    sessionEnded: false,
    failedToReconnect: false,
    failedToEstablish: false,
    isPushNotificationEnabled: false,
    isAudioNotificationEnabled: false,
};

type AmazonConnectSession = {
    contactId: string;
    participantId: string;
    participantToken: string;
};

export const webchatSlice = createSlice({
    name: 'webchat',
    initialState,
    reducers: {
        setScreen: (state, action: PayloadAction<WebchatState['screen']>) => {
            state.screen = action.payload;
        },
        setLexWebUiStatus: (
            state,
            action: PayloadAction<WebchatState['lexWebUiStatus']>,
        ) => {
            state.lexWebUiStatus = action.payload;
        },
        setVolunteerJoined: (state, action: PayloadAction<boolean>) => {
            state.volunteerJoined = action.payload;
        },
        setIsConfirmExitVisible: (state, action: PayloadAction<boolean>) => {
            state.isConfirmExitVisible = action.payload;
        },
        setAmazonConnectSession: (
            state,
            action: PayloadAction<AmazonConnectSession>,
        ) => {
            state.amazonConnectContactId = action.payload.contactId;
            state.amazonConnectParticipantId = action.payload.participantId;
            state.amazonConnectParticipantToken =
                action.payload.participantToken;
        },
        setIsPushNotificationEnabled: (
            state,
            action: PayloadAction<boolean>,
        ) => {
            state.isPushNotificationEnabled = action.payload;
        },
        setIsAudioNotificationEnabled: (
            state,
            action: PayloadAction<boolean>,
        ) => {
            state.isAudioNotificationEnabled = action.payload;
        },
        endSession: (state) => {
            state.sessionEnded = true;
        },
        setFailedToReconnect: (state, action: PayloadAction<boolean>) => {
            state.failedToReconnect = action.payload;
        },
        setFailedToEstablish: (state, action: PayloadAction<boolean>) => {
            state.failedToEstablish = action.payload;
        },
    },
});

export const {
    setScreen,
    setLexWebUiStatus,
    setVolunteerJoined,
    setIsConfirmExitVisible,
    setAmazonConnectSession,
    setIsPushNotificationEnabled,
    setIsAudioNotificationEnabled,
    endSession,
    setFailedToReconnect,
    setFailedToEstablish,
} = webchatSlice.actions;

export default webchatSlice.reducer;
