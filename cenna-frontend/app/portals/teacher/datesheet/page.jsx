"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDatesheets } from "@/store/datesheetSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function DatesheetPage() {
  const dispatch = useDispatch();

  const { datesheets, loading } = useSelector(
    (state) => state.datesheets
  );

  useEffect(() => {
    dispatch(fetchDatesheets());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading datesheet..." />;
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">
          Exam Datesheet
        </h1>

        <p className="text-gray-500">
          Upcoming examination schedule.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-center">Exam Date</th>
                <th className="p-4 text-center">Start</th>
                <th className="p-4 text-center">End</th>
                <th className="p-4 text-center">Room</th>
              </tr>
            </thead>

            <tbody>
              {datesheets?.length > 0 ? (
                datesheets.map((item) => (
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

                    <td className="p-4 text-center">
                      {new Date(
                        item.examDate
                      ).toLocaleDateString()}
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
                    colSpan={6}
                    className="p-8 text-center"
                  >
                    No datesheet available.
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