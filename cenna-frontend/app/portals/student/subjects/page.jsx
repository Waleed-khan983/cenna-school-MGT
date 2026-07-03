"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

import { fetchMySubjects } from "@/store/studentSubjectSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentSubjectsPage() {
  const dispatch = useDispatch();

  const {
    assignments = [],
    classInfo,
    loading,
    error,
  } = useSelector((state) => state.studentSubjects || {});

  useEffect(() => {
    dispatch(fetchMySubjects());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading subjects..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">My Subjects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Subjects assigned to your class with teacher details.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-gray-400">
          Current Class
        </p>

        <h2 className="mt-1 text-2xl font-extrabold text-black">
          {classInfo?.displayName ||
            `${classInfo?.name || ""} - ${classInfo?.section || ""}` ||
            "N/A"}
        </h2>

        <p className="mt-2 text-sm font-semibold text-gray-500">
          Total Subjects: {assignments.length}
        </p>
      </div>

      {assignments.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {assignments.map((item) => {
            const subject = item.subject;
            const teacher = item.teacher;

            return (
              <div
                key={item._id}
                className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    <FaBook />
                  </div>

                  {subject?.isElective ? (
                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                      Elective
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      Compulsory
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-black">
                  {subject?.name || "N/A"}
                </h3>

                <p className="mt-1 text-sm font-semibold text-gray-500">
                  Code: {subject?.code || "N/A"}
                </p>

                <div className="mt-5 space-y-3">
                  <Info
                    icon={<FaChalkboardTeacher />}
                    label="Teacher"
                    value={teacher?.user?.name || "Not Assigned"}
                  />

                  <Info
                    icon={<FaClipboardList />}
                    label="Max Marks"
                    value={subject?.maxMarks || 100}
                  />

                  <Info
                    icon={<FaCheckCircle />}
                    label="Pass Marks"
                    value={subject?.passMark || 40}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-500">
            No subjects assigned to your class yet.
          </p>
        </div>
      )}
    </section>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
      <div className="text-gray-500">{icon}</div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="font-semibold text-black">{value || "N/A"}</p>
      </div>
    </div>
  );
}
