import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getDashboardStatsApi,
} from "@/services/dashboardService";

export const fetchDashboardStats =
  createAsyncThunk(
    "dashboard/stats",
    async (_, thunkAPI) => {
      try {
        return await getDashboardStatsApi();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    stats: {},
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDashboardStats.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action) => {
          state.loading = false;

          state.stats =
            action.payload.stats;
        }
      )

      .addCase(
        fetchDashboardStats.rejected,
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default dashboardSlice.reducer;