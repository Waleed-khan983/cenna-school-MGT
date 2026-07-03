 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createJobVacancyApi,
  getJobVacanciesApi,
  updateJobVacancyApi,
  deleteJobVacancyApi,
} from "@/services/jobVacancyService";

export const fetchJobVacancies = createAsyncThunk(
  "jobVacancies/fetch",
  async (_, thunkAPI) => {
    try {
      return await getJobVacanciesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load vacancies"
      );
    }
  }
);

export const createJobVacancy = createAsyncThunk(
  "jobVacancies/create",
  async (data, thunkAPI) => {
    try {
      return await createJobVacancyApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create vacancy"
      );
    }
  }
);

export const editJobVacancy = createAsyncThunk(
  "jobVacancies/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateJobVacancyApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update vacancy"
      );
    }
  }
);

export const removeJobVacancy = createAsyncThunk(
  "jobVacancies/delete",
  async (id, thunkAPI) => {
    try {
      await deleteJobVacancyApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete vacancy"
      );
    }
  }
);

const jobVacancySlice = createSlice({
  name: "jobVacancies",
  initialState: {
    vacancies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobVacancies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.vacancies = action.payload.vacancies || [];
      })
      .addCase(fetchJobVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createJobVacancy.fulfilled, (state, action) => {
        if (action.payload.vacancy) {
          state.vacancies.unshift(action.payload.vacancy);
        }
      })
      .addCase(editJobVacancy.fulfilled, (state, action) => {
        state.vacancies = state.vacancies.map((item) =>
          item._id === action.payload.vacancy._id
            ? action.payload.vacancy
            : item
        );
      })
      .addCase(removeJobVacancy.fulfilled, (state, action) => {
        state.vacancies = state.vacancies.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default jobVacancySlice.reducer;