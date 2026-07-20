"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchParentDashboard } from "@/store/parentDashboardSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentPerformancePage() {
  const dispatch = useDispatch();

  const { children = [], loading, error } = useSelector(
    (state) => state.parentDashboard || {}
  );

  useEffect(() => {
    dispatch(fetchParentDashboard());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading performance..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Performance</h1>
      <p className="mb-6 text-gray-500">
        Monitor academic progress and overall performance of your children.
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && children.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {children.map((item) => (
            <div
              key={item.child?._id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-black">
                {item.child?.user?.name || "Student"}
              </h2>

              <p className="mt-2 text-gray-500">
                Attendance (last 20 marked periods):{" "}
                <span className="font-bold text-black">
                  {item.attendancePercentage ?? 0}%
                </span>
              </p>

              {item.latestResult ? (
                <p className="text-gray-500">
                  Latest Result: {item.latestResult.examType} —{" "}
                  <span className="font-bold text-black">
                    {item.latestResult.percentage ?? 0}%
                  </span>{" "}
                  ({item.latestResult.grade || "N/A"})
                </p>
              ) : (
                <p className="text-gray-500">Latest Result: No results yet</p>
              )}

              <p className="font-bold text-green-600">
                {item.pendingFees?.length > 0
                  ? `${item.pendingFees.length} pending fee record(s)`
                  : "No pending fees"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No children linked to this account.
          </div>
        )
      )}
    </section>
  );
}
