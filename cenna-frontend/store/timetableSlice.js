import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTimetableApi,
  getTimetablesApi,
  deleteTimetableApi,
} from "@/services/timetableService";

export const createTimetable = createAsyncThunk(
  "timetables/create",
  async (data, thunkAPI) => {
    try {
      return await createTimetableApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create timetable"
      );
    }
  }
);

export const fetchTimetables = createAsyncThunk(
  "timetables/fetch",
  async (_, thunkAPI) => {
    try {
      return await getTimetablesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load timetables"
      );
    }
  }
);

export const removeTimetable = createAsyncThunk(
  "timetables/delete",
  async (id, thunkAPI) => {
    try {
      await deleteTimetableApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete timetable"
      );
    }
  }
);

const timetableSlice = createSlice({
  name: "timetables",
  initialState: {
    timetables: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimetables.fulfilled, (state, action) => {
        state.loading = false;
        state.timetables = action.payload.timetables || [];
      })
      .addCase(fetchTimetables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTimetable.fulfilled, (state, action) => {
        if (action.payload.timetable) {
          state.timetables.unshift(action.payload.timetable);
        }
      })
      .addCase(removeTimetable.fulfilled, (state, action) => {
        state.timetables = state.timetables.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default timetableSlice.reducer;