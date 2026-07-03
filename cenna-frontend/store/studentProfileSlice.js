import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getStudentProfileApi,
  updateStudentAvatarApi,
} from "@/services/studentProfileService";

export const fetchStudentProfile = createAsyncThunk(
  "studentProfile/fetchStudentProfile",
  async (_, thunkAPI) => {
    try {
      return await getStudentProfileApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load student profile"
      );
    }
  }
);

export const updateStudentAvatar = createAsyncThunk(
  "studentProfile/updateStudentAvatar",
  async (formData, thunkAPI) => {
    try {
      return await updateStudentAvatarApi(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile image"
      );
    }
  }
);

const studentProfileSlice = createSlice({
  name: "studentProfile",

  initialState: {
    student: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStudentAvatar.fulfilled, (state, action) => {
        state.student = action.payload.student;
      });
  },
});

export default studentProfileSlice.reducer;