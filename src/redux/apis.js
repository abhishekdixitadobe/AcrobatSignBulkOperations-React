/* ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
**************************************************************************/

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    callLog:[],
    currentCall: null,
    jobStatus: 'ready',
    startTimestamp: null,
    endTimeStamp: null
};

const appSlice = createSlice({
    name: 'apilLog',
    initialState: initialState,
    reducers: {
        addCallEntry (state, action) {
            state.callLog = [ ...state.callLog, action.payload];
        },
        setCurrentCall (state, action) {
            state.currentCall = action.payload
        },
        setCurrentCallRequest (state, action) {
            state.currentCall.properties.request = action.payload;
        },
        setCurrentCallResponse (state, action) {
            state.currentCall.properties.response = action.payload;
        },
        updateCurrentCallStatus (state, action) {
            state.currentCall.status = action.payload;
        },
        addCurrentCallToLog (state, action) {
            const copy = JSON.parse(JSON.stringify(state.currentCall));
            state.callLog = [...state.callLog, copy];
        },
        setJobStatus (state, action) {
            state.jobStatus = action.payload;
        },
        setStartTimestamp (state, action) {
            state.startTimestamp = action.payload;
        },
        setEndTimestamp (state, action) {
            state.endTimeStamp = action.payload;
        }
        
    }
});

export const {
    addCallEntry,
    setCurrentCall,
    setCurrentCallRequest,
    setCurrentCallResponse,
    updateCurrentCallStatus,
    addCurrentCallToLog,
    setJobStatus,
    setStartTimestamp,
    setEndTimestamp
} = appSlice.actions;

export default appSlice.reducer;