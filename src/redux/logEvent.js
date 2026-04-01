import { createSlice } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  logEvents: [{ message: "Welcome to the log" }],
  error: null,
};

// Define the slice
const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    logEventReceived: (state, action) => {
      if (action.payload.message) {
        state.logEvents.push(action.payload.message);
      }
    },
    errorOccurred: (state, action) => {
      state.status = "error";
      state.error = action.payload;
    },
    resetLogEvents: (state) => {
      state.logEvents = [];
    },
  },
});

// Export the action creators
export const { logEventReceived, errorOccurred, resetLogEvents } =
  logSlice.actions;

// Export the reducer
export default logSlice.reducer;
