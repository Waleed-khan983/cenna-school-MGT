import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getMyClassApi,
} from "@/services/studentClassService";

export const fetchMyClass = createAsyncThunk(
  "studentClass/fetchMyClass",

  async (_, thunkAPI) => {
    try {
      return await getMyClassApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to load class information"
      );
    }
  }
);

const initialState = {
  classData: null,
  student: null,
  subjects: [],
  loading: false,
  error: null,
};

const studentClassSlice = createSlice({
  name: "studentClass",

  initialState,

  reducers: {
    clearStudentClassError: (state) => {
      state.error = null;
    },

    resetStudentClass: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchMyClass.fulfilled,
        (state, action) => {
          state.loading = false;

          state.student =
            action.payload.student || null;

          state.classData =
            action.payload.class || null;

          state.subjects =
            action.payload.class?.subjects || [];
        }
      )

      .addCase(
        fetchMyClass.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load class information";
        }
      );
  },
});

export const {
  clearStudentClassError,
  resetStudentClass,
} = studentClassSlice.actions;

export default studentClassSlice.reducer;