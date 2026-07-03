import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/services/teacherService";

export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (params, thunkAPI) => {
    try {
      return await getTeachers(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load teachers"
      );
    }
  }
);

export const fetchTeacher = createAsyncThunk(
  "teachers/fetchTeacher",
  async (id, thunkAPI) => {
    try {
      return await getTeacher(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load teacher"
      );
    }
  }
);

export const addTeacher = createAsyncThunk(
  "teachers/addTeacher",
  async (data, thunkAPI) => {
    try {
      return await createTeacher(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create teacher"
      );
    }
  }
);

export const editTeacher = createAsyncThunk(
  "teachers/editTeacher",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateTeacher({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update teacher"
      );
    }
  }
);

export const removeTeacher = createAsyncThunk(
  "teachers/removeTeacher",
  async (id, thunkAPI) => {
    try {
      await deleteTeacher(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete teacher"
      );
    }
  }
);

const teacherSlice = createSlice({
  name: "teachers",

  initialState: {
    teachers: [],
    teacher: null,
    total: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.teachers || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.teacher = action.payload.teacher;
      })

      .addCase(addTeacher.fulfilled, (state, action) => {
        if (action.payload.teacher) {
          state.teachers.unshift(action.payload.teacher);
        }
      })

      .addCase(editTeacher.fulfilled, (state, action) => {
        const updated = action.payload.teacher;
        state.teachers = state.teachers.map((teacher) =>
          teacher._id === updated._id ? updated : teacher
        );
      })

      .addCase(removeTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(
          (teacher) => teacher._id !== action.payload
        );
      });
  },
});

export default teacherSlice.reducer;