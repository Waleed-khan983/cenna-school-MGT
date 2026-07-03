import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  sendNotificationApi,
  getAllNotificationsApi,
  getMyNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from "@/services/notificationService";

export const sendNotification = createAsyncThunk(
  "notifications/sendNotification",
  async (data, thunkAPI) => {
    try {
      return await sendNotificationApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send notification"
      );
    }
  }
);

export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAllNotifications",
  async (_, thunkAPI) => {
    try {
      return await getAllNotificationsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load notifications"
      );
    }
  }
);

export const fetchMyNotifications = createAsyncThunk(
  "notifications/fetchMyNotifications",
  async (_, thunkAPI) => {
    try {
      return await getMyNotificationsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load notifications"
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, thunkAPI) => {
    try {
      await markNotificationReadApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification"
      );
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, thunkAPI) => {
    try {
      return await markAllNotificationsReadApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark all read"
      );
    }
  }
);

export const removeNotification = createAsyncThunk(
  "notifications/removeNotification",
  async (id, thunkAPI) => {
    try {
      await deleteNotificationApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",

  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.notification) {
          state.notifications.unshift(action.payload.notification);
        }
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((item) =>
          item._id === action.payload
            ? { ...item, readBy: [...(item.readBy || []), "me"] }
            : item
        );

        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
      })

      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default notificationSlice.reducer;