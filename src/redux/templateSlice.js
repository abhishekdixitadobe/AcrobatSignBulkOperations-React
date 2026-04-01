import { createSlice } from '@reduxjs/toolkit';

const templateSlice = createSlice({
  name: 'templateList',
  initialState: { 
    templateAssetsResults: [], // Initialize as an empty array
    email: "", // Initialize email as an empty string
  },
  reducers: {
    setTemplates: (state, action) => {
     state.templateAssetsResults = action.payload.results; // Update agreementAssetsResults
     state.email = action.payload.email; // Update email
    },
  },
});

export const { setTemplates } = templateSlice.actions;
export default templateSlice.reducer;
