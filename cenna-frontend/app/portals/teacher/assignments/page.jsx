"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChildrenAssignments } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/\\/g, "/");
  return cleanPath.startsWith("/") ? `${FILE_URL}${cleanPath}` : `${FILE_URL}/${cleanPath}`;
}

export default function ParentAssignmentsPage() {
  const dispatch = useDispatch();

  const { assignments = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenAssignments());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading assignments..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Assignments</h1>
        <p className="mt-2 text-gray-500">
          Check homework, due dates, and teacher attachments.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {assignments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((item) => {
            const fileUrl = getFileUrl(item.attachment);

            return (
              <div key={item._id} className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-black">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Child: {item.childNames?.join(", ") || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Subject: {item.subject?.name || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Teacher: {item.teacher?.user?.name || "N/A"}
                </p>

                <p className="mt-3 rounded-xl bg-yellow-50 p-3 text-sm font-bold text-yellow-700">
                  Due:{" "}
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {item.description || "No description"}
                </p>

                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block rounded-xl bg-black px-4 py-2 text-sm font-bold text-white"
                  >
                    Open File
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty text="No assignments found." />
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