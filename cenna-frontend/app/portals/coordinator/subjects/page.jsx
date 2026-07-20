"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSubjects } from "@/store/subjectSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function CoordinatorSubjectsPage() {
  const dispatch = useDispatch();

  const { subjects = [], loading, error } = useSelector(
    (state) => state.subjects || {}
  );

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading subjects..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Subjects</h1>
      <p className="mb-6 text-gray-500">Monitor active subjects across the school.</p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && subjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {subjects.map((subject) => (
            <div key={subject._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black">{subject.name}</h2>
              <p className="mt-2 text-gray-500">Code: {subject.code || "N/A"}</p>
              <p className="text-gray-500">
                Max Marks: {subject.maxMarks ?? "N/A"} · Pass Mark:{" "}
                {subject.passMark ?? "N/A"}
              </p>
              {subject.isElective && (
                <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  Elective
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No subjects found.
          </div>
        )
      )}
    </section>
  );
}
