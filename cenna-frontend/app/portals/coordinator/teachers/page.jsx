"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTeacherMonitoring } from "@/store/coordinatorSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function CoordinatorTeachersPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const {
    teachers,
    loading,
  } = useSelector((state) => state.coordinator);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const keyword = search.toLowerCase();

      return (
        teacher.name?.toLowerCase().includes(keyword) ||
        teacher.employeeId?.toLowerCase().includes(keyword) ||
        teacher.designation?.toLowerCase().includes(keyword)
      );
    });
  }, [teachers, search]);

  useEffect(() => {
    dispatch(fetchTeacherMonitoring());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading teachers..." />;
  }

  return (
    <section className="space-y-6">


      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Teacher Monitoring
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor teachers, academic performance and evaluations.
        </p>

        <div className="mb-8 mt-6">
          <input
            type="text"
            placeholder="Search by teacher, employee ID or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredTeachers.map((teacher) => (

          <div
            key={teacher._id}
            className="rounded-3xl bg-white p-6 shadow-sm border"
          >

            <div className="flex items-center gap-4">

              <img
                src={
                  teacher.avatar ||
                  "/images/teacher.png"
                }
                alt={teacher.name}
                className="h-16 w-16 rounded-full object-cover border"
              />

              <div>

                <h2 className="text-xl font-bold">
                  {teacher.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {teacher.designation}
                </p>

                <p className="text-xs text-gray-400">
                  {teacher.employeeId}
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-2 text-sm">

              <p>
                <span className="font-semibold">
                  Classes:
                </span>{" "}
                {teacher.classes.join(", ") || "-"}
              </p>

              <p>
                <span className="font-semibold">
                  Subjects:
                </span>{" "}
                {teacher.subjects.join(", ") || "-"}
              </p>

              <p>
                <span className="font-semibold">
                  Students:
                </span>{" "}
                {teacher.totalStudents}
              </p>

              <p>
                <span className="font-semibold">
                  Attendance Taken:
                </span>{" "}
                {teacher.attendanceTaken}
              </p>

              <p>
                <span className="font-semibold">
                  Evaluation:
                </span>{" "}
                {teacher.evaluationScore}
              </p>

              <p>
                <span className="font-semibold">
                  Average Performance:
                </span>{" "}
                {teacher.averagePerformance}%
              </p>

            </div>

            <div className="mt-5">

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold
                ${teacher.status === "Excellent"
                    ? "bg-green-100 text-green-700"
                    : teacher.status === "Good"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {teacher.status}
              </span>

            </div>

          </div>

        ))}

      </div>

      {!loading && filteredTeachers.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
          No teachers found.
        </div>
      )}

    </section>
  );
}