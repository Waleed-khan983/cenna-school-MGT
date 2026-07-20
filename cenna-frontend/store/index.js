import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import studentReducer from "./studentSlice";
import teacherReducer from "./teacherSlice";
import classReducer from "./classSlice";
import subjectReducer from "./subjectSlice";
import attendanceReducer from "./attendanceSlice";
import resultReducer from "./resultSlice";
import feeReducer from "./feeSlice";
import evaluationReducer from "./evaluationSlice";
import newsReducer from "./newsSlice";
import galleryReducer from "./gallerySlice";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import notificationReducer from "./notificationSlice";
import settingReducer from "./settingSlice"
import timetableReducer from "./timetableSlice";
import datesheetReducer from "./datesheetSlice";
import dashboardReducer from "./dashboardSlice";
import studentDashboardReducer from "./studentDashboardSlice";
import jobApplicationReducer from "./jobApplicationSlice";
import jobVacancyReducer from "./jobVacancySlice";
import studentProfileReducer from "./studentProfileSlice";
import studentSubjectReducer from "./studentSubjectSlice";
import studentAttendanceReducer from "./studentAttendanceSlice";
import studentClassReducer from "./studentClassSlice";
import studentResultReducer from "./studentResultSlice";
import classSubjectReducer from "./classSubjectSlice";
import teacherAssignmentReducer from "./teacherAssignmentSlice";
import teacherResultReducer from "./teacherResultSlice";
import lectureReducer from "./lectureSlice";
import assignmentReducer from "./assignmentSlice";
import quizReducer from "./quizSlice";
import remarkReducer from "./remarkSlice";
import liveClassReducer from "./liveClassSlice";
import parentReducer from "./parentSlice";
import coordinatorReducer from "./coordinatorSlice";
import parentDashboardReducer from "./parentDashboardSlice";
import teacherDashboardReducer from "./teacherDashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    classes: classReducer,
    subjects: subjectReducer,
    attendance: attendanceReducer,
    results: resultReducer,
    fees: feeReducer,

    evaluations: evaluationReducer,

    news: newsReducer,
    users: userReducer,
    profile: profileReducer,
    gallery: galleryReducer,
    notifications: notificationReducer,
    settings: settingReducer,
    timetables: timetableReducer,
    datesheets: datesheetReducer,
    dashboard: dashboardReducer,
    jobApplications: jobApplicationReducer,
    jobVacancies: jobVacancyReducer,
    studentDashboard: studentDashboardReducer,
    studentProfile: studentProfileReducer,
    studentSubjects: studentSubjectReducer,
    studentAttendance: studentAttendanceReducer,
    studentClass: studentClassReducer,
    studentResults: studentResultReducer,
    classSubjects: classSubjectReducer,
    teacherAssignments: teacherAssignmentReducer,
    teacherResults: teacherResultReducer,
    lectures: lectureReducer,
    assignments: assignmentReducer,
    quizzes: quizReducer,
    remarks: remarkReducer,
    liveClasses: liveClassReducer,
    parents: parentReducer,
    coordinator: coordinatorReducer,
    parentDashboard: parentDashboardReducer,
    teacherDashboard: teacherDashboardReducer,
  },
});