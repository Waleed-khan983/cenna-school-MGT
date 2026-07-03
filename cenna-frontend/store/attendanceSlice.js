import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  markAttendanceApi,
  getClassAttendanceApi,
  getMonthlyAttendanceReportApi,
  getStudentAttendanceApi,
} from "@/services/attendanceService";

export const markAttendance = createAsyncThunk(
  "attendance/markAttendance",
  async (data, thunkAPI) => {
    try {
      return await markAttendanceApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to mark attendance"
      );
    }
  }
);

export const fetchClassAttendance =
  createAsyncThunk(
    "attendance/fetchClassAttendance",
    async (data, thunkAPI) => {
      try {
        return await getClassAttendanceApi(data);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to load attendance"
        );
      }
    }
  );

export const fetchMonthlyAttendanceReport =
  createAsyncThunk(
    "attendance/fetchMonthlyAttendanceReport",
    async (data, thunkAPI) => {
      try {
        return await getMonthlyAttendanceReportApi(
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to load report"
        );
      }
    }
  );

export const fetchStudentAttendance =
  createAsyncThunk(
    "attendance/fetchStudentAttendance",
    async (data, thunkAPI) => {
      try {
        return await getStudentAttendanceApi(data);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Failed to load student attendance"
        );
      }
    }
  );

const attendanceSlice = createSlice({
  name: "attendance",

  initialState: {
    attendance: [],
    report: [],
    summary: null,
    subjectReport: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },

    clearAttendance: (state) => {
      state.attendance = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // Mark attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        markAttendance.fulfilled,
        (state) => {
          state.loading = false;
        }
      )

      .addCase(
        markAttendance.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Class attendance
      .addCase(
        fetchClassAttendance.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchClassAttendance.fulfilled,
        (state, action) => {
          state.loading = false;
          state.attendance =
            action.payload.attendance || [];
        }
      )

      .addCase(
        fetchClassAttendance.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Monthly report
      .addCase(
        fetchMonthlyAttendanceReport.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchMonthlyAttendanceReport.fulfilled,
        (state, action) => {
          state.loading = false;
          state.report =
            action.payload.report || [];
        }
      )

      .addCase(
        fetchMonthlyAttendanceReport.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Student attendance
      .addCase(
        fetchStudentAttendance.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStudentAttendance.fulfilled,
        (state, action) => {
          state.loading = false;

          state.attendance =
            action.payload.attendance || [];

          state.summary =
            action.payload.summary || null;

          state.subjectReport =
            action.payload.subjectReport || [];
        }
      )

      .addCase(
        fetchStudentAttendance.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearAttendanceError,
  clearAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;