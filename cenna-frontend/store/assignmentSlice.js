import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyAssignmentsApi,
  createAssignmentApi,
  deleteAssignmentApi,
  getStudentAssignmentsApi,
} from "@/services/assignmentService";

export const fetchMyAssignments = createAsyncThunk(
  "assignments/fetch",
  async (_, thunkAPI) => {
    try {
      return await getMyAssignmentsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const addAssignment = createAsyncThunk(
  "assignments/add",
  async (data, thunkAPI) => {
    try {
      return await createAssignmentApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

export const fetchStudentAssignments = createAsyncThunk(
  "assignments/fetchStudentAssignments",
  async (_, thunkAPI) => {
    try {
      return await getStudentAssignmentsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load assignments"
      );
    }
  }
);

export const removeAssignment = createAsyncThunk(
  "assignments/delete",
  async (id, thunkAPI) => {
    try {
      await deleteAssignmentApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignments",

  initialState: {
    assignments: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyAssignments.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMyAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments =
          action.payload.assignments || [];
      })

      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAssignment.fulfilled, (state, action) => {
        state.assignments.unshift(
          action.payload.assignment
        );
      })

      .addCase(fetchStudentAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments || [];
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.assignments =
          state.assignments.filter(
            (item) => item._id !== action.payload
          );
      });
  },
});

export default assignmentSlice.reducer;