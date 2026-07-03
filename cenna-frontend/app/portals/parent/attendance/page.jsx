"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyChildrenAttendance,
} from "@/store/parentSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function ParentAttendancePage() {
  const dispatch = useDispatch();

  const {
    attendance = [],
    loading,
    error,
  } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenAttendance());
  }, [dispatch]);

  if (loading) {
    return (
      <PageLoader text="Loading attendance..." />
    );
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Attendance
        </h1>

        <p className="mt-2 text-gray-500">
          Attendance records of your children.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {attendance.length > 0 ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">
                  Student
                </th>
                <th className="p-4 text-left">
                  Date
                </th>
                <th className="p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item) => (
                <tr
                  key={item._id}
                  className="border-b"
                >
                  <td className="p-4 font-semibold">
                    {item.student?.user?.name ||
                      "N/A"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      item.date
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Absent"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          No attendance records found.
        </div>
      )}
    </section>
  );
}