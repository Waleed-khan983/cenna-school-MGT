import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getSettingsApi,
  updateSettingsApi,
} from "@/services/settingService";

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    return await getSettingsApi();
  }
);

export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (data) => {
    return await updateSettingsApi(data);
  }
);

const settingSlice = createSlice({
  name: "settings",

  initialState: {
    settings: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings;
      })

      .addCase(saveSettings.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
      });
  },
});

export default settingSlice.reducer;