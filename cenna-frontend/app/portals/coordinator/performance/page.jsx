"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentPerformance } from "@/store/coordinatorSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function CoordinatorPerformancePage() {
  const dispatch = useDispatch();

  const {
    loading,
    performanceSummary,
    performanceStudents,
  } = useSelector(
    (state) => state.coordinator
  );

  useEffect(() => {
    dispatch(fetchStudentPerformance());
  }, [dispatch]);

  if (loading) {
    return (
      <PageLoader text="Loading performance..." />
    );
  }

  return (
    <section className="space-y-6">

      <div>

        <h1 className="text-3xl font-extrabold">
          Student Performance
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor academic performance across the school.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-3xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Total Students
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {performanceSummary.totalStudents || 0}
          </h2>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <p className="text-gray-500">
            School Average
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {performanceSummary.classAverage || 0}%
          </h2>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Weak Students
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {performanceSummary.weakStudents || 0}
          </h2>

        </div>

      </div>

      {performanceSummary.topper && (

        <div className="rounded-3xl bg-green-50 border border-green-200 p-6">

          <h2 className="font-bold text-xl">
            🏆 Top Performer
          </h2>

          <p className="mt-3">
            <strong>
              {performanceSummary.topper.name}
            </strong>

            {" • "}

            {performanceSummary.topper.className}

            {" • "}

            {performanceSummary.topper.averagePercentage}%
          </p>

        </div>

      )}

      <div className="grid gap-5 lg:grid-cols-2">

        {performanceStudents.map((student) => (

          <div
            key={student._id}
            className="rounded-3xl bg-white p-6 shadow"
          >

            <h2 className="text-xl font-bold">
              {student.name}
            </h2>

            <p className="text-gray-500">
              {student.className}
            </p>

            <div className="mt-5 space-y-2">

              <p>
                <strong>Admission:</strong>{" "}
                {student.admissionNo}
              </p>

              <p>
                <strong>Average:</strong>{" "}
                {student.averagePercentage}%
              </p>

              <p>
                <strong>Passed:</strong>{" "}
                {student.passed}
              </p>

              <p>
                <strong>Failed:</strong>{" "}
                {student.failed}
              </p>

              <p>
                <strong>Status:</strong>{" "}

                <span
                  className={`font-semibold ${
                    student.status === "Excellent"
                      ? "text-green-600"
                      : student.status === "Good"
                      ? "text-blue-600"
                      : student.status === "Average"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {student.status}
                </span>

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}