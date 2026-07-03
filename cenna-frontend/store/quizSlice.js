import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyQuizzesApi,
  getQuizApi,
  createQuizApi,
  publishQuizApi,
  getQuizResultsApi,
  publishQuizResultsApi,
  addQuizQuestionApi,
  deleteQuizApi,
  deleteQuizQuestionApi,
  getStudentQuizzesApi,
  submitQuizAttemptApi,
} from "@/services/quizService";

export const fetchMyQuizzes = createAsyncThunk(
  "quizzes/fetchMyQuizzes",
  async (_, thunkAPI) => {
    try {
      return await getMyQuizzesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load quizzes"
      );
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  "quizzes/fetchQuiz",
  async (id, thunkAPI) => {
    try {
      return await getQuizApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load quiz"
      );
    }
  }
);

export const addQuiz = createAsyncThunk(
  "quizzes/addQuiz",
  async (data, thunkAPI) => {
    try {
      return await createQuizApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create quiz"
      );
    }
  }
);

export const publishQuiz = createAsyncThunk(
  "quizzes/publishQuiz",
  async (id, thunkAPI) => {
    try {
      return await publishQuizApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to publish quiz"
      );
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  "quizzes/fetchQuizResults",
  async (id, thunkAPI) => {
    try {
      return await getQuizResultsApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load quiz results"
      );
    }
  }
);

export const publishQuizResults = createAsyncThunk(
  "quizzes/publishQuizResults",
  async (id, thunkAPI) => {
    try {
      return await publishQuizResultsApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to publish results"
      );
    }
  }
);

export const addQuestion = createAsyncThunk(
  "quizzes/addQuestion",
  async (data, thunkAPI) => {
    try {
      return await addQuizQuestionApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add question"
      );
    }
  }
);

export const fetchStudentQuizzes = createAsyncThunk(
  "quizzes/fetchStudentQuizzes",
  async (_, thunkAPI) => {
    try {
      return await getStudentQuizzesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load quizzes"
      );
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quizzes/submitQuiz",
  async (data, thunkAPI) => {
    try {
      return await submitQuizAttemptApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit quiz"
      );
    }
  }
);

export const removeQuiz = createAsyncThunk(
  "quizzes/removeQuiz",
  async (id, thunkAPI) => {
    try {
      await deleteQuizApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete quiz"
      );
    }
  }
);

export const removeQuestion = createAsyncThunk(
  "quizzes/removeQuestion",
  async (id, thunkAPI) => {
    try {
      await deleteQuizQuestionApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quizzes",

  initialState: {
    quizzes: [],
    quiz: null,
    questions: [],
    quizResults: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedQuiz(state) {
      state.quiz = null;
      state.questions = [];
      state.quizResults = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.quizzes || [];
      })
      .addCase(fetchMyQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.quiz = action.payload.quiz;
        state.questions = action.payload.questions || [];
      })

      .addCase(addQuiz.fulfilled, (state, action) => {
        if (action.payload.quiz) {
          state.quizzes.unshift(action.payload.quiz);
        }
      })

      .addCase(publishQuiz.fulfilled, (state, action) => {
        const updated = action.payload.quiz;
        state.quizzes = state.quizzes.map((quiz) =>
          quiz._id === updated._id ? updated : quiz
        );
      })

      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.quizResults = action.payload.attempts || [];
      })

      .addCase(publishQuizResults.fulfilled, (state, action) => {
        const updated = action.payload.quiz;
        state.quizzes = state.quizzes.map((quiz) =>
          quiz._id === updated._id ? updated : quiz
        );
      })

      .addCase(addQuestion.fulfilled, (state, action) => {
        if (action.payload.question) {
          state.questions.push(action.payload.question);
        }

        if (state.quiz) {
          state.quiz.totalMarks = action.payload.totalMarks;
        }
      })

      .addCase(fetchStudentQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.quizzes || [];
      })
      .addCase(fetchStudentQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (question) => question._id !== action.payload
        );
      })

      .addCase(removeQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
          (quiz) => quiz._id !== action.payload
        );
      });
  },
});

export const { clearSelectedQuiz } = quizSlice.actions;
export default quizSlice.reducer;