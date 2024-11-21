import { createSlice } from '@reduxjs/toolkit';

const webformAgreementsSlice = createSlice({
  name: 'webformsAgreeemntsList',
  initialState: [], // Initialize as an empty array
  reducers: {
    setWidgetsAgreements: (state, action) => {
      return action.payload; // Replace the state with the incoming payload
    },
  },
});

export const { setWidgetsAgreements } = webformAgreementsSlice.actions;
export default webformAgreementsSlice.reducer;
