"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchClasses } from "@/store/classSlice";
import { fetchStudents } from "@/store/studentSlice";
import {
  fetchClassAttendance,
  fetchMonthlyAttendanceReport,
} from "@/store/attendanceSlice";

import PageLoader from "@/components/ui/PageLoader";

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminAttendanceReportPage() {
  const dispatch = useDispatch();

  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(todayDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");

  const { classes = [] } = useSelector((state) => state.classes || {});
  const { students = [] } = useSelector((state) => state.students || {});
  const {
    attendance = [],
    report = [],
    loading,
    error,
  } = useSelector((state) => state.attendance || {});

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
  }, [dispatch]);

  const classStudents = useMemo(() => {
    if (!classId) return students;

    return students.filter((student) => {
      const studentClassId =
        typeof student.class === "string" ? student.class : student.class?._id;

      return String(studentClassId) === String(classId);
    });
  }, [students, classId]);

  const dailyRows = useMemo(() => {
    const value = search.toLowerCase().trim();

    return classStudents
      .map((student) => {
        const record = attendance.find((item) => {
          const itemStudentId =
            typeof item.student === "string" ? item.student : item.student?._id;

          return String(itemStudentId) === String(student._id);
        });

        return {
          student,
          status: record?.status || "not-marked",
          remark: record?.remark || "",
        };
      })
      .filter((row) => {
        const name = row.student?.user?.name?.toLowerCase() || "";
        const admissionNo = row.student?.admissionNo?.toLowerCase() || "";

        return !value || name.includes(value) || admissionNo.includes(value);
      });
  }, [classStudents, attendance, search]);

  const dailySummary = useMemo(() => {
    return {
      total: dailyRows.length,
      present: dailyRows.filter((r) => r.status === "present").length,
      absent: dailyRows.filter((r) => r.status === "absent").length,
      late: dailyRows.filter((r) => r.status === "late").length,
      leave: dailyRows.filter((r) => r.status === "leave").length,
      notMarked: dailyRows.filter((r) => r.status === "not-marked").length,
    };
  }, [dailyRows]);

  const loadDailyReport = async () => {
    if (!classId) {
      toast.error("Please select class");
      return;
    }

    try {
      await dispatch(fetchClassAttendance({ classId, date })).unwrap();
      toast.success("Daily attendance report loaded");
    } catch (error) {
      toast.error(error || "Failed to load attendance");
    }
  };

  const loadMonthlyReport = async () => {
    try {
      await dispatch(
        fetchMonthlyAttendanceReport({
          classId,
          month,
          year,
        }),
      ).unwrap();

      toast.success("Monthly attendance report loaded");
    } catch (error) {
      toast.error(error || "Failed to load monthly report");
    }
  };

  if (loading) return <PageLoader text="Loading attendance report..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Attendance Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View daily and monthly class-wise student attendance.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold text-black">
          Daily Attendance Report
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <Select label="Class" value={classId} onChange={setClassId}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.displayName || `${cls.name} - ${cls.section}`}
              </option>
            ))}
          </Select>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input
            label="Search Student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or admission no"
          />

          <button
            type="button"
            onClick={loadDailyReport}
            className="self-end rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
          >
            Load Daily Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Card title="Total" value={dailySummary.total} />
        <Card title="Present" value={dailySummary.present} />
        <Card title="Absent" value={dailySummary.absent} />
        <Card title="Late" value={dailySummary.late} />
        <Card title="Leave" value={dailySummary.leave} />
        <Card title="Not Marked" value={dailySummary.notMarked} />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold text-black">
            Daily Report Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-center">#</th>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Admission No</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-left">Remark</th>
              </tr>
            </thead>

            <tbody>
              {dailyRows.length > 0 ? (
                dailyRows.map((row, index) => (
                  <tr
                    key={row.student._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 text-center font-bold">{index + 1}</td>
                    <td className="p-4 font-semibold">
                      {row.student.user?.name || "N/A"}
                    </td>
                    <td className="p-4">{row.student.admissionNo || "N/A"}</td>
                    <td className="p-4">
                      {row.student.class?.displayName ||
                        `${row.student.class?.name || ""} - ${row.student.class?.section || ""}`}
                    </td>
                    <td className="p-4 text-center">
                      <Status status={row.status} />
                    </td>
                    <td className="p-4">{row.remark || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    Select class and load daily report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold text-black">
          Monthly Attendance Report
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <Select label="Class" value={classId} onChange={setClassId}>
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.displayName || `${cls.name} - ${cls.section}`}
              </option>
            ))}
          </Select>

          <Input
            label="Month"
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <Input
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button
            type="button"
            onClick={loadMonthlyReport}
            className="self-end rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
          >
            Load Monthly Report
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold text-black">
            Monthly Report Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-center">Present</th>
                <th className="p-4 text-center">Absent</th>
                <th className="p-4 text-center">Late</th>
                <th className="p-4 text-center">Leave</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">%</th>
              </tr>
            </thead>

            <tbody>
              {report?.length > 0 ? (
                report.map((item) => (
                  <tr
                    key={item.student?._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      {item.student?.user?.name || "N/A"}
                    </td>
                    <td className="p-4 text-center">{item.present || 0}</td>
                    <td className="p-4 text-center">{item.absent || 0}</td>
                    <td className="p-4 text-center">{item.late || 0}</td>
                    <td className="p-4 text-center">{item.leave || 0}</td>
                    <td className="p-4 text-center">{item.total || 0}</td>
                    <td className="p-4 text-center font-bold">
                      {item.percentage || 0}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    No monthly report loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-black">{value || 0}</h2>
    </div>
  );
}

function Status({ status }) {
  const styles = {
    present: "bg-green-50 text-green-700",
    absent: "bg-red-50 text-red-700",
    late: "bg-yellow-50 text-yellow-700",
    leave: "bg-blue-50 text-blue-700",
    "not-marked": "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || styles["not-marked"]}`}
    >
      {status}
    </span>
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

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}
