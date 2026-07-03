import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    getClassMonitoringApi,
    getCoordinatorAttendanceApi,
    getTeacherMonitoringApi,
    getStudentPerformanceApi,
    getStudentRemarksApi,
    getAwardRecommendationsApi,
} from "@/services/coordinatorService";

export const fetchClassMonitoring =
    createAsyncThunk(
        "coordinator/classes",
        async (_, thunkAPI) => {
            try {
                return await getClassMonitoringApi();
            }
            catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        });

export const fetchCoordinatorAttendance =
    createAsyncThunk(
        "coordinator/attendance",

        async (_, thunkAPI) => {
            try {
                return await getCoordinatorAttendanceApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        }
    );

export const fetchTeacherMonitoring =
    createAsyncThunk(
        "coordinator/teachers",
        async (_, thunkAPI) => {
            try {
                return await getTeacherMonitoringApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        }
    );

export const fetchStudentPerformance =
    createAsyncThunk(
        "coordinator/performance",
        async (_, thunkAPI) => {
            try {
                return await getStudentPerformanceApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        }
    );

export const fetchStudentRemarks =
    createAsyncThunk(
        "coordinator/remarks",
        async (_, thunkAPI) => {
            try {
                return await getStudentRemarksApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        }
    );

export const fetchAwardRecommendations =
    createAsyncThunk(
        "coordinator/awards",
        async (_, thunkAPI) => {
            try {
                return await getAwardRecommendationsApi();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message
                );
            }
        }
    );

const coordinatorSlice = createSlice({

    name: "coordinator",

    initialState: {

        classes: [],

        loading: false,

        attendanceSummary: {},

        attendanceClasses: [],

        teachers: [],

        performanceSummary: {},

        performanceStudents: [],

        remarks: [],

        awards: {},

    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(fetchClassMonitoring.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchClassMonitoring.fulfilled, (state, action) => {

                state.loading = false;

                state.classes = action.payload.classes;

            })

            .addCase(fetchClassMonitoring.rejected, (state) => {

                state.loading = false;

            })

            .addCase(
                fetchCoordinatorAttendance.fulfilled,
                (state, action) => {

                    state.attendanceSummary =
                        action.payload.summary;

                    state.attendanceClasses =
                        action.payload.classes;

                })

            .addCase(
                fetchTeacherMonitoring.fulfilled,
                (state, action) => {

                    state.teachers =
                        action.payload.teachers;

                }
            )

            .addCase(
                fetchStudentPerformance.fulfilled,
                (state, action) => {

                    state.performanceSummary =
                        action.payload.summary;

                    state.performanceStudents =
                        action.payload.students;

                }
            )

            .addCase(
                fetchStudentRemarks.fulfilled,
                (state, action) => {
                    state.remarks = action.payload.remarks;
                }
            )

            .addCase(
                fetchAwardRecommendations.fulfilled,
                (state, action) => {
                    state.awards = action.payload.awards;
                }
            );

    }

});

export default coordinatorSlice.reducer;