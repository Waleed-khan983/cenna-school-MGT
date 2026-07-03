import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getMyTeacherAssignmentsApi,
} from "@/services/teacherAssignmentService";

export const fetchMyTeacherAssignments =
    createAsyncThunk(
        "teacherAssignments/fetchMyTeacherAssignments",

        async (_, thunkAPI) => {
            try {
                return await getMyTeacherAssignmentsApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    "Failed to load assignments"
                );
            }
        }
    );

const teacherAssignmentSlice = createSlice({
    name: "teacherAssignments",

    initialState: {
        teacher: null,
        assignments: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(
                fetchMyTeacherAssignments.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchMyTeacherAssignments.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.teacher = action.payload.teacher;
                    state.assignments =
                        action.payload.assignments || [];
                }
            )

            .addCase(
                fetchMyTeacherAssignments.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export default teacherAssignmentSlice.reducer;