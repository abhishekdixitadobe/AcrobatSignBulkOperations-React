import { createSlice } from '@reduxjs/toolkit';

const workflowSlice = createSlice({
  name: 'workflowList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setWorkflows: (state, action) => {
      return action.payload; // Replace the state with the incoming payload
    },
  },
});

export const { setWorkflows } = workflowSlice.actions;
export default workflowSlice.reducer;
