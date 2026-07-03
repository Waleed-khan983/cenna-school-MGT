import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/services/studentService";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (params, thunkAPI) => {
    try {
      return await getStudents(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load students"
      );
    }
  }
);

export const fetchStudent = createAsyncThunk(
  "students/fetchStudent",
  async (id, thunkAPI) => {
    try {
      return await getStudent(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load student"
      );
    }
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (data, thunkAPI) => {
    try {
      return await createStudent(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create student"
      );
    }
  }
);

export const editStudent = createAsyncThunk(
  "students/editStudent",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateStudent({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update student"
      );
    }
  }
);

export const removeStudent = createAsyncThunk(
  "students/removeStudent",
  async (id, thunkAPI) => {
    try {
      await deleteStudent(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete student"
      );
    }
  }
);

const studentSlice = createSlice({
  name: "students",

  initialState: {
    students: [],
    student: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },

  reducers: {
    clearStudentError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.student = action.payload.student;
      })

      .addCase(addStudent.fulfilled, (state, action) => {
        if (action.payload.student) {
          state.students.unshift(action.payload.student);
        }
      })

      .addCase(editStudent.fulfilled, (state, action) => {
        const updated = action.payload.student;

        state.students = state.students.map((student) =>
          student._id === updated._id ? updated : student
        );
      })

      .addCase(removeStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student._id !== action.payload
        );
      });
  },
});

export const { clearStudentError } = studentSlice.actions;
export default studentSlice.reducer;