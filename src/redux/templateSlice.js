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
    removeTemplates: (state, action) => {
      const deletedIds = new Set(action.payload); // array of deleted template IDs
      Object.keys(state.templateAssetsResults).forEach((email) => {
        const result = state.templateAssetsResults[email];
        if (result?.libraryDocuments) {
          result.libraryDocuments = result.libraryDocuments.filter(
            (doc) => !deletedIds.has(doc.id)
          );
        }
      });
    },
  },
});

export const { setTemplates, removeTemplates } = templateSlice.actions;
export default templateSlice.reducer;
