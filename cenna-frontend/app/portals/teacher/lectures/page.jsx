"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import {
  fetchMyLectures,
  addLecture,
  removeLecture,
} from "@/store/lectureSlice";

import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const initialForm = {
  assignmentId: "",
  title: "",
  description: "",
  videoUrl: "",
};

function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

export default function TeacherLecturesPage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { assignments = [], loading: assignmentsLoading } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const { lectures = [], loading, error } = useSelector(
    (state) => state.lectures || {}
  );

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
    dispatch(fetchMyLectures());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === form.assignmentId);
  }, [assignments, form.assignmentId]);

  const filteredLectures = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return lectures;

    return lectures.filter((lecture) => {
      const title = lecture.title?.toLowerCase() || "";
      const className = lecture.class?.displayName?.toLowerCase() || "";
      const subject = lecture.subject?.name?.toLowerCase() || "";

      return (
        title.includes(value) ||
        className.includes(value) ||
        subject.includes(value)
      );
    });
  }, [lectures, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      toast.error("Please select class and subject");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("classId", selectedAssignment.class._id);
      formData.append("subjectId", selectedAssignment.subject._id);
      formData.append("title", form.title.trim());
      formData.append("description", form.description || "");
      formData.append("videoUrl", form.videoUrl || "");

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      await dispatch(addLecture(formData)).unwrap();

      toast.success("Lecture added successfully");
      resetForm();
      dispatch(fetchMyLectures());
    } catch (error) {
      toast.error(error || "Failed to add lecture");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lecture) => {
    const confirmed = window.confirm(`Delete lecture "${lecture.title}"?`);

    if (!confirmed) return;

    try {
      await dispatch(removeLecture(lecture._id)).unwrap();
      toast.success("Lecture deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete lecture");
    }
  };

  if (assignmentsLoading) {
    return <PageLoader text="Loading assignments..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Lectures</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload notes, PDFs, slides, and lecture links for assigned classes.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search lecture, class, subject..."
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-extrabold text-black">
          Add New Lecture
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Class & Subject"
            name="assignmentId"
            value={form.assignmentId}
            onChange={handleChange}
          >
            <option value="">Select Assignment</option>

            {assignments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.class?.displayName ||
                  `${item.class?.name || ""} - ${item.class?.section || ""}`}{" "}
                | {item.subject?.name || "Subject"}
              </option>
            ))}
          </Select>

          <Input
            label="Lecture Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Chapter 1 - Introduction"
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short lecture details..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Upload File
            </label>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />

            <p className="mt-2 text-xs font-semibold text-gray-500">
              Allowed: PDF, DOC, PPT, JPG, PNG. Max size depends on backend.
            </p>

            {selectedFile && (
              <p className="mt-2 text-sm font-bold text-green-700">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <Input
            label="Video URL"
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="YouTube / Google Drive / Zoom recording"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Adding Lecture..." : "Add Lecture"}
        </button>
      </form>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black">My Lectures</h2>
            <p className="mt-1 text-sm text-gray-500">
              Total lectures: {lectures.length}
            </p>
          </div>

          {loading && (
            <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
              Refreshing...
            </span>
          )}
        </div>

        {filteredLectures.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredLectures.map((lecture) => {
              const attachmentPath = lecture.attachment || lecture.fileUrl;
              const attachmentUrl = getFileUrl(attachmentPath);

              return (
                <div
                  key={lecture._id}
                  className="rounded-2xl border bg-gray-50 p-5"
                >
                  <h3 className="text-lg font-extrabold text-black">
                    {lecture.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    {lecture.class?.displayName || "Class N/A"} |{" "}
                    {lecture.subject?.name || "Subject N/A"}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {lecture.description || "No description"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {attachmentUrl && (
                      <a
                        href={attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
                      >
                        Open File
                      </a>
                    )}

                    {lecture.videoUrl && (
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500"
                      >
                        Open Video
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(lecture)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-gray-400">
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
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No lectures found.
          </div>
        )}
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}