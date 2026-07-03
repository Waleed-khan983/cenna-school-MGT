import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createDatesheetApi,
  getDatesheetsApi,
  deleteDatesheetApi,
} from "@/services/datesheetService";

export const createDatesheet = createAsyncThunk(
  "datesheets/create",
  async (data, thunkAPI) => {
    try {
      return await createDatesheetApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create datesheet"
      );
    }
  }
);

export const fetchDatesheets = createAsyncThunk(
  "datesheets/fetch",
  async (_, thunkAPI) => {
    try {
      return await getDatesheetsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load datesheets"
      );
    }
  }
);

export const removeDatesheet = createAsyncThunk(
  "datesheets/delete",
  async (id, thunkAPI) => {
    try {
      await deleteDatesheetApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete datesheet"
      );
    }
  }
);

const datesheetSlice = createSlice({
  name: "datesheets",
  initialState: {
    datesheets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatesheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatesheets.fulfilled, (state, action) => {
        state.loading = false;
        state.datesheets = action.payload.datesheets || [];
      })
      .addCase(fetchDatesheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDatesheet.fulfilled, (state, action) => {
        if (action.payload.datesheet) {
          state.datesheets.unshift(action.payload.datesheet);
        }
      })
      .addCase(removeDatesheet.fulfilled, (state, action) => {
        state.datesheets = state.datesheets.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default datesheetSlice.reducer;