import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getParentDashboardApi } from "@/services/parentDashboardService";

export const fetchParentDashboard = createAsyncThunk(
  "parentDashboard/fetchParentDashboard",
  async (_, thunkAPI) => {
    try {
      return await getParentDashboardApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load performance data"
      );
    }
  }
);

const parentDashboardSlice = createSlice({
  name: "parentDashboard",

  initialState: {
    children: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchParentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload.children || [];
      })
      .addCase(fetchParentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default parentDashboardSlice.reducer;
