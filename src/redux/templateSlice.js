import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
  name: 'templateList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setTemplates: (state, action) => {
      return action.payload; // Replace the state with the incoming payload
    },
  },
});

export const { setTemplates } = templateSlice.actions;
export default templateSlice.reducer;
