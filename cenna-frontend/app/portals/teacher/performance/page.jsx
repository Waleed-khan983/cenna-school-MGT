"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyStudentsPerformance } from "@/store/teacherDashboardSlice";
import PageLoader from "@/components/ui/PageLoader";

function statusLabel(averagePercentage) {
  if (averagePercentage === null || averagePercentage === undefined) {
    return { text: "No results yet", className: "text-gray-400" };
  }
  if (averagePercentage >= 90) return { text: "Excellent", className: "text-green-600" };
  if (averagePercentage >= 75) return { text: "Good", className: "text-green-600" };
  if (averagePercentage >= 50) return { text: "Needs Improvement", className: "text-yellow-600" };
  return { text: "At Risk", className: "text-red-600" };
}

export default function TeacherPerformancePage() {
  const dispatch = useDispatch();

  const { studentsPerformance = [], loading, error } = useSelector(
    (state) => state.teacherDashboard || {}
  );

  useEffect(() => {
    dispatch(fetchMyStudentsPerformance());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading student performance..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Student Performance
      </h1>
      <p className="mb-6 text-gray-500">
        Monitor student academic performance across your classes.
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && studentsPerformance.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {studentsPerformance.map((item) => {
            const status = statusLabel(item.averagePercentage);

            return (
              <div
                key={item.student._id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-black">
                  {item.student.user?.name || "N/A"}
                </h2>
                <p className="mt-2 text-gray-500">
                  Class:{" "}
                  {item.class?.displayName ||
                    `${item.class?.name || "N/A"} - ${item.class?.section || "A"}`}
                </p>
                <p className="text-gray-500">
                  Average Marks:{" "}
                  {item.averagePercentage !== null
                    ? `${item.averagePercentage}%`
                    : "N/A"}
                </p>
                <p className="text-gray-500">
                  Attendance:{" "}
                  {item.attendancePercentage !== null
                    ? `${item.attendancePercentage}%`
                    : "N/A"}
                </p>
                <p className={`mt-2 font-bold ${status.className}`}>
                  {status.text}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No students found in your classes.
          </div>
        )
      )}
    </section>
  );
}
