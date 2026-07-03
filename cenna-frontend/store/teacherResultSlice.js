import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getStudentsByClassApi,
  saveTeacherResultApi,
} from "@/services/teacherResultService";

export const fetchStudentsByClassForResult = createAsyncThunk(
  "teacherResults/fetchStudentsByClass",
  async (classId, thunkAPI) => {
    try {
      return await getStudentsByClassApi(classId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load students"
      );
    }
  }
);

export const saveTeacherResult = createAsyncThunk(
  "teacherResults/saveResult",
  async (data, thunkAPI) => {
    try {
      return await saveTeacherResultApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save result"
      );
    }
  }
);

const teacherResultSlice = createSlice({
  name: "teacherResults",

  initialState: {
    students: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearTeacherResultStudents(state) {
      state.students = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsByClassForResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsByClassForResult.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || [];
      })
      .addCase(fetchStudentsByClassForResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(saveTeacherResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveTeacherResult.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveTeacherResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeacherResultStudents } = teacherResultSlice.actions;

export default teacherResultSlice.reducer;