"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardCard from "@/components/portals/DashboardCard";
import PageLoader from "@/components/ui/PageLoader";
import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";

export default function TeacherDashboardPage() {
  const dispatch = useDispatch();

  const { teacher, assignments = [], loading, error } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
  }, [dispatch]);

  const stats = useMemo(() => {
    const classIds = new Set();
    const subjectIds = new Set();

    assignments.forEach((item) => {
      if (item.class?._id) classIds.add(item.class._id);
      if (item.subject?._id) subjectIds.add(item.subject._id);
    });

    return {
      classes: classIds.size,
      subjects: subjectIds.size,
      assignments: assignments.length,
    };
  }, [assignments]);

  if (loading) return <PageLoader text="Loading teacher dashboard..." />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold text-black">
        Teacher Dashboard
      </h1>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="My Classes"
          value={stats.classes}
          icon="🏫"
          change="Assigned classes"
          color="black"
        />

        <DashboardCard
          title="My Subjects"
          value={stats.subjects}
          icon="📚"
          change="Assigned subjects"
          color="gold"
        />

        <DashboardCard
          title="Assignments"
          value={stats.assignments}
          icon="📝"
          change="Class-subject records"
          color="blue"
        />

        <DashboardCard
          title="Attendance"
          value="Today"
          icon="✅"
          change="Mark assigned classes"
          color="green"
        />
      </div>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-black">
          Welcome Back, {teacher?.user?.name || "Teacher"}
        </h2>

        <p className="mt-2 text-gray-500">
          Manage only your assigned classes, subjects, attendance, results,
          assignments, lectures, quizzes, and notices.
        </p>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold text-black">
          My Class Subject Assignments
        </h2>

        {assignments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.map((item) => (
              <div key={item._id} className="rounded-2xl border p-4">
                <h3 className="font-extrabold text-black">
                  {item.class?.displayName ||
                    `${item.class?.name || ""} - ${item.class?.section || ""}`}
                </h3>

                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Subject: {item.subject?.name || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Room: {item.class?.room || "N/A"} | Code:{" "}
                  {item.subject?.code || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6 text-center font-semibold text-gray-500">
            No class-subject assignment found. Admin must assign from Class
            Subjects page.
          </div>
        )}
      </section>
    </div>
  );
} 