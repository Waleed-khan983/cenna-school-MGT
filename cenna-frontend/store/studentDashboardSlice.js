import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getStudentDashboardApi,
} from "@/services/studentDashboardService";

export const fetchStudentDashboard =
  createAsyncThunk(
    "student/dashboard",
    async (_, thunkAPI) => {
      try {
        return await getStudentDashboardApi();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

const studentDashboardSlice =
  createSlice({
    name: "studentDashboard",

    initialState: {
      stats: {},
      loading: false,
      error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchStudentDashboard.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchStudentDashboard.fulfilled,
          (state, action) => {
            state.loading = false;
            state.stats =
              action.payload.stats;
          }
        )

        .addCase(
          fetchStudentDashboard.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        );
    },
  });

export default
  studentDashboardSlice.reducer;