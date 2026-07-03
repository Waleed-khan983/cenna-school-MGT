import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe, loginUser, registerUser } from "@/services/authService";

const savedToken =
  typeof window !== "undefined"
    ? localStorage.getItem("cenna_token")
    : null;

const savedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

const savedPermissions =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("cenna_permissions") || "[]")
    : [];

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      return await loginUser(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      return await registerUser(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    return await getMe();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to load user"
    );
  }
});

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser,
    profile: null,
    token: savedToken,
    permissions: savedPermissions,
    loading: false,
    error: null,
    isAuthenticated: !!savedToken && !!savedUser,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.permissions = [];
      state.error = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("cenna_token");
        localStorage.removeItem("user");
        localStorage.removeItem("cenna_permissions");
      }
    },

    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user || null;
        const token = action.payload.token || null;
        const permissions = action.payload.permissions || [];

        state.user = user;
        state.profile = action.payload.profile || null;
        state.token = token;
        state.permissions = permissions;
        state.isAuthenticated = !!token && !!user;

        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("cenna_token", token);
          }

          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }

          localStorage.setItem(
            "cenna_permissions",
            JSON.stringify(permissions)
          );
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.permissions = [];
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user || null;
        const permissions =
          action.payload.permissions || state.permissions || [];

        state.user = user;
        state.profile = action.payload.profile || null;
        state.permissions = permissions;
        state.isAuthenticated = !!state.token && !!user;

        if (typeof window !== "undefined") {
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }

          localStorage.setItem(
            "cenna_permissions",
            JSON.stringify(permissions)
          );
        }
      })

      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.user = null;
        state.profile = null;
        state.token = null;
        state.permissions = [];
        state.isAuthenticated = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("cenna_token");
          localStorage.removeItem("user");
          localStorage.removeItem("cenna_permissions");
        }
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;