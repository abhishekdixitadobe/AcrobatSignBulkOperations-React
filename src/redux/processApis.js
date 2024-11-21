// Redux Toolkit imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiBodybyID } from "../utils/apiBody";

// Async action to process APIs
export const process = createAsyncThunk("apis/process", async (_, thunkAPI) => {
  console.log(thunkAPI.getState());
  const apiRequests = thunkAPI.getState().processApis.requests;

  const requests = apiRequests.map(async (apiRequest) => {
    const bodygenfunc = apiBodybyID(apiRequest.apiEndpoint);
    const body = await bodygenfunc(apiRequest.body);
    return fetch(apiRequest.apiEndpoint, {
      method: apiRequest.method,
      body: body,
      //headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }
            push();
          },
        });
      })
      .then((stream) => {
        // Handle the stream here
        const reader = stream.getReader();
        return reader.read().then(function process({ done, value }) {
          if (done) {
            return;
          }
          // Convert the chunk into a string and parse it as JSON
          const result = JSON.parse(new TextDecoder("utf-8").decode(value));
          // Dispatch the action to add the result to the state
          if (result) {
            if (Array.isArray(result.responseData)) {
              thunkAPI.dispatch(
                processApis.actions.addResults(result.responseData)
              );
            } else {
              thunkAPI.dispatch(
                processApis.actions.addResult(result.responseData)
              );
            }
            thunkAPI.dispatch(processApis.actions.addApiAudit(result.APIAudit));
            thunkAPI.dispatch(
              processApis.actions.setCurrentCount(result.currentCount)
            );
            thunkAPI.dispatch(
              processApis.actions.setTotalCount(result.totalCount)
            );
          }
          return reader.read().then(process);
        });
      })
      .catch((error) => thunkAPI.rejectWithValue({ error: error.message }));
  });

  const results = await Promise.all(requests);
  return results;
});

// Slice
const processApis = createSlice({
  name: "processApis",
  initialState: {
    requests: [],
    results: [],
    apiAudit: [],
    currentCount: 0,
    totalCount: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    addResult: (state, action) => {
      if (action.payload !== null && action.payload !== undefined)
        state.results.push(action.payload);
    },
    addResults: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.results.push(...action.payload);
      }
    },
    addApiAudit: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        action.payload.forEach((audit) => state.apiAudit.push(audit));
      }
    },
    setCurrentCount: (state, action) => {
      state.currentCount = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    resetProcessApis: (state) => {
      state.requests = [];
      state.results = [];
      state.apiAudit = [];
      state.currentCount = 0;
      state.totalCount = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(process.pending, (state) => {
        state.status = "pending";
      })
      .addCase(process.fulfilled, (state, action) => {
        state.status = "completed";
      })
      .addCase(process.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { setRequests, resetProcessApis, addResults } = processApis.actions;

export default processApis.reducer;
