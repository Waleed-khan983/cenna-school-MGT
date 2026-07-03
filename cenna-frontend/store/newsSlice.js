import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getNewsApi,
  getNewsItemApi,
  createNewsApi,
  updateNewsApi,
  deleteNewsApi,
} from "@/services/newsService";

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (params, thunkAPI) => {
    try {
      return await getNewsApi(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load news"
      );
    }
  }
);

export const fetchNewsItem = createAsyncThunk(
  "news/fetchNewsItem",
  async (id, thunkAPI) => {
    try {
      return await getNewsItemApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load news item"
      );
    }
  }
);

export const addNews = createAsyncThunk(
  "news/addNews",
  async (data, thunkAPI) => {
    try {
      return await createNewsApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create news"
      );
    }
  }
);

export const editNews = createAsyncThunk(
  "news/editNews",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateNewsApi({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update news"
      );
    }
  }
);

export const removeNews = createAsyncThunk(
  "news/removeNews",
  async (id, thunkAPI) => {
    try {
      await deleteNewsApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete news"
      );
    }
  }
);

const newsSlice = createSlice({
  name: "news",

  initialState: {
    news: [],
    newsItem: null,
    total: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.news || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchNewsItem.fulfilled, (state, action) => {
        state.newsItem = action.payload.news;
      })

      .addCase(addNews.fulfilled, (state, action) => {
        if (action.payload.news) {
          state.news.unshift(action.payload.news);
        }
      })

      .addCase(editNews.fulfilled, (state, action) => {
        const updated = action.payload.news;

        state.news = state.news.map((item) =>
          item._id === updated._id ? updated : item
        );
      })

      .addCase(removeNews.fulfilled, (state, action) => {
        state.news = state.news.filter((item) => item._id !== action.payload);
      });
  },
});

export default newsSlice.reducer;