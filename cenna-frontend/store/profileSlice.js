import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getMyProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "@/services/profileService";

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, thunkAPI) => {
    try {
      return await getMyProfileApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data, thunkAPI) => {
    try {
      return await updateProfileApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data, thunkAPI) => {
    try {
      return await changePasswordApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",

  initialState: {
    user: null,
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearProfileMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user =
          action.payload.user ||
          action.payload.data?.user ||
          null;

        state.profile =
          action.payload.profile ||
          action.payload.data?.profile ||
          null;
      })

      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ||
          "Profile updated successfully";

        state.user =
          action.payload.user ||
          state.user;

        state.profile =
          action.payload.profile ||
          state.profile;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ||
          "Password changed successfully";
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileMessages } = profileSlice.actions;

export default profileSlice.reducer;