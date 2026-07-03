import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getMyResultsApi } from "@/services/studentResultService";

export const fetchMyResults = createAsyncThunk(
  "studentResults/fetchMyResults",
  async (_, thunkAPI) => {
    try {
      return await getMyResultsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load results"
      );
    }
  }
);

const studentResultSlice = createSlice({
  name: "studentResults",

  initialState: {
    results: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results || [];
      })
      .addCase(fetchMyResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentResultSlice.reducer;