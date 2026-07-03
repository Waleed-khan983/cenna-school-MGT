import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getUsers,
  getUser,
  toggleUserStatus,
  deleteUser,
} from "@/services/userService";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (role, thunkAPI) => {
    try {
      return await getUsers(role);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (id, thunkAPI) => {
    try {
      return await getUser(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const changeUserStatus = createAsyncThunk(
  "users/changeUserStatus",
  async (id, thunkAPI) => {
    try {
      return await toggleUserStatus(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (id, thunkAPI) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      .addCase(changeUserStatus.fulfilled, (state, action) => {
        const updated = action.payload.user;

        state.users = state.users.map((user) =>
          user._id === updated._id ? updated : user
        );
      })

      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user._id !== action.payload
        );
      });
  },
});

export default userSlice.reducer;