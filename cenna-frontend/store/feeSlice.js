import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    getFeesApi,
    generateFeeApi,
    collectFeeApi,
    deleteFeeApi,
    getDefaultersApi,
    getStudentFeesApi,
    getMyFeesApi,
} from "@/services/feeService";

export const fetchFees = createAsyncThunk(
    "fees/fetchFees",
    async (params, thunkAPI) => {
        try {
            return await getFeesApi(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load fees"
            );
        }
    }
);

export const generateFee = createAsyncThunk(
    "fees/generateFee",
    async (data, thunkAPI) => {
        try {
            return await generateFeeApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to generate fee"
            );
        }
    }
);

export const collectFee = createAsyncThunk(
    "fees/collectFee",
    async ({ id, data }, thunkAPI) => {
        try {
            return await collectFeeApi({ id, data });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to collect fee"
            );
        }
    }
);


export const fetchMyFees = createAsyncThunk(
    "fees/fetchMyFees",
    async (_, thunkAPI) => {
        try {
            return await getMyFeesApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load my fees"
            );
        }
    }
);

export const fetchStudentFees = createAsyncThunk(
    "fees/fetchStudentFees",
    async (studentId, thunkAPI) => {
        try {
            return await getStudentFeesApi(studentId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load student fees"
            );
        }
    }
);

export const removeFee = createAsyncThunk(
    "fees/removeFee",
    async (id, thunkAPI) => {
        try {
            await deleteFeeApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete fee"
            );
        }
    }
);

export const fetchDefaulters = createAsyncThunk(
    "fees/fetchDefaulters",
    async (_, thunkAPI) => {
        try {
            return await getDefaultersApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load defaulters"
            );
        }
    }
);

const feeSlice = createSlice({
    name: "fees",

    initialState: {
        fees: [],
        defaulters: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(fetchFees.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchFees.fulfilled, (state, action) => {
                state.loading = false;
                state.fees = action.payload.fees || [];
            })

            .addCase(fetchFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(generateFee.fulfilled, (state, action) => {
                state.fees.unshift(action.payload.fee);
            })

            .addCase(collectFee.fulfilled, (state, action) => {
                const updated = action.payload.fee;

                state.fees = state.fees.map((fee) =>
                    fee._id === updated._id ? updated : fee
                );
            })

            .addCase(removeFee.fulfilled, (state, action) => {
                state.fees = state.fees.filter(
                    (fee) => fee._id !== action.payload
                );
            })

            .addCase(fetchDefaulters.fulfilled, (state, action) => {
                state.defaulters = action.payload.defaulters || [];
            })
            .addCase(fetchMyFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyFees.fulfilled, (state, action) => {
                state.loading = false;
                state.fees = action.payload.fees || [];
            })
            .addCase(fetchMyFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchStudentFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentFees.fulfilled, (state, action) => {
                state.loading = false;
                state.fees = action.payload.fees || [];
            })
            .addCase(fetchStudentFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default feeSlice.reducer;