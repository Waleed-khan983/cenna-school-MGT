import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subjectService";

export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, thunkAPI) => {
    try {
      return await getSubjects();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load subjects"
      );
    }
  }
);

export const fetchSubject = createAsyncThunk(
  "subjects/fetchSubject",
  async (id, thunkAPI) => {
    try {
      return await getSubject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load subject"
      );
    }
  }
);

export const addSubject = createAsyncThunk(
  "subjects/addSubject",
  async (data, thunkAPI) => {
    try {
      return await createSubject(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create subject"
      );
    }
  }
);

export const editSubject = createAsyncThunk(
  "subjects/editSubject",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateSubject({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update subject"
      );
    }
  }
);

export const removeSubject = createAsyncThunk(
  "subjects/removeSubject",
  async (id, thunkAPI) => {
    try {
      await deleteSubject(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete subject"
      );
    }
  }
);

const subjectSlice = createSlice({
  name: "subjects",

  initialState: {
    subjects: [],
    subject: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects || [];
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        state.subject = action.payload.subject;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        if (action.payload.subject) {
          state.subjects.unshift(action.payload.subject);
        }
      })
      .addCase(editSubject.fulfilled, (state, action) => {
        const updated = action.payload.subject;

        state.subjects = state.subjects.map((subject) =>
          subject._id === updated._id ? updated : subject
        );
      })
      .addCase(removeSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(
          (subject) => subject._id !== action.payload
        );
      });
  },
});

export default subjectSlice.reducer;