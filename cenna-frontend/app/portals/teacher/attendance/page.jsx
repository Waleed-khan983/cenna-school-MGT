"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import { fetchStudents } from "@/store/studentSlice";
import { markAttendance } from "@/store/attendanceSlice";
import PageLoader from "@/components/ui/PageLoader";

const statuses = ["present", "absent", "late", "leave"];

const todayDate = () => new Date().toISOString().split("T")[0];

export default function TeacherAttendancePage() {
  const dispatch = useDispatch();

  const [assignmentId, setAssignmentId] = useState("");
  const [date, setDate] = useState(todayDate());
  const [period, setPeriod] = useState("1");
  const [records, setRecords] = useState({});

  const { assignments = [], loading: assignmentLoading } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const { students = [], loading: studentLoading } = useSelector(
    (state) => state.students || {}
  );

  const { loading: attendanceLoading } = useSelector(
    (state) => state.attendance || {}
  );

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
  }, [dispatch]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((item) => item._id === assignmentId);
  }, [assignments, assignmentId]);

  const classId = selectedAssignment?.class?._id;
  const subjectId = selectedAssignment?.subject?._id;

  useEffect(() => {
    if (classId) {
      dispatch(fetchStudents({ class: classId }));
    }
  }, [dispatch, classId]);

  const classStudents = useMemo(() => {
    if (!classId) return [];

    return students.filter((student) => {
      const studentClassId =
        typeof student.class === "string" ? student.class : student.class?._id;

      return String(studentClassId) === String(classId);
    });
  }, [students, classId]);

  useEffect(() => {
    const initial = {};

    classStudents.forEach((student) => {
      initial[student._id] = {
        studentId: student._id,
        status: "present",
        remark: "",
      };
    });

    setRecords(initial);
  }, [classStudents]);

  const changeStatus = (studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        status,
      },
    }));
  };

  const changeRemark = (studentId, remark) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        remark,
      },
    }));
  };

  const markAll = (status) => {
    const updated = {};

    classStudents.forEach((student) => {
      updated[student._id] = {
        studentId: student._id,
        status,
        remark: records[student._id]?.remark || "",
      };
    });

    setRecords(updated);
  };

  const handleSubmit = async () => {
    if (!assignmentId || !classId || !subjectId) {
      toast.error("Please select class and subject");
      return;
    }

    if (!period || Number(period) < 1) {
      toast.error("Please select period");
      return;
    }

    if (classStudents.length === 0) {
      toast.error("No students found in this class");
      return;
    }

    try {
      await dispatch(
        markAttendance({
          classId,
          subjectId,
          period: Number(period),
          date,
          records: Object.values(records),
        })
      ).unwrap();

      toast.success("Attendance saved successfully");
    } catch (error) {
      toast.error(error || "Failed to save attendance");
    }
  };

  if (assignmentLoading) {
    return <PageLoader text="Loading assigned subjects..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Mark Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select assigned class-subject, period, and mark attendance.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Class & Subject
          </label>

          <select
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option value="">Select Assignment</option>

            {assignments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.class?.displayName ||
                  `${item.class?.name || ""} - ${item.class?.section || ""}`}{" "}
                | {item.subject?.name || "Subject"}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Period
          </label>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option value="1">Period 1</option>
            <option value="2">Period 2</option>
            <option value="3">Period 3</option>
            <option value="4">Period 4</option>
            <option value="5">Period 5</option>
            <option value="6">Period 6</option>
            <option value="7">Period 7</option>
            <option value="8">Period 8</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            attendanceLoading || !assignmentId || classStudents.length === 0
          }
          className="self-end cursor-pointer rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {attendanceLoading ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      {assignmentId && (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-black">
                Students Attendance
              </h2>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                {selectedAssignment?.class?.displayName || "Class"} |{" "}
                {selectedAssignment?.subject?.name || "Subject"} | Period{" "}
                {period}
              </p>
            </div>

            {classStudents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <BulkButton text="All Present" onClick={() => markAll("present")} />
                <BulkButton text="All Absent" onClick={() => markAll("absent")} />
                <BulkButton text="All Late" onClick={() => markAll("late")} />
                <BulkButton text="All Leave" onClick={() => markAll("leave")} />
              </div>
            )}
          </div>

          {studentLoading ? (
            <PageLoader text="Loading students..." />
          ) : classStudents.length > 0 ? (
            <div className="space-y-3">
              {classStudents.map((student, index) => (
                <div
                  key={student._id}
                  className="rounded-2xl border bg-gray-50 p-4"
                >
                  <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-extrabold text-black">
                        {index + 1}. {student.user?.name || "N/A"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Admission No: {student.admissionNo || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <StatusButton
                        key={status}
                        status={status}
                        active={records[student._id]?.status === status}
                        onClick={() => changeStatus(student._id, status)}
                      />
                    ))}
                  </div>

                  <input
                    value={records[student._id]?.remark || ""}
                    onChange={(e) => changeRemark(student._id, e.target.value)}
                    placeholder="Optional remark"
                    className="mt-3 w-full rounded-xl border bg-white px-3 py-2 outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
              No students found in this class.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StatusButton({ status, active, onClick }) {
  const styles = {
    present: active
      ? "bg-green-600 text-white"
      : "bg-green-100 text-green-700",
    absent: active ? "bg-red-600 text-white" : "bg-red-100 text-red-700",
    late: active
      ? "bg-yellow-500 text-black"
      : "bg-yellow-100 text-yellow-700",
    leave: active ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-bold capitalize transition ${styles[status]}`}
    >
      {status}
    </button>
  );
}

function BulkButton({ text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-gray-700"
    >
      {text}
    </button>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}