import { createSlice } from '@reduxjs/toolkit';

const agreementsSlice = createSlice({
  name: 'agreementsList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setAgreements: (state, action) => {
      state.agreementAssetsResults = action.payload.results;
      state.email = action.payload.email; // Update email
    },
  },
});

export const { setAgreements } = agreementsSlice.actions;
export default agreementsSlice.reducer;
