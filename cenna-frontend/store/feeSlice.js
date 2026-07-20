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

// No dedicated "reports" endpoint exists on the backend — these three
// figures are derived client-side from the real /fees and /fees/defaulters
// data (both already accountant-accessible). A large limit is passed to
// /fees so the collection total isn't silently truncated by the default
// page size.
export const fetchFeeReports = createAsyncThunk(
    "fees/fetchFeeReports",
    async (_, thunkAPI) => {
        try {
            const [feesRes, defaultersRes] = await Promise.all([
                getFeesApi({ limit: 5000 }),
                getDefaultersApi(),
            ]);

            const fees = feesRes.fees || [];
            const defaulters = defaultersRes.defaulters || [];

            const now = new Date();
            const monthlyCollected = fees.reduce((sum, fee) => {
                if (!fee.paidDate) return sum;
                const paidDate = new Date(fee.paidDate);
                if (
                    paidDate.getMonth() === now.getMonth() &&
                    paidDate.getFullYear() === now.getFullYear()
                ) {
                    return sum + Number(fee.paidAmount || 0);
                }
                return sum;
            }, 0);

            const pendingDues = defaulters.reduce(
                (sum, fee) =>
                    sum + Math.max(0, Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0)),
                0
            );

            const defaulterStudentIds = new Set(
                defaulters.map((fee) => fee.student?._id || fee.student)
            );

            return {
                monthlyCollected,
                pendingDues,
                defaulterCount: defaulterStudentIds.size,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load reports"
            );
        }
    }
);

const feeSlice = createSlice({
    name: "fees",

    initialState: {
        fees: [],
        defaulters: [],
        reports: null,
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

            .addCase(fetchFeeReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeeReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchFeeReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default feeSlice.reducer;