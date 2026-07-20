import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getTeacherDashboardApi } from "@/services/teacherDashboardService";
import { getStudentsByClassApi } from "@/services/teacherResultService";
import { getClassResultsApi } from "@/services/resultService";
import { getClassAttendanceApi } from "@/services/attendanceService";

// "My students" — the teacher's own classes (via the dashboard endpoint),
// then that class's roster per class, merged and deduped by student _id
// (a student normally belongs to one class, but this stays correct even if
// a teacher is assigned across overlapping ClassSubject rows).
export const fetchMyStudents = createAsyncThunk(
  "teacherDashboard/fetchMyStudents",
  async (_, thunkAPI) => {
    try {
      const dashboard = await getTeacherDashboardApi();
      const classes = dashboard.classes || [];

      const rosters = await Promise.all(
        classes.map((cls) => getStudentsByClassApi(cls._id))
      );

      const byId = new Map();

      rosters.forEach((res, idx) => {
        (res.students || []).forEach((student) => {
          byId.set(student._id, { ...student, class: student.class || classes[idx] });
        });
      });

      return { students: Array.from(byId.values()) };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load students"
      );
    }
  }
);

// "My students' performance" — same class roster, joined with each class's
// results (average % across all of a student's Result docs in that class)
// and raw attendance records (present / total -> %). Both figures are
// computed here, not returned pre-aggregated by any single endpoint.
// Students with no results/attendance yet still appear (seeded from the
// roster) with null values rather than being silently dropped.
export const fetchMyStudentsPerformance = createAsyncThunk(
  "teacherDashboard/fetchMyStudentsPerformance",
  async (_, thunkAPI) => {
    try {
      const dashboard = await getTeacherDashboardApi();
      const classes = dashboard.classes || [];

      const [rosters, resultsPerClass, attendancePerClass] = await Promise.all([
        Promise.all(classes.map((cls) => getStudentsByClassApi(cls._id))),
        Promise.all(classes.map((cls) => getClassResultsApi({ classId: cls._id }))),
        Promise.all(classes.map((cls) => getClassAttendanceApi({ classId: cls._id }))),
      ]);

      const byStudent = new Map();

      rosters.forEach((res, idx) => {
        (res.students || []).forEach((student) => {
          byStudent.set(student._id, {
            student,
            class: classes[idx],
            percentages: [],
            attendanceTotal: 0,
            attendancePresent: 0,
          });
        });
      });

      resultsPerClass.forEach((res) => {
        (res.results || []).forEach((result) => {
          const entry = byStudent.get(result.student?._id);
          if (entry) entry.percentages.push(result.percentage || 0);
        });
      });

      attendancePerClass.forEach((res) => {
        (res.attendance || []).forEach((record) => {
          const entry = byStudent.get(record.student?._id);
          if (!entry) return;
          entry.attendanceTotal += 1;
          if (record.status === "present") entry.attendancePresent += 1;
        });
      });

      const students = Array.from(byStudent.values()).map((entry) => ({
        student: entry.student,
        class: entry.class,
        averagePercentage: entry.percentages.length
          ? Math.round(
              entry.percentages.reduce((a, b) => a + b, 0) /
                entry.percentages.length
            )
          : null,
        attendancePercentage: entry.attendanceTotal
          ? Math.round((entry.attendancePresent / entry.attendanceTotal) * 100)
          : null,
      }));

      return { students };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load student performance"
      );
    }
  }
);

const teacherDashboardSlice = createSlice({
  name: "teacherDashboard",

  initialState: {
    students: [],
    studentsPerformance: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || [];
      })
      .addCase(fetchMyStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyStudentsPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStudentsPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsPerformance = action.payload.students || [];
      })
      .addCase(fetchMyStudentsPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherDashboardSlice.reducer;
