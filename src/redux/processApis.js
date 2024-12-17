// Redux Toolkit imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiBodybyID } from "../utils/apiBody";

// Async action to process APIs
export const process = createAsyncThunk("apis/process", async (_, thunkAPI) => {
  console.log(thunkAPI.getState());

  const state = thunkAPI.getState();
  const apiRequests = state.processApis.requests;

  // Helper function to fetch and process response
  const fetchAndProcessResponse = async (apiRequest, thunkAPI) => {
    try {
      const bodyGeneratorFunc = apiBodybyID(apiRequest.apiEndpoint);
      const body = await bodyGeneratorFunc(apiRequest.body);

      const response = await fetch(apiRequest.apiEndpoint, {
        method: apiRequest.method,
        body: body,
        //headers: { "Content-Type": "multipart/form-data" },
      });

      const stream = createReadableStream(response.body.getReader());
      await processStream(stream, thunkAPI);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  };

  const createReadableStream = (reader) => {
    const handleRead = (reader, controller) => {
      reader.read().then(({ done, value }) => {
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
          handleRead(reader, controller);
        }
      });
    };
  
    return new ReadableStream({
      start(controller) {
        handleRead(reader, controller);
      },
    });
  };

  // Helper function to process the readable stream
  const processStream = async (stream, thunkAPI) => {
    const reader = stream.getReader();

    async function process({ done, value }) {
      if (done) return;

      const result = JSON.parse(new TextDecoder("utf-8").decode(value));
      dispatchResult(result, thunkAPI);

      // Continue reading the stream
      const nextChunk = await reader.read();
      await process(nextChunk);
    }

    const firstChunk = await reader.read();
    await process(firstChunk);
  };

  // Helper function to dispatch results to the state
  const dispatchResult = (result, thunkAPI) => {
    if (!result) return;

    if (Array.isArray(result.responseData)) {
      thunkAPI.dispatch(processApis.actions.addResults(result.responseData));
    } else {
      thunkAPI.dispatch(processApis.actions.addResult(result.responseData));
    }

    thunkAPI.dispatch(processApis.actions.addApiAudit(result.APIAudit));
    thunkAPI.dispatch(processApis.actions.setCurrentCount(result.currentCount));
    thunkAPI.dispatch(processApis.actions.setTotalCount(result.totalCount));
  };

  // Execute all API requests
  const requests = apiRequests.map((apiRequest) =>
    fetchAndProcessResponse(apiRequest, thunkAPI)
  );

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
