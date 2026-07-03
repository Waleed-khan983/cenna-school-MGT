import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  launchCampaignApi,
  getCampaignsApi,
  closeCampaignApi,
  getReportsApi,
  getActiveEvaluationsApi,
  submitEvaluationApi,
} from "@/services/evaluationService";

export const launchCampaign = createAsyncThunk(
  "evaluations/launchCampaign",
  async (data, thunkAPI) => {
    try {
      return await launchCampaignApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to launch evaluation"
      );
    }
  }
);

export const fetchCampaigns = createAsyncThunk(
  "evaluations/fetchCampaigns",
  async (_, thunkAPI) => {
    try {
      return await getCampaignsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load campaigns"
      );
    }
  }
);

export const closeCampaign = createAsyncThunk(
  "evaluations/closeCampaign",
  async (id, thunkAPI) => {
    try {
      await closeCampaignApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to close campaign"
      );
    }
  }
);

export const fetchReports = createAsyncThunk(
  "evaluations/fetchReports",
  async (_, thunkAPI) => {
    try {
      return await getReportsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load reports"
      );
    }
  }
);

export const fetchActiveEvaluations = createAsyncThunk(
  "evaluations/fetchActiveEvaluations",
  async (_, thunkAPI) => {
    try {
      return await getActiveEvaluationsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load active evaluations"
      );
    }
  }
);

export const submitEvaluation = createAsyncThunk(
  "evaluations/submitEvaluation",
  async (data, thunkAPI) => {
    try {
      return await submitEvaluationApi(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit evaluation"
      );
    }
  }
);

const evaluationSlice = createSlice({
  name: "evaluations",

  initialState: {
    campaigns: [],
    activeCampaigns: [],
    reports: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(launchCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(launchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.campaign) {
          state.campaigns.unshift(action.payload.campaign);
        }
      })
      .addCase(launchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns || [];
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(closeCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.map((campaign) =>
          campaign._id === action.payload
            ? { ...campaign, isActive: false }
            : campaign
        );
      })

      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload.evaluations || [];
      })

      .addCase(fetchActiveEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCampaigns = action.payload.campaigns || [];
      })
      .addCase(fetchActiveEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEvaluation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default evaluationSlice.reducer;