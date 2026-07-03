import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getMyLecturesApi,
    getStudentLecturesApi,
    createLectureApi,
    deleteLectureApi,
} from "@/services/lectureService";

export const fetchMyLectures = createAsyncThunk(
    "lectures/fetchMyLectures",
    async (_, thunkAPI) => {
        try {
            return await getMyLecturesApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load lectures"
            );
        }
    }
);

export const fetchStudentLectures = createAsyncThunk(
    "lectures/fetchStudentLectures",
    async (_, thunkAPI) => {
        try {
            return await getStudentLecturesApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load student lectures"
            );
        }
    }
);

export const addLecture = createAsyncThunk(
    "lectures/addLecture",
    async (data, thunkAPI) => {
        try {
            return await createLectureApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create lecture"
            );
        }
    }
);

export const removeLecture = createAsyncThunk(
    "lectures/removeLecture",
    async (id, thunkAPI) => {
        try {
            await deleteLectureApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete lecture"
            );
        }
    }
);

const lectureSlice = createSlice({
    name: "lectures",

    initialState: {
        lectures: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchMyLectures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyLectures.fulfilled, (state, action) => {
                state.loading = false;
                state.lectures = action.payload.lectures || [];
            })
            .addCase(fetchMyLectures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchStudentLectures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentLectures.fulfilled, (state, action) => {
                state.loading = false;
                state.lectures = action.payload.lectures || [];
            })
            .addCase(fetchStudentLectures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addLecture.fulfilled, (state, action) => {
                if (action.payload.lecture) {
                    state.lectures.unshift(action.payload.lecture);
                }
            })

            .addCase(removeLecture.fulfilled, (state, action) => {
                state.lectures = state.lectures.filter(
                    (lecture) => lecture._id !== action.payload
                );
            });
    },
});

export default lectureSlice.reducer;