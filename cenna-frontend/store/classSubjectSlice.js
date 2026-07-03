import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getClassSubjects,
  getClassSubject,
  createClassSubject,
  updateClassSubject,
  deleteClassSubject,
} from "@/services/classSubjectService";

export const fetchClassSubjects = createAsyncThunk(
  "classSubjects/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await getClassSubjects();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load assignments"
      );
    }
  }
);

export const fetchClassSubject = createAsyncThunk(
  "classSubjects/fetchOne",
  async (id, thunkAPI) => {
    try {
      return await getClassSubject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load assignment"
      );
    }
  }
);

export const addClassSubject = createAsyncThunk(
  "classSubjects/create",
  async (data, thunkAPI) => {
    try {
      return await createClassSubject(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create assignment"
      );
    }
  }
);

export const editClassSubject = createAsyncThunk(
  "classSubjects/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateClassSubject({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update assignment"
      );
    }
  }
);

export const removeClassSubject = createAsyncThunk(
  "classSubjects/delete",
  async (id, thunkAPI) => {
    try {
      await deleteClassSubject(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete assignment"
      );
    }
  }
);

const classSubjectSlice = createSlice({
  name: "classSubjects",

  initialState: {
    assignments: [],
    assignment: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchClassSubjects.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchClassSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments || [];
      })

      .addCase(fetchClassSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchClassSubject.fulfilled, (state, action) => {
        state.assignment = action.payload.assignment;
      })

      .addCase(addClassSubject.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload.assignment);
      })

      .addCase(editClassSubject.fulfilled, (state, action) => {
        const updated = action.payload.assignment;

        state.assignments = state.assignments.map((item) =>
          item._id === updated._id ? updated : item
        );
      })

      .addCase(removeClassSubject.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default classSubjectSlice.reducer;