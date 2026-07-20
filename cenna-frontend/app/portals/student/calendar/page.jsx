"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentProfile } from "@/store/studentProfileSlice";
import { fetchDatesheets } from "@/store/datesheetSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentCalendarPage() {
  const dispatch = useDispatch();

  const {
    student,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.studentProfile || {});

  const {
    datesheets = [],
    loading: datesheetsLoading,
    error: datesheetsError,
  } = useSelector((state) => state.datesheets || {});

  useEffect(() => {
    dispatch(fetchStudentProfile());
    dispatch(fetchDatesheets());
  }, [dispatch]);

  const myClassId = student?.class?._id;

  // Datesheet is the only backend data with real calendar dates
  // (examDate). Timetable is a recurring weekly period grid with no
  // specific date, so it can't be shown as dated calendar events without
  // misrepresenting it — it isn't included here.
  const myExams = useMemo(() => {
    if (!myClassId) return [];

    return [...datesheets]
      .filter((d) => String(d.classId?._id || d.classId) === String(myClassId))
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  }, [datesheets, myClassId]);

  const loading = profileLoading || datesheetsLoading;
  const error = profileError || datesheetsError;

  if (loading) return <PageLoader text="Loading calendar..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Academic Calendar
      </h1>
      <p className="mb-6 text-gray-500">
        Upcoming exam dates for your class. (Other event types — activities,
        meetings — aren't tracked in the backend yet.)
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && myExams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {myExams.map((exam) => (
            <div key={exam._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black">
                {exam.subjectId?.name || "Subject"}
              </h2>
              <p className="mt-2 text-gray-500">
                Date:{" "}
                {exam.examDate
                  ? new Date(exam.examDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-500">
                Time: {exam.startTime} - {exam.endTime}
              </p>
              {exam.room && <p className="text-gray-500">Room: {exam.room}</p>}
              <p className="mt-2 font-bold text-yellow-600">Exam</p>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No upcoming exams scheduled for your class.
          </div>
        )
      )}
    </section>
  );
}
