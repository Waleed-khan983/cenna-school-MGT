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
    },

    reducers: {},

    extraReducers: (builder) => {
      builder

        .addCase(
          fetchStudentDashboard.pending,
          (state) => {
            state.loading = true;
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
          (state) => {
            state.loading = false;
          }
        );
    },
  });

export default
  studentDashboardSlice.reducer;