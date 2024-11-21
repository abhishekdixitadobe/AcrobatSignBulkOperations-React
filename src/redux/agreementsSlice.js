import { createSlice } from '@reduxjs/toolkit';

const agreementsSlice = createSlice({
  name: 'agreementsList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setAgreements: (state, action) => {
      return action.payload; // Replace the state with the incoming payload
    },
  },
});

export const { setAgreements } = agreementsSlice.actions;
export default agreementsSlice.reducer;
