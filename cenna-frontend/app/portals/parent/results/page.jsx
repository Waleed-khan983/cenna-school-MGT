"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChildrenResults } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentResultsPage() {
  const dispatch = useDispatch();

  const { results = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenResults());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading results..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Results</h1>
        <p className="mt-2 text-gray-500">
          View examination results of your children.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result) => (
            <div key={result._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h2 className="text-xl font-extrabold text-black">
                    {result.student?.user?.name || "Student"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {result.class?.displayName || "Class N/A"} •{" "}
                    {result.examType} • {result.session}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 px-5 py-3 text-center">
                  <p className="text-sm font-bold text-green-700">Percentage</p>
                  <p className="text-2xl font-extrabold text-green-700">
                    {result.percentage || 0}%
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-3 text-left">Subject</th>
                      <th className="p-3 text-left">Marks</th>
                      <th className="p-3 text-left">Grade</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.marks?.map((mark) => (
                      <tr key={mark._id} className="border-b">
                        <td className="p-3 font-semibold">
                          {mark.subject?.name || "Subject"}
                        </td>
                        <td className="p-3">
                          {mark.obtained}/{mark.maxMarks}
                        </td>
                        <td className="p-3 font-bold">{mark.grade || "N/A"}</td>
                        <td className="p-3">
                          {mark.isPassed ? "Passed" : "Failed"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 font-bold">
                Total: {result.totalObtained}/{result.totalMarks} | Grade:{" "}
                {result.grade} | {result.isPassed ? "Passed" : "Failed"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Empty text="No results found." />
      )}
    </section>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
      {text}
    </div>
  );
}