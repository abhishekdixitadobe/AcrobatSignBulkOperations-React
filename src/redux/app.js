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
    context: null,
    logEntries: [],
    segments:[],
    regions:[],
    resultImages:[],
    selectedBackground: null
};

const appSlice = createSlice({
    name: 'appState',
    initialState: initialState,
    reducers: {
        setContext (state, action) {
            state.context = action.payload;
        },
        setProductImage (state, action) {
            state.productImage = action.payload;
        },
        setSegments (state,action) {
            state.segments = action.payload;
        },
        setRegions (state, action) {
            state.regions = action.payload;
        },
        addLogEntry (state, action) {
            state.logEntries = [ ...state.logEntries, action.payload];
        },
        setSelectedBackground (state, action) {
            state.selectedBackground = action.payload;
        }
    }
});

export const {
    setContext,
    setProductImage, 
    addLogEntry,
    setSegments,
    setRegions,
    setSelectedBackground
} = appSlice.actions;

export default appSlice.reducer;