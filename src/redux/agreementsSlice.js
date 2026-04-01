import { createSlice } from '@reduxjs/toolkit';

const agreementsSlice = createSlice({
  name: 'agreementsList',
  initialState: { 
    agreementAssetsResults: [], // Initialize as an empty array
    email: "", // Initialize email as an empty string
  },
  reducers: {
    setAgreements: (state, action) => {
      state.agreementAssetsResults = action.payload.results; // Update agreementAssetsResults
      state.email = action.payload.email; // Update email
    },
  },
});

export const { setAgreements } = agreementsSlice.actions;
export default agreementsSlice.reducer;
