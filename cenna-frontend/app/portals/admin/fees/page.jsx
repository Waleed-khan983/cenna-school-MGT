"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchClasses } from "@/store/classSlice";
import { fetchStudents } from "@/store/studentSlice";
import { fetchFees } from "@/store/feeSlice";

import PageLoader from "@/components/ui/PageLoader";

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

export default function AdminFeesReportPage() {
  const dispatch = useDispatch();

  const [classId, setClassId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { classes = [] } = useSelector((state) => state.classes || {});
  const { students = [] } = useSelector((state) => state.students || {});
  const {
    fees = [],
    loading,
    error,
  } = useSelector((state) => state.fees || {});

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchFees());
  }, [dispatch]);

  const classStudents = useMemo(() => {
    if (!classId) return students;

    return students.filter((student) => {
      const studentClassId =
        typeof student.class === "string" ? student.class : student.class?._id;

      return String(studentClassId) === String(classId);
    });
  }, [students, classId]);

  const reportRows = useMemo(() => {
    const value = search.toLowerCase().trim();

    return classStudents
      .map((student) => {
        const studentFees = fees.filter((fee) => {
          const feeStudentId =
            typeof fee.student === "string" ? fee.student : fee.student?._id;

          const matchesStudent = String(feeStudentId) === String(student._id);
          const matchesMonth = !month || fee.month === month;
          const matchesYear = !year || Number(fee.year) === Number(year);
          const matchesStatus = !status || fee.status === status;

          return matchesStudent && matchesMonth && matchesYear && matchesStatus;
        });

        const totalAmount = studentFees.reduce(
          (sum, fee) => sum + Number(fee.totalAmount || 0),
          0,
        );

        const paidAmount = studentFees.reduce(
          (sum, fee) => sum + Number(fee.paidAmount || 0),
          0,
        );

        const latestFee = studentFees[0];

        return {
          student,
          fees: studentFees,
          totalAmount,
          paidAmount,
          pendingAmount: Math.max(totalAmount - paidAmount, 0),
          status: latestFee?.status || "No Challan",
        };
      })
      .filter((row) => {
        const name = row.student?.user?.name?.toLowerCase() || "";
        const admissionNo = row.student?.admissionNo?.toLowerCase() || "";

        return !value || name.includes(value) || admissionNo.includes(value);
      });
  }, [classStudents, fees, month, year, status, search]);

  const summary = useMemo(() => {
    const paid = reportRows.filter((row) => row.status === "Paid").length;
    const unpaid = reportRows.filter((row) => row.status === "Unpaid").length;
    const partial = reportRows.filter((row) => row.status === "Partial").length;
    const noChallan = reportRows.filter(
      (row) => row.status === "No Challan",
    ).length;

    const totalAmount = reportRows.reduce(
      (sum, row) => sum + Number(row.totalAmount || 0),
      0,
    );

    const paidAmount = reportRows.reduce(
      (sum, row) => sum + Number(row.paidAmount || 0),
      0,
    );

    return {
      totalStudents: reportRows.length,
      paid,
      unpaid,
      partial,
      noChallan,
      totalAmount,
      paidAmount,
      pendingAmount: Math.max(totalAmount - paidAmount, 0),
    };
  }, [reportRows]);

  if (loading) return <PageLoader text="Loading fee report..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Fee Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          View class-wise paid, unpaid, partial, and pending fee records.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5">
        <Select label="Class" value={classId} onChange={setClassId}>
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.displayName || `${cls.name} - ${cls.section}`}
            </option>
          ))}
        </Select>

        <Select label="Month" value={month} onChange={setMonth}>
          <option value="">All Months</option>
          {months.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>

        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <Select label="Status" value={status} onChange={setStatus}>
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
          <option value="Waived">Waived</option>
        </Select>

        <Input
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name or admission no"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Students" value={summary.totalStudents} />
        <Card title="Paid Students" value={summary.paid} />
        <Card title="Unpaid Students" value={summary.unpaid} />
        <Card title="Partial Paid" value={summary.partial} />
        <Card title="No Challan" value={summary.noChallan} />
        <Card title="Total Fee" value={summary.totalAmount} />
        <Card title="Collected" value={summary.paidAmount} />
        <Card title="Pending" value={summary.pendingAmount} />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-center">#</th>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Admission No</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-center">Challans</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Paid</th>
                <th className="p-4 text-center">Pending</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {reportRows.length > 0 ? (
                reportRows.map((row, index) => (
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
                    <td className="p-4 text-center">{row.fees.length}</td>
                    <td className="p-4 text-center font-bold">
                      {row.totalAmount}
                    </td>
                    <td className="p-4 text-center text-green-700">
                      {row.paidAmount}
                    </td>
                    <td className="p-4 text-center text-red-700">
                      {row.pendingAmount}
                    </td>
                    <td className="p-4 text-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    No fee report found.
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
