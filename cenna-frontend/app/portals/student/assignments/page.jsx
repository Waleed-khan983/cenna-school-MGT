"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentAssignments } from "@/store/assignmentSlice";
import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export default function StudentAssignmentsPage() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const { assignments = [], loading, error } = useSelector(
    (state) => state.assignments || {}
  );

  useEffect(() => {
    dispatch(fetchStudentAssignments());
  }, [dispatch]);

  const filteredAssignments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return assignments;

    return assignments.filter((assignment) => {
      const title = assignment.title?.toLowerCase() || "";
      const subject = assignment.subject?.name?.toLowerCase() || "";
      const teacher = assignment.teacher?.user?.name?.toLowerCase() || "";
      const description = assignment.description?.toLowerCase() || "";

      return (
        title.includes(value) ||
        subject.includes(value) ||
        teacher.includes(value) ||
        description.includes(value)
      );
    });
  }, [assignments, search]);

  if (loading) {
    return <PageLoader text="Loading assignments..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Assignments</h1>
          <p className="mt-1 text-sm text-gray-500">
            View homework, due dates, and files shared by your teachers.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search assignment, subject, teacher..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {filteredAssignments.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map((assignment) => {
            const attachmentUrl = getFileUrl(assignment.attachment);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <div
                key={assignment._id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-extrabold text-black">
                  {assignment.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Subject: {assignment.subject?.name || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Teacher: {assignment.teacher?.user?.name || "N/A"}
                </p>

                <p
                  className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold ${overdue
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                    }`}
                >
                  Due:{" "}
                  {assignment.dueDate
                    ? new Date(assignment.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {assignment.description || "No description"}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {attachmentUrl && (
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                    >
                      Open File
                    </a>
                  )}
                </div>

                <p className="mt-5 text-xs font-semibold text-gray-400">
                  Added:{" "}
                  {assignment.createdAt
                    ? new Date(assignment.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-600">
            No Assignments Found
          </h2>
          <p className="mt-2 text-gray-500">
            Your teachers have not assigned any homework yet.
          </p>
        </div>
      )}
    </section>
  );
}