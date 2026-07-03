import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getMyAttendanceApi,
} from "@/services/studentAttendanceService";

export const fetchMyAttendance =
  createAsyncThunk(
    "studentAttendance/fetchMyAttendance",

    async (params = {}, thunkAPI) => {
      try {
        return await getMyAttendanceApi(params);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to load attendance"
        );
      }
    }
  );

const initialState = {
  summary: {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    percentage: 0,
  },

  subjectReport: [],
  attendance: [],
  student: null,
  loading: false,
  error: null,
};

const studentAttendanceSlice = createSlice({
  name: "studentAttendance",

  initialState,

  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },

    resetAttendance: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchMyAttendance.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMyAttendance.fulfilled,
        (state, action) => {
          state.loading = false;

          state.summary =
            action.payload.summary ||
            initialState.summary;

          state.subjectReport =
            action.payload.subjectReport || [];

          state.attendance =
            action.payload.attendance || [];

          state.student =
            action.payload.student || null;
        }
      )

      .addCase(
        fetchMyAttendance.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load attendance";
        }
      );
  },
});

export const {
  clearAttendanceError,
  resetAttendance,
} = studentAttendanceSlice.actions;

export default studentAttendanceSlice.reducer;