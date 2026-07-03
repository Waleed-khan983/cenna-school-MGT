"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCoordinatorAttendance } from "@/store/coordinatorSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function CoordinatorAttendancePage() {
  const dispatch = useDispatch();

  const {
    attendanceSummary,
    attendanceClasses,
    loading,
  } = useSelector((state) => state.coordinator);

  console.log("Attendance Summary:", attendanceSummary);
  console.log("Attendance Classes:", attendanceClasses);

  useEffect(() => {
    dispatch(fetchCoordinatorAttendance());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading attendance..." />;
  }

  return (
    <section className="space-y-6">

      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Attendance Monitoring
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor today's attendance across all classes.
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <Card
          title="Attendance"
          value={`${attendanceSummary.overallPercentage || 0}%`}
        />

        <Card
          title="Present"
          value={attendanceSummary.present || 0}
        />

        <Card
          title="Absent"
          value={attendanceSummary.absent || 0}
        />

        <Card
          title="Late"
          value={attendanceSummary.late || 0}
        />

        <Card
          title="Leave"
          value={attendanceSummary.leave || 0}
        />

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <table className="min-w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="px-6 py-4 text-left">
                Class
              </th>

              <th className="px-6 py-4">
                Students
              </th>

              <th className="px-6 py-4">
                Present
              </th>

              <th className="px-6 py-4">
                Absent
              </th>

              <th className="px-6 py-4">
                Late
              </th>

              <th className="px-6 py-4">
                Leave
              </th>

              <th className="px-6 py-4">
                Attendance %
              </th>

            </tr>

          </thead>

          <tbody>

            {attendanceClasses.map((item) => (

              <tr
                key={item._id}
                className="border-b"
              >

                <td className="px-6 py-4 font-semibold">
                  {item.className}
                </td>

                <td className="px-6 py-4 text-center">
                  {item.totalStudents}
                </td>

                <td className="px-6 py-4 text-center text-green-600 font-bold">
                  {item.present}
                </td>

                <td className="px-6 py-4 text-center text-red-600 font-bold">
                  {item.absent}
                </td>

                <td className="px-6 py-4 text-center text-yellow-600 font-bold">
                  {item.late}
                </td>

                <td className="px-6 py-4 text-center text-blue-600 font-bold">
                  {item.leave}
                </td>

                <td className="px-6 py-4 text-center font-bold">
                  {item.attendance}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold">
        {value}
      </h2>

    </div>
  );
}