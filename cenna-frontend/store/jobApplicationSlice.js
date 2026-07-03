import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getJobApplicationsApi,
  updateJobApplicationStatusApi,
  deleteJobApplicationApi,
} from "@/services/jobApplicationService";

export const fetchJobApplications = createAsyncThunk(
  "jobApplications/fetch",
  async (_, thunkAPI) => {
    try {
      return await getJobApplicationsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load applications"
      );
    }
  }
);

export const updateJobApplicationStatus = createAsyncThunk(
  "jobApplications/status",
  async ({ id, status }, thunkAPI) => {
    try {
      return await updateJobApplicationStatusApi(id, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

export const removeJobApplication = createAsyncThunk(
  "jobApplications/delete",
  async (id, thunkAPI) => {
    try {
      await deleteJobApplicationApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete application"
      );
    }
  }
);

const jobApplicationSlice = createSlice({
  name: "jobApplications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications || [];
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJobApplicationStatus.fulfilled, (state, action) => {
        state.applications = state.applications.map((item) =>
          item._id === action.payload.application._id
            ? action.payload.application
            : item
        );
      })
      .addCase(removeJobApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default jobApplicationSlice.reducer;