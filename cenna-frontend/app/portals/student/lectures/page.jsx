"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentLectures } from "@/store/lectureSlice";
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

export default function StudentLecturesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { lectures = [], loading, error } = useSelector(
    (state) => state.lectures || {}
  );

  useEffect(() => {
    dispatch(fetchStudentLectures());
  }, [dispatch]);

  // console.log("token", localStorage.getItem("token"));
  // console.log("userToken", localStorage.getItem("userToken"));
  // console.log("authToken", localStorage.getItem("authToken"));

  const filteredLectures = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return lectures;

    return lectures.filter((lecture) => {
      const title = lecture.title?.toLowerCase() || "";
      const subject = lecture.subject?.name?.toLowerCase() || "";
      const teacher = lecture.teacher?.user?.name?.toLowerCase() || "";

      return (
        title.includes(value) ||
        subject.includes(value) ||
        teacher.includes(value)
      );
    });
  }, [lectures, search]);

  if (loading) {
    return <PageLoader text="Loading lectures..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Lectures</h1>
          <p className="mt-1 text-sm text-gray-500">
            View lecture notes, files, and video links shared by your teachers.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search lecture, subject, teacher..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {filteredLectures.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredLectures.map((lecture) => {
            const attachmentPath = lecture.attachment || lecture.fileUrl;
            const attachmentUrl = getFileUrl(attachmentPath);

            return (
              <div
                key={lecture._id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-extrabold text-black">
                  {lecture.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Subject: {lecture.subject?.name || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Teacher: {lecture.teacher?.user?.name || "N/A"}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {lecture.description || "No description"}
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

                  {lecture.videoUrl && (
                    <a
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-500"
                    >
                      Open Video
                    </a>
                  )}
                </div>

                <p className="mt-5 text-xs font-semibold text-gray-400">
                  Added:{" "}
                  {lecture.createdAt
                    ? new Date(lecture.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-600">
            No Lectures Found
          </h2>
          <p className="mt-2 text-gray-500">
            Your teachers have not uploaded lectures yet.
          </p>
        </div>
      )}
    </section>
  );
}