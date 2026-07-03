import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMySubjectsApi } from "@/services/studentSubjectService";

export const fetchMySubjects = createAsyncThunk(
  "studentSubjects/fetchMySubjects",
  async (_, thunkAPI) => {
    try {
      return await getMySubjectsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load subjects"
      );
    }
  }
);

const studentSubjectSlice = createSlice({
  name: "studentSubjects",

  initialState: {
    assignments: [],
    classInfo: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments || [];
        state.classInfo = action.payload.class || null;
      })
      .addCase(fetchMySubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSubjectSlice.reducer;