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
  isLandingPage: true,
  pageEndpoint: "/",
  navHistory: [],
  api: "",
};

const navStateSlice = createSlice({
  name: "navState",
  initialState: initialState,
  reducers: {
    setLandingPage(state, action) {
      state.isLandingPage = action.payload;
    },
    setPageEndPoint(state, action) {
      state.pageEndpoint = action.payload;
    },
    setNavHistory(state, action) {
      state.navHistory = action.payload;
    },
    setAPI(state, action) {
      state.api = action.payload;
    },
    reset(state) {
      state.isLandingPage = true;
      state.pageEndpoint = "/";
      state.navHistory = [];
      state.api = "";
    },
  },
});

export const { setLandingPage, setPageEndPoint, setNavHistory, setAPI, reset } =
  navStateSlice.actions;

export default navStateSlice.reducer;
