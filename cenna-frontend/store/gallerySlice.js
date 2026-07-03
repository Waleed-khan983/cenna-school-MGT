import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getGalleryApi,
  createGalleryApi,
  updateGalleryApi,
  deleteGalleryApi,
} from "@/services/galleryService";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (params, thunkAPI) => {
    try {
      return await getGalleryApi(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load gallery"
      );
    }
  }
);

export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (formData, thunkAPI) => {
    try {
      return await createGalleryApi(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

export const updateGallery = createAsyncThunk(
  "gallery/updateGallery",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await updateGalleryApi({ id, formData });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update image"
      );
    }
  }
);

export const removeGallery = createAsyncThunk(
  "gallery/removeGallery",
  async (id, thunkAPI) => {
    try {
      await deleteGalleryApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",

  initialState: {
    gallery: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload.gallery || [];
      })

      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGallery.fulfilled, (state, action) => {
        if (action.payload.item) {
          state.gallery.unshift(action.payload.item);
        }
      })

      .addCase(updateGallery.fulfilled, (state, action) => {
        const updated = action.payload.item;

        state.gallery = state.gallery.map((item) =>
          item._id === updated._id ? updated : item
        );
      })

      .addCase(removeGallery.fulfilled, (state, action) => {
        state.gallery = state.gallery.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default gallerySlice.reducer;