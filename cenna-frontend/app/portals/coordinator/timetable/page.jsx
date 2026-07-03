"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTimetables } from "@/store/timetableSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function TimetablePage() {
  const dispatch = useDispatch();

  const { timetables, loading } = useSelector(
    (state) => state.timetables
  );

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading timetable..." />;
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">
          Class Timetable
        </h1>

        <p className="text-gray-500">
          Weekly class schedule.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Teacher</th>
                <th className="p-4 text-left">Day</th>
                <th className="p-4 text-center">Start</th>
                <th className="p-4 text-center">End</th>
                <th className="p-4 text-center">Room</th>
              </tr>
            </thead>

            <tbody>
              {timetables?.length > 0 ? (
                timetables.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {item.classId?.displayName ||
                        item.classId?.name}
                    </td>

                    <td className="p-4">
                      {item.subjectId?.name}
                    </td>

                    <td className="p-4">
                      {item.teacherId?.user?.name}
                    </td>

                    <td className="p-4">
                      {item.day}
                    </td>

                    <td className="p-4 text-center">
                      {item.startTime}
                    </td>

                    <td className="p-4 text-center">
                      {item.endTime}
                    </td>

                    <td className="p-4 text-center">
                      {item.room}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center"
                  >
                    No timetable available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}