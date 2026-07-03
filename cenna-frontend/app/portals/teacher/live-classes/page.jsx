"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import {
  fetchMyLiveClasses,
  addLiveClass,
  removeLiveClass,
  fetchLiveClassAttendance,
} from "@/store/liveClassSlice";

import PageLoader from "@/components/ui/PageLoader";

const initialForm = {
  assignmentId: "",
  title: "",
  startTime: "",
  endTime: "",
  description: "",
};

export default function TeacherLiveClassesPage() {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedLiveClass, setSelectedLiveClass] = useState(null);

  const { assignments = [], loading: assignmentsLoading } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const {
    liveClasses = [],
    attendanceRecords = [],
    loading,
    error,
  } = useSelector((state) => state.liveClasses || {});

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
    dispatch(fetchMyLiveClasses());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === form.assignmentId);
  }, [assignments, form.assignmentId]);

  const filteredLiveClasses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return liveClasses;

    return liveClasses.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const className = item.class?.displayName?.toLowerCase() || "";
      const subjectName = item.subject?.name?.toLowerCase() || "";

      return (
        title.includes(value) ||
        className.includes(value) ||
        subjectName.includes(value)
      );
    });
  }, [liveClasses, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      toast.error("Please select class and subject");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Live class title is required");
      return;
    }

    if (!form.startTime) {
      toast.error("Start time is required");
      return;
    }

    if (!form.endTime) {
      toast.error("End time is required");
      return;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      await dispatch(
        addLiveClass({
          classId: selectedAssignment.class._id,
          subjectId: selectedAssignment.subject._id,
          title: form.title.trim(),
          startTime: form.startTime,
          endTime: form.endTime,
          description: form.description,
        })
      ).unwrap();

      toast.success("Jitsi live class scheduled successfully");
      setForm(initialForm);
      dispatch(fetchMyLiveClasses());
    } catch (error) {
      toast.error(error || "Failed to schedule live class");
    }
  };

  const handleDelete = async (liveClass) => {
    const confirmed = window.confirm(`Delete "${liveClass.title}"?`);

    if (!confirmed) return;

    try {
      await dispatch(removeLiveClass(liveClass._id)).unwrap();
      toast.success("Live class deleted successfully");

      if (selectedLiveClass?._id === liveClass._id) {
        setSelectedLiveClass(null);
      }
    } catch (error) {
      toast.error(error || "Failed to delete live class");
    }
  };

  const handleViewAttendance = async (liveClass) => {
    try {
      setSelectedLiveClass(liveClass);
      await dispatch(fetchLiveClassAttendance(liveClass._id)).unwrap();
    } catch (error) {
      toast.error(error || "Failed to load attendance");
    }
  };

  if (assignmentsLoading) {
    return <PageLoader text="Loading assigned classes..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Live Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule Jitsi live classes and track joined students.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search live class, class, subject..."
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
          Schedule Jitsi Class
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
            label="Live Class Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Biology Live Class"
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Platform
            </label>

            <input
              value="Jitsi Meet"
              disabled
              className="w-full rounded-xl border bg-gray-100 px-4 py-3 font-semibold text-gray-600"
            />
          </div>

          <Input
            label="Start Time"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
          />

          <Input
            label="End Time"
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
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
              placeholder="Class details..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Scheduling..." : "Schedule Jitsi Class"}
        </button>
      </form>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-black">
          My Scheduled Live Classes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Total live classes: {liveClasses.length}
        </p>

        {filteredLiveClasses.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredLiveClasses.map((liveClass) => (
              <div
                key={liveClass._id}
                className="rounded-2xl border bg-gray-50 p-5"
              >
                <h3 className="text-lg font-extrabold text-black">
                  {liveClass.title}
                </h3>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {liveClass.class?.displayName || "Class N/A"} |{" "}
                  {liveClass.subject?.name || "Subject N/A"}
                </p>

                <p className="mt-2 text-sm font-bold text-gray-700">
                  Platform: {liveClass.meetingPlatform || "Jitsi"}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Start:{" "}
                  {liveClass.startTime
                    ? new Date(liveClass.startTime).toLocaleString()
                    : "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  End:{" "}
                  {liveClass.endTime
                    ? new Date(liveClass.endTime).toLocaleString()
                    : "N/A"}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {liveClass.description || "No description"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={liveClass.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500"
                  >
                    Join Class
                  </a>

                  <button
                    type="button"
                    onClick={() => handleViewAttendance(liveClass)}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
                  >
                    Attendance
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(liveClass)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>

                <p className="mt-4 break-all text-xs font-semibold text-gray-400">
                  {liveClass.meetingLink}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No live classes found.
          </div>
        )}
      </div>

      {selectedLiveClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  Class Attendance
                </h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {selectedLiveClass.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLiveClass(null)}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500"
              >
                Close
              </button>
            </div>

            <div className="mb-5 rounded-2xl bg-gray-50 p-4">
              <p className="font-bold text-black">
                {selectedLiveClass.class?.displayName || "Class N/A"} |{" "}
                {selectedLiveClass.subject?.name || "Subject N/A"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total Joined Students: {attendanceRecords.length}
              </p>
            </div>

            {attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords.map((record, index) => (
                  <div key={record._id} className="rounded-xl border p-4">
                    <p className="font-bold text-black">
                      {index + 1}. {record.student?.user?.name || "Student"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Email: {record.student?.user?.email || "N/A"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Joined:{" "}
                      {record.joinedAt
                        ? new Date(record.joinedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-gray-100 p-6 text-center font-semibold text-gray-500">
                No students have joined this class yet.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
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