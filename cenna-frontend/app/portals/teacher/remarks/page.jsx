"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "@/services/api";
import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import {
  fetchMyRemarks,
  addRemark,
  removeRemark,
} from "@/store/remarkSlice";

import PageLoader from "@/components/ui/PageLoader";

const remarkTypes = [
  "Academic",
  "Behavior",
  "Discipline",
  "Performance",
  "General",
];

const initialForm = {
  assignmentId: "",
  studentId: "",
  type: "General",
  isPositive: "true",
  remark: "",
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || "";
};

const getClassName = (cls) => {
  if (!cls) return "Class N/A";
  return cls.displayName || `${cls.name || ""} - ${cls.section || ""}`;
};

export default function TeacherRemarksPage() {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [classStudents, setClassStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const { assignments = [], loading: assignmentsLoading } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const { remarks = [], loading, error } = useSelector(
    (state) => state.remarks || {}
  );

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
    dispatch(fetchMyRemarks());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === form.assignmentId);
  }, [assignments, form.assignmentId]);

  const selectedClassId = useMemo(() => {
    return getId(selectedAssignment?.class) || getId(selectedAssignment?.classId);
  }, [selectedAssignment]);

  useEffect(() => {
    const loadClassStudents = async () => {
      if (!selectedClassId) {
        setClassStudents([]);
        return;
      }

      try {
        setStudentsLoading(true);

        const res = await api.get(`/students/class/${selectedClassId}`);

        setClassStudents(res.data.students || []);

        setForm((prev) => ({
          ...prev,
          studentId: "",
        }));
      } catch (error) {
        setClassStudents([]);
        toast.error(
          error.response?.data?.message || "Failed to load class students"
        );
      } finally {
        setStudentsLoading(false);
      }
    };

    loadClassStudents();
  }, [selectedClassId]);

  const filteredRemarks = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return remarks;

    return remarks.filter((item) => {
      const studentName = item.student?.user?.name?.toLowerCase() || "";
      const className = item.class?.displayName?.toLowerCase() || "";
      const subjectName = item.subject?.name?.toLowerCase() || "";
      const type = item.type?.toLowerCase() || "";
      const text = item.remark?.toLowerCase() || "";

      return (
        studentName.includes(value) ||
        className.includes(value) ||
        subjectName.includes(value) ||
        type.includes(value) ||
        text.includes(value)
      );
    });
  }, [remarks, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment || !selectedClassId) {
      toast.error("Please select class and subject");
      return;
    }

    if (!form.studentId) {
      toast.error("Please select student");
      return;
    }

    if (!form.remark.trim()) {
      toast.error("Remark is required");
      return;
    }

    try {
      await dispatch(
        addRemark({
          studentId: form.studentId,
          classId: selectedClassId,
          subjectId: getId(selectedAssignment.subject),
          type: form.type,
          isPositive: form.isPositive === "true",
          remark: form.remark.trim(),
        })
      ).unwrap();

      toast.success("Remark added successfully");

      setForm(initialForm);
      setClassStudents([]);
      dispatch(fetchMyRemarks());
    } catch (error) {
      toast.error(error || "Failed to add remark");
    }
  };

  const handleDelete = async (remark) => {
    if (!window.confirm("Delete this remark?")) return;

    try {
      await dispatch(removeRemark(remark._id)).unwrap();
      toast.success("Remark deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete remark");
    }
  };

  if (assignmentsLoading) {
    return <PageLoader text="Loading assigned classes..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Remarks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add academic, behavior, discipline, and performance remarks.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search remarks..."
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
          Add Student Remark
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
                {getClassName(item.class || item.classId)} |{" "}
                {item.subject?.name || "Subject"}
              </option>
            ))}
          </Select>

          <Select
            label="Student"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
          >
            <option value="">
              {!selectedAssignment
                ? "Select class first"
                : studentsLoading
                  ? "Loading students..."
                  : classStudents.length === 0
                    ? "No students found"
                    : "Select Student"}
            </option>

            {classStudents.map((student) => (
              <option key={student._id} value={student._id}>
                {student.user?.name || "Unnamed Student"} -{" "}
                {student.admissionNo || "N/A"}
              </option>
            ))}
          </Select>

          <Select
            label="Remark Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {remarkTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Select
            label="Nature"
            name="isPositive"
            value={form.isPositive}
            onChange={handleChange}
          >
            <option value="true">Positive</option>
            <option value="false">Negative</option>
          </Select>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Remark
            </label>

            <textarea
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows={4}
              placeholder="Write remark..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Add Remark"}
        </button>
      </form>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-black">My Remarks</h2>
        <p className="mt-1 text-sm text-gray-500">
          Total remarks: {remarks.length}
        </p>

        {filteredRemarks.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRemarks.map((item) => (
              <div
                key={item._id}
                className={`rounded-2xl border p-5 ${
                  item.isPositive ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <h3 className="text-lg font-extrabold text-black">
                  {item.student?.user?.name || "Student N/A"}
                </h3>

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {item.class?.displayName || "Class N/A"} |{" "}
                  {item.subject?.name || "Subject N/A"}
                </p>

                <p className="mt-2 text-sm font-bold text-gray-700">
                  {item.type || "General"} •{" "}
                  {item.isPositive ? "Positive" : "Negative"}
                </p>

                <p className="mt-3 text-sm text-gray-700">{item.remark}</p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No remarks found.
          </div>
        )}
      </div>
    </section>
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