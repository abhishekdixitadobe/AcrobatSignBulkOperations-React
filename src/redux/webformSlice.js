import { createSlice } from '@reduxjs/toolkit';

const webformSlice = createSlice({
  name: 'webformList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setWidgets: (state, action) => {
      return action.payload; // Replace the state with the incoming payload
    },
  },
});

export const { setWidgets } = webformSlice.actions;
export default webformSlice.reducer;
