import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyRemarksApi,
  getMyStudentRemarksApi,
  createRemarkApi,
  deleteRemarkApi,
} from "@/services/remarkService";

export const fetchMyRemarks = createAsyncThunk(
  "remarks/fetchMyRemarks",
  async (_, thunkAPI) => {
    try {
      return await getMyRemarksApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load remarks"
      );
    }
  }
);

export const fetchMyStudentRemarks = createAsyncThunk(
  "remarks/fetchMyStudentRemarks",
  async (_, thunkAPI) => {
    try {
      return await getMyStudentRemarksApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load remarks"
      );
    }
  }
);

export const addRemark = createAsyncThunk(
  "remarks/addRemark",
  async (data, thunkAPI) => {
    try {
      return await createRemarkApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add remark"
      );
    }
  }
);

export const removeRemark = createAsyncThunk(
  "remarks/removeRemark",
  async (id, thunkAPI) => {
    try {
      await deleteRemarkApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete remark"
      );
    }
  }
);

const remarkSlice = createSlice({
  name: "remarks",

  initialState: {
    remarks: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRemarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.remarks = action.payload.remarks || [];
      })
      .addCase(fetchMyRemarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyStudentRemarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudentRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.remarks = action.payload.remarks || [];
      })
      .addCase(fetchMyStudentRemarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRemark.fulfilled, (state, action) => {
        if (action.payload.remark) {
          state.remarks.unshift(action.payload.remark);
        }
      })
      .addCase(removeRemark.fulfilled, (state, action) => {
        state.remarks = state.remarks.filter(
          (remark) => remark._id !== action.payload
        );
      });
  },
});

export default remarkSlice.reducer;