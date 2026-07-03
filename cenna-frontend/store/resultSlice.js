import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  enterResultApi,
  getClassResultsApi,
  getMyResultsApi,
  getStudentResultsApi,
  getSubjectsForClassApi,
  deleteResultApi,
  updateResult,
} from "@/services/resultService";

export const saveResult = createAsyncThunk(
  "results/saveResult",
  async (data, thunkAPI) => {
    try {
      return await enterResultApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save result"
      );
    }
  }
);

export const fetchClassResults = createAsyncThunk(
  "results/fetchClassResults",
  async (params, thunkAPI) => {
    try {
      return await getClassResultsApi(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load results"
      );
    }
  }
);

export const fetchMyResults = createAsyncThunk(
  "results/fetchMyResults",
  async (_, thunkAPI) => {
    try {
      return await getMyResultsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load my results"
      );
    }
  }
);

export const fetchStudentResults = createAsyncThunk(
  "results/fetchStudentResults",
  async (studentId, thunkAPI) => {
    try {
      return await getStudentResultsApi(studentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load student results"
      );
    }
  }
);

export const fetchSubjectsForClass = createAsyncThunk(
  "results/fetchSubjectsForClass",
  async (classId, thunkAPI) => {
    try {
      return await getSubjectsForClassApi(classId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load subjects"
      );
    }
  }
);



export const editResult = createAsyncThunk(
  "results/editResult",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateResult({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update result"
      );
    }
  }
);


export const removeResult = createAsyncThunk(
  "results/removeResult",
  async (id, thunkAPI) => {
    try {
      await deleteResultApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete result"
      );
    }
  }
);

const resultSlice = createSlice({
  name: "results",

  initialState: {
    results: [],
    subjects: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(saveResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveResult.fulfilled, (state, action) => {
        state.loading = false;

        const saved = action.payload.result;

        if (saved) {
          const exists = state.results.find((item) => item._id === saved._id);

          if (exists) {
            state.results = state.results.map((item) =>
              item._id === saved._id ? saved : item
            );
          } else {
            state.results.unshift(saved);
          }
        }
      })
      .addCase(saveResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchClassResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results || [];
      })
      .addCase(fetchClassResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyResults.fulfilled, (state, action) => {
        state.results = action.payload.results || [];
      })

      .addCase(fetchStudentResults.fulfilled, (state, action) => {
        state.results = action.payload.results || [];
      })

      .addCase(fetchSubjectsForClass.fulfilled, (state, action) => {
        state.subjects = action.payload.subjects || [];
      })

      .addCase(editResult.fulfilled, (state, action) => {
        const updated = action.payload.result;

        state.results = state.results.map((result) =>
          result._id === updated._id ? updated : result
        );
      })

      .addCase(removeResult.fulfilled, (state, action) => {
        state.results = state.results.filter(
          (result) => result._id !== action.payload
        );
      })
  },
});

export default resultSlice.reducer;