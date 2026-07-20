"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyResults } from "@/store/studentResultSlice";
import { fetchStudentDashboard } from "@/store/studentDashboardSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentPerformancePage() {
  const dispatch = useDispatch();

  const {
    results = [],
    loading: resultsLoading,
    error: resultsError,
  } = useSelector((state) => state.studentResults || {});

  const {
    stats = {},
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector((state) => state.studentDashboard || {});

  useEffect(() => {
    dispatch(fetchMyResults());
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  const latestResult = useMemo(() => {
    if (!results.length) return null;

    return [...results].sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt) -
        new Date(a.publishedAt || a.createdAt)
    )[0];
  }, [results]);

  const averagePercentage = useMemo(() => {
    if (!results.length) return null;

    const total = results.reduce((sum, r) => sum + (r.percentage || 0), 0);
    return Math.round(total / results.length);
  }, [results]);

  const loading = resultsLoading || dashboardLoading;
  const error = resultsError || dashboardError;

  if (loading) return <PageLoader text="Loading performance..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Performance</h1>
      <p className="mb-6 text-gray-500">Track your academic progress.</p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && (
        <>
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <Card
              title={`Average Marks (${results.length} exam${
                results.length === 1 ? "" : "s"
              })`}
              value={averagePercentage !== null ? `${averagePercentage}%` : "N/A"}
            />
            <Card
              title="Latest Grade"
              value={latestResult?.grade || "N/A"}
            />
            <Card
              title="Attendance"
              value={
                stats.attendancePercentage !== undefined
                  ? `${stats.attendancePercentage}%`
                  : "N/A"
              }
            />
          </div>

          {latestResult ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b p-4">
                <h2 className="font-bold text-black">
                  Latest Exam: {latestResult.examType} ({latestResult.session})
                </h2>
              </div>

              <table className="w-full text-left">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {latestResult.marks?.map((mark) => (
                    <tr key={mark._id} className="border-b">
                      <td className="p-4 font-semibold">
                        {mark.subject?.name || "Subject"}
                      </td>
                      <td className="p-4">
                        {mark.obtained}/{mark.maxMarks}
                      </td>
                      <td className="p-4 font-bold text-green-600">
                        {mark.grade || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
              No results found yet.
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-extrabold text-black">{value}</h2>
    </div>
  );
}
