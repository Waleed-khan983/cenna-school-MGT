import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getClassMonitoringApi,
  getCoordinatorAttendanceApi,
  getTeacherMonitoringApi,
  getStudentPerformanceApi,
  getStudentRemarksApi,
  getAwardRecommendationsApi,
  getCoordinatorDashboardApi,
} from "@/services/coordinatorService";

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error.response?.data?.message ||
    error.message ||
    fallbackMessage
  );
};

export const fetchClassMonitoring = createAsyncThunk(
  "coordinator/fetchClassMonitoring",
  async (_, thunkAPI) => {
    try {
      return await getClassMonitoringApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load class monitoring")
      );
    }
  }
);

export const fetchCoordinatorAttendance = createAsyncThunk(
  "coordinator/fetchCoordinatorAttendance",
  async (_, thunkAPI) => {
    try {
      return await getCoordinatorAttendanceApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load attendance")
      );
    }
  }
);

export const fetchTeacherMonitoring = createAsyncThunk(
  "coordinator/fetchTeacherMonitoring",
  async (_, thunkAPI) => {
    try {
      return await getTeacherMonitoringApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load teachers")
      );
    }
  }
);

export const fetchStudentPerformance = createAsyncThunk(
  "coordinator/fetchStudentPerformance",
  async (_, thunkAPI) => {
    try {
      return await getStudentPerformanceApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load student performance")
      );
    }
  }
);

export const fetchStudentRemarks = createAsyncThunk(
  "coordinator/fetchStudentRemarks",
  async (_, thunkAPI) => {
    try {
      return await getStudentRemarksApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load student remarks")
      );
    }
  }
);

export const fetchAwardRecommendations = createAsyncThunk(
  "coordinator/fetchAwardRecommendations",
  async (_, thunkAPI) => {
    try {
      return await getAwardRecommendationsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load award recommendations")
      );
    }
  }
);

export const fetchCoordinatorDashboard = createAsyncThunk(
  "coordinator/fetchCoordinatorDashboard",
  async (_, thunkAPI) => {
    try {
      return await getCoordinatorDashboardApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to load coordinator dashboard")
      );
    }
  }
);

const initialState = {
  classes: [],
  classStatus: "idle",
  classError: null,

  attendanceSummary: {},
  attendanceClasses: [],
  attendanceStatus: "idle",
  attendanceError: null,

  teachers: [],
  teacherStatus: "idle",
  teacherError: null,

  performanceSummary: {},
  performanceStudents: [],
  performanceStatus: "idle",
  performanceError: null,

  remarks: [],
  remarksStatus: "idle",
  remarksError: null,

  awards: {},
  awardsStatus: "idle",
  awardsError: null,

  dashboard: {},
  dashboardStatus: "idle",
  dashboardError: null,

  // Kept for old pages that still use state.coordinator.loading
  loading: false,
};

const coordinatorSlice = createSlice({
  name: "coordinator",

  initialState,

  reducers: {
    clearCoordinatorErrors(state) {
      state.classError = null;
      state.attendanceError = null;
      state.teacherError = null;
      state.performanceError = null;
      state.remarksError = null;
      state.awardsError = null;
      state.dashboardError = null;
    },

    resetCoordinatorDashboard(state) {
      state.dashboard = {};
      state.dashboardStatus = "idle";
      state.dashboardError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Class monitoring
      .addCase(fetchClassMonitoring.pending, (state) => {
        state.loading = true;
        state.classStatus = "loading";
        state.classError = null;
      })
      .addCase(fetchClassMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.classStatus = "succeeded";
        state.classes = action.payload?.classes || [];
      })
      .addCase(fetchClassMonitoring.rejected, (state, action) => {
        state.loading = false;
        state.classStatus = "failed";
        state.classError =
          action.payload || "Failed to load class monitoring";
      })

      // Attendance
      .addCase(fetchCoordinatorAttendance.pending, (state) => {
        state.attendanceStatus = "loading";
        state.attendanceError = null;
      })
      .addCase(fetchCoordinatorAttendance.fulfilled, (state, action) => {
        state.attendanceStatus = "succeeded";
        state.attendanceSummary = action.payload?.summary || {};
        state.attendanceClasses = action.payload?.classes || [];
      })
      .addCase(fetchCoordinatorAttendance.rejected, (state, action) => {
        state.attendanceStatus = "failed";
        state.attendanceError =
          action.payload || "Failed to load attendance";
      })

      // Teacher monitoring
      .addCase(fetchTeacherMonitoring.pending, (state) => {
        state.teacherStatus = "loading";
        state.teacherError = null;
      })
      .addCase(fetchTeacherMonitoring.fulfilled, (state, action) => {
        state.teacherStatus = "succeeded";
        state.teachers = action.payload?.teachers || [];
      })
      .addCase(fetchTeacherMonitoring.rejected, (state, action) => {
        state.teacherStatus = "failed";
        state.teacherError =
          action.payload || "Failed to load teachers";
      })

      // Student performance
      .addCase(fetchStudentPerformance.pending, (state) => {
        state.performanceStatus = "loading";
        state.performanceError = null;
      })
      .addCase(fetchStudentPerformance.fulfilled, (state, action) => {
        state.performanceStatus = "succeeded";
        state.performanceSummary = action.payload?.summary || {};
        state.performanceStudents = action.payload?.students || [];
      })
      .addCase(fetchStudentPerformance.rejected, (state, action) => {
        state.performanceStatus = "failed";
        state.performanceError =
          action.payload || "Failed to load student performance";
      })

      // Remarks
      .addCase(fetchStudentRemarks.pending, (state) => {
        state.remarksStatus = "loading";
        state.remarksError = null;
      })
      .addCase(fetchStudentRemarks.fulfilled, (state, action) => {
        state.remarksStatus = "succeeded";
        state.remarks = action.payload?.remarks || [];
      })
      .addCase(fetchStudentRemarks.rejected, (state, action) => {
        state.remarksStatus = "failed";
        state.remarksError =
          action.payload || "Failed to load student remarks";
      })

      // Award recommendations
      .addCase(fetchAwardRecommendations.pending, (state) => {
        state.awardsStatus = "loading";
        state.awardsError = null;
      })
      .addCase(fetchAwardRecommendations.fulfilled, (state, action) => {
        state.awardsStatus = "succeeded";
        state.awards = action.payload?.awards || {};
      })
      .addCase(fetchAwardRecommendations.rejected, (state, action) => {
        state.awardsStatus = "failed";
        state.awardsError =
          action.payload || "Failed to load award recommendations";
      })

      // Dashboard
      .addCase(fetchCoordinatorDashboard.pending, (state) => {
        state.dashboardStatus = "loading";
        state.dashboardError = null;
      })
      .addCase(fetchCoordinatorDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboard =
          action.payload?.dashboard || action.payload || {};
      })
      .addCase(fetchCoordinatorDashboard.rejected, (state, action) => {
        state.dashboardStatus = "failed";
        state.dashboardError =
          action.payload || "Failed to load coordinator dashboard";
      });
  },
});

export const {
  clearCoordinatorErrors,
  resetCoordinatorDashboard,
} = coordinatorSlice.actions;

export default coordinatorSlice.reducer;