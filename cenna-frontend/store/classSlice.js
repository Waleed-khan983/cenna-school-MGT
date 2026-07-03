import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} from "@/services/classService";

export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, thunkAPI) => {
    try {
      return await getClasses();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load classes"
      );
    }
  }
);

export const fetchClass = createAsyncThunk(
  "classes/fetchClass",
  async (id, thunkAPI) => {
    try {
      return await getClass(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load class"
      );
    }
  }
);

export const addClass = createAsyncThunk(
  "classes/addClass",
  async (data, thunkAPI) => {
    try {
      return await createClass(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create class"
      );
    }
  }
);

export const editClass = createAsyncThunk(
  "classes/editClass",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateClass({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update class"
      );
    }
  }
);

export const removeClass = createAsyncThunk(
  "classes/removeClass",
  async (id, thunkAPI) => {
    try {
      await deleteClass(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete class"
      );
    }
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    classes: [],
    classItem: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        console.log("Classes API Response:", action.payload);

        state.loading = false;
        state.classes = action.payload.classes || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.classItem = action.payload.class;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        if (action.payload.class) state.classes.unshift(action.payload.class);
      })
      .addCase(editClass.fulfilled, (state, action) => {
        const updated = action.payload.class;
        state.classes = state.classes.map((cls) =>
          cls._id === updated._id ? updated : cls
        );
      })
      .addCase(removeClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((cls) => cls._id !== action.payload);
      });
  },
});

export default classSlice.reducer;