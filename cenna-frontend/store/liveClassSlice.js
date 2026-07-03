import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyLiveClassesApi,
  getStudentLiveClassesApi,
  createLiveClassApi,
  deleteLiveClassApi,
  joinLiveClassApi,
  getLiveClassAttendanceApi,
} from "@/services/liveClassService";

export const fetchMyLiveClasses = createAsyncThunk(
  "liveClasses/fetchMyLiveClasses",
  async (_, thunkAPI) => {
    try {
      return await getMyLiveClassesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load live classes"
      );
    }
  }
);

export const fetchStudentLiveClasses = createAsyncThunk(
  "liveClasses/fetchStudentLiveClasses",
  async (_, thunkAPI) => {
    try {
      return await getStudentLiveClassesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load student live classes"
      );
    }
  }
);

export const addLiveClass = createAsyncThunk(
  "liveClasses/addLiveClass",
  async (data, thunkAPI) => {
    try {
      return await createLiveClassApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create live class"
      );
    }
  }
);

export const removeLiveClass = createAsyncThunk(
  "liveClasses/removeLiveClass",
  async (id, thunkAPI) => {
    try {
      await deleteLiveClassApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete live class"
      );
    }
  }
);

export const joinLiveClass = createAsyncThunk(
  "liveClasses/joinLiveClass",
  async (id, thunkAPI) => {
    try {
      return await joinLiveClassApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to join class"
      );
    }
  }
);

export const fetchLiveClassAttendance = createAsyncThunk(
  "liveClasses/fetchAttendance",
  async (id, thunkAPI) => {
    try {
      return await getLiveClassAttendanceApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load attendance"
      );
    }
  }
);

const liveClassSlice = createSlice({
  name: "liveClasses",

  initialState: {
    liveClasses: [],
    attendanceRecords: [],
    loading: false,
    joinLoading: false,
    attendanceLoading: false,
    error: null,
  },

  reducers: {
    clearLiveClassError: (state) => {
      state.error = null;
    },

    clearLiveClassAttendance: (state) => {
      state.attendanceRecords = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLiveClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.liveClasses = action.payload.liveClasses || [];
      })
      .addCase(fetchMyLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudentLiveClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.liveClasses = action.payload.liveClasses || [];
      })
      .addCase(fetchStudentLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addLiveClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLiveClass.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.liveClass) {
          state.liveClasses.unshift(action.payload.liveClass);
        }
      })
      .addCase(addLiveClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeLiveClass.pending, (state) => {
        state.error = null;
      })
      .addCase(removeLiveClass.fulfilled, (state, action) => {
        state.liveClasses = state.liveClasses.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeLiveClass.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(joinLiveClass.pending, (state) => {
        state.joinLoading = true;
        state.error = null;
      })
      .addCase(joinLiveClass.fulfilled, (state) => {
        state.joinLoading = false;
      })
      .addCase(joinLiveClass.rejected, (state, action) => {
        state.joinLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchLiveClassAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.error = null;
      })
      .addCase(fetchLiveClassAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceRecords = action.payload.records || [];
      })
      .addCase(fetchLiveClassAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLiveClassError, clearLiveClassAttendance } =
  liveClassSlice.actions;

export default liveClassSlice.reducer;