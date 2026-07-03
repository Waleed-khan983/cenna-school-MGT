"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import {
  fetchStudentsByClassForResult,
  saveTeacherResult,
} from "@/store/teacherResultSlice";

import PageLoader from "@/components/ui/PageLoader";

const examTypes = ["Monthly", "Mid-Term", "Final", "Board"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TeacherResultsPage() {
  const dispatch = useDispatch();

  const [assignmentId, setAssignmentId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examType, setExamType] = useState("Final");
  const [session, setSession] = useState(new Date().getFullYear().toString());
  const [examMonth, setExamMonth] = useState("");
  const [obtained, setObtained] = useState("");
  const [remarks, setRemarks] = useState("");

  const {
    assignments = [],
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useSelector((state) => state.teacherAssignments || {});

  const {
    students = [],
    loading,
    error,
  } = useSelector((state) => state.teacherResults || {});

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === assignmentId);
  }, [assignments, assignmentId]);

  const maxMarks = Number(selectedAssignment?.subject?.maxMarks || 100);

  useEffect(() => {
    if (selectedAssignment?.class?._id) {
      dispatch(fetchStudentsByClassForResult(selectedAssignment.class._id));
      setStudentId("");
      setObtained("");
      setRemarks("");
    }
  }, [dispatch, selectedAssignment]);

  const selectedStudent = useMemo(() => {
    return students.find((student) => student._id === studentId);
  }, [students, studentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment) {
      toast.error("Please select assigned class and subject");
      return;
    }

    if (!studentId) {
      toast.error("Please select student");
      return;
    }

    if (!examType) {
      toast.error("Please select exam type");
      return;
    }

    if (!session.trim()) {
      toast.error("Please enter session");
      return;
    }

    if (obtained === "") {
      toast.error("Please enter obtained marks");
      return;
    }

    const obtainedMarks = Number(obtained);

    if (Number.isNaN(obtainedMarks)) {
      toast.error("Obtained marks must be a number");
      return;
    }

    if (obtainedMarks < 0) {
      toast.error("Obtained marks cannot be negative");
      return;
    }

    if (obtainedMarks > maxMarks) {
      toast.error(`Obtained marks cannot be greater than ${maxMarks}`);
      return;
    }

    const payload = {
      studentId,
      classId: selectedAssignment.class._id,
      examType,
      session: session.trim(),
      examMonth,
      remarks,
      marks: [
        {
          subject: selectedAssignment.subject._id,
          maxMarks,
          obtained: obtainedMarks,
        },
      ],
    };

    try {
      await dispatch(saveTeacherResult(payload)).unwrap();

      toast.success("Result saved successfully");

      setStudentId("");
      setObtained("");
      setRemarks("");
    } catch (error) {
      toast.error(error || "Failed to save result");
    }
  };

  if (assignmentsLoading) {
    return <PageLoader text="Loading assigned subjects..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Enter Results</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter marks only for classes and subjects assigned to you.
        </p>
      </div>

      {(assignmentsError || error) && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {assignmentsError || error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Class & Subject"
            value={assignmentId}
            onChange={(event) => setAssignmentId(event.target.value)}
          >
            <option value="">Select Assigned Subject</option>

            {assignments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.class?.displayName ||
                  `${item.class?.name || ""} - ${
                    item.class?.section || ""
                  }`}{" "}
                | {item.subject?.name || "Subject"}
              </option>
            ))}
          </Select>

          <Select
            label="Student"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            disabled={!selectedAssignment}
          >
            <option value="">
              {selectedAssignment ? "Select Student" : "Select assignment first"}
            </option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.user?.name || "Unnamed Student"} -{" "}
                {student.admissionNo || "N/A"}
              </option>
            ))}
          </Select>

          <Select
            label="Exam Type"
            value={examType}
            onChange={(event) => setExamType(event.target.value)}
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Input
            label="Session"
            value={session}
            onChange={(event) => setSession(event.target.value)}
            placeholder="2026"
          />

          <Select
            label="Exam Month"
            value={examMonth}
            onChange={(event) => setExamMonth(event.target.value)}
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>

          <Input
            label={`Obtained Marks / ${maxMarks}`}
            type="number"
            value={obtained}
            onChange={(event) => setObtained(event.target.value)}
            placeholder={`0 - ${maxMarks}`}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Remarks
            </label>

            <textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              rows={4}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="Optional remarks"
            />
          </div>
        </div>

        {selectedAssignment && (
          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <h3 className="font-extrabold text-black">Selected Record</h3>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <SmallInfo
                label="Class"
                value={
                  selectedAssignment.class?.displayName ||
                  `${selectedAssignment.class?.name || ""} - ${
                    selectedAssignment.class?.section || ""
                  }`
                }
              />

              <SmallInfo
                label="Subject"
                value={selectedAssignment.subject?.name}
              />

              <SmallInfo
                label="Max Marks"
                value={maxMarks}
              />

              <SmallInfo
                label="Student"
                value={selectedStudent?.user?.name || "Not selected"}
              />

              <SmallInfo
                label="Admission No"
                value={selectedStudent?.admissionNo || "N/A"}
              />

              <SmallInfo label="Exam" value={`${examType} ${session}`} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedAssignment}
          className="mt-6 w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {loading ? "Saving..." : "Save Result"}
        </button>
      </form>

      <div className="rounded-3xl border bg-yellow-50 p-5 text-sm font-semibold text-yellow-700">
        Note: If this student already has a result for the same exam and
        session, this subject mark will be added or updated inside the same
        result card.
      </div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, value, onChange, children, disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {children}
      </select>
    </div>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
    </div>
  );
}