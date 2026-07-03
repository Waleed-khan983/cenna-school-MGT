"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyResults } from "@/store/studentResultSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentResultPage() {
  const dispatch = useDispatch();

  const { results = [], loading, error } = useSelector(
    (state) => state.studentResults || {}
  );

  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    dispatch(fetchMyResults());
  }, [dispatch]);

  const latestResult = results?.[0];

  if (loading) return <PageLoader text="Loading results..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">My Results</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your published exam results and marks details.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-4">
        <Card title="Total Results" value={results.length} />
        <Card
          title="Latest Percentage"
          value={latestResult ? `${latestResult.percentage}%` : "0%"}
        />
        <Card title="Latest Grade" value={latestResult?.grade || "N/A"} />
        <Card
          title="Status"
          value={latestResult?.isPassed ? "Pass" : latestResult ? "Fail" : "N/A"}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold text-black">Result Records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Exam</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-center">Session</th>
                <th className="p-4 text-center">Obtained</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Percentage</th>
                <th className="p-4 text-center">Grade</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {results.length > 0 ? (
                results.map((result) => (
                  <tr key={result._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-black">
                      {result.examType}
                      {result.examMonth && (
                        <p className="mt-1 text-xs font-medium text-gray-500">
                          {result.examMonth}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      {result.class?.displayName ||
                        `${result.class?.name || ""} - ${
                          result.class?.section || ""
                        }`}
                    </td>

                    <td className="p-4 text-center">{result.session}</td>
                    <td className="p-4 text-center">{result.totalObtained}</td>
                    <td className="p-4 text-center">{result.totalMarks}</td>
                    <td className="p-4 text-center font-bold">
                      {result.percentage}%
                    </td>
                    <td className="p-4 text-center font-bold">{result.grade}</td>

                    <td className="p-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          result.isPassed
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {result.isPassed ? "Pass" : "Fail"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedResult(result)}
                        className="cursor-pointer rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    No result records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedResult && (
        <ResultModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-black">{value}</h2>
    </div>
  );
}

function ResultModal({ result, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:static print:bg-white print:p-0">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl print:max-h-none print:max-w-none print:shadow-none">
        <div className="mb-5 flex items-center justify-between print:hidden">
          <h2 className="text-2xl font-extrabold text-black">Result Details</h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
            >
              Print
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="border-b pb-4 text-center">
            <h1 className="text-2xl font-extrabold uppercase text-black">
              CENNA School & College
            </h1>
            <p className="mt-1 text-sm font-semibold text-gray-500">
              Student Result Card
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Info label="Exam Type" value={result.examType} />
            <Info label="Session" value={result.session} />
            <Info label="Class" value={result.class?.displayName} />
            <Info label="Exam Month" value={result.examMonth} />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-center">Max Marks</th>
                  <th className="p-3 text-center">Obtained</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {result.marks?.map((mark) => (
                  <tr key={mark._id} className="border-b">
                    <td className="p-3 font-semibold">
                      {mark.subject?.name || "N/A"}
                    </td>
                    <td className="p-3 text-center">{mark.maxMarks}</td>
                    <td className="p-3 text-center">{mark.obtained}</td>
                    <td className="p-3 text-center font-bold">{mark.grade}</td>
                    <td className="p-3 text-center">
                      {mark.isPassed ? "Pass" : "Fail"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <Info label="Total Marks" value={result.totalMarks} />
            <Info label="Obtained" value={result.totalObtained} />
            <Info label="Percentage" value={`${result.percentage}%`} />
            <Info label="Grade" value={result.grade} />
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-400">Remarks</p>
            <p className="mt-1 font-semibold text-black">
              {result.remarks || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
    </div>
  );
}