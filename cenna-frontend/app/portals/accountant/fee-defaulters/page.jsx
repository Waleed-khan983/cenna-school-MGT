"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaDownload,
  FaExclamationTriangle,
  FaFilePdf,
  FaPhoneAlt,
  FaPrint,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { fetchDefaulters } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function AccountantFeeDefaultersPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");

  const { defaulters = [], loading, error } = useSelector(
    (state) => state.fees || {}
  );

  useEffect(() => {
    dispatch(fetchDefaulters());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const value = search.toLowerCase().trim();

    return defaulters.filter((fee) => {
      const studentName = fee.student?.user?.name?.toLowerCase() || "";
      const admissionNo = fee.student?.admissionNo?.toLowerCase() || "";
      const fatherName = fee.student?.fatherName?.toLowerCase() || "";
      const phone = fee.student?.user?.phone?.toLowerCase() || "";
      const className = fee.student?.class?.displayName?.toLowerCase() || "";
      const feeMonth = fee.month || "";

      const matchSearch =
        !value ||
        studentName.includes(value) ||
        admissionNo.includes(value) ||
        fatherName.includes(value) ||
        phone.includes(value) ||
        className.includes(value);

      const matchStatus = !status || fee.status === status;
      const matchMonth = !month || feeMonth === month;

      return matchSearch && matchStatus && matchMonth;
    });
  }, [defaulters, search, status, month]);

  const groupedStudents = useMemo(() => {
    const map = {};

    filtered.forEach((fee) => {
      const studentId = fee.student?._id || fee.student || "unknown";

      if (!map[studentId]) {
        map[studentId] = {
          studentId,
          student: fee.student,
          records: [],
          totalDue: 0,
          totalPaid: 0,
          balance: 0,
          oldestDueDate: fee.dueDate || null,
        };
      }

      const total = Number(fee.totalAmount || 0);
      const paid = Number(fee.paidAmount || 0);
      const balance = Math.max(total - paid, 0);

      map[studentId].records.push(fee);
      map[studentId].totalDue += total;
      map[studentId].totalPaid += paid;
      map[studentId].balance += balance;

      if (
        fee.dueDate &&
        (!map[studentId].oldestDueDate ||
          new Date(fee.dueDate) < new Date(map[studentId].oldestDueDate))
      ) {
        map[studentId].oldestDueDate = fee.dueDate;
      }
    });

    return Object.values(map).sort((a, b) => b.balance - a.balance);
  }, [filtered]);

  const stats = useMemo(() => {
    return groupedStudents.reduce(
      (acc, item) => {
        acc.students += 1;
        acc.balance += item.balance;
        acc.records += item.records.length;

        if (item.oldestDueDate && new Date(item.oldestDueDate) < new Date()) {
          acc.overdue += 1;
        }

        return acc;
      },
      { students: 0, balance: 0, records: 0, overdue: 0 }
    );
  }, [groupedStudents]);

  const months = useMemo(() => {
    return [...new Set(defaulters.map((fee) => fee.month).filter(Boolean))];
  }, [defaulters]);

  if (loading) {
    return <PageLoader text="Loading fee defaulters..." />;
  }

  return (
    <section className="space-y-6 bg-[#f8fafc] p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Fee Defaulters
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track unpaid and partial fee balances by student.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => printDefaulters(groupedStudents, stats)}
            className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3 font-bold text-black hover:bg-gray-50"
          >
            <FaPrint /> Print
          </button>

          <button
            type="button"
            onClick={() => printDefaulters(groupedStudents, stats)}
            className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Defaulter Students" value={stats.students} />
        <StatCard title="Pending Records" value={stats.records} />
        <StatCard title="Overdue Students" value={stats.overdue} danger />
        <StatCard title="Outstanding Balance" value={`Rs. ${stats.balance}`} danger />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_160px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission no, father, phone, class..."
              className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
            />
          </div>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none"
          >
            <option value="">All Months</option>
            {months.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none"
          >
            <option value="">All Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
          </select>

          <button
            type="button"
            className="rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            Search
          </button>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-extrabold text-black">
            Defaulter List
          </h2>
          <p className="text-sm font-bold text-gray-500">
            Total: {groupedStudents.length}
          </p>
        </div>

        {groupedStudents.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {groupedStudents.map((item) => (
              <DefaulterCard key={item.studentId} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-10 text-center font-semibold text-gray-500">
            No defaulters found.
          </div>
        )}
      </div>
    </section>
  );
}

function DefaulterCard({ item }) {
  const student = item.student;
  const phone = student?.user?.phone || "";
  const overdueDays = getOverdueDays(item.oldestDueDate);

  const whatsappText = encodeURIComponent(
    `Assalamualaikum, this is a reminder from CENNA School. Your child ${student?.user?.name || ""
    } has pending fee balance Rs. ${item.balance}. Please clear it soon.`
  );

  return (
    <div className="rounded-3xl border bg-gray-50 p-5 transition hover:border-yellow-400 hover:bg-white hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <FaExclamationTriangle />
            </div>

            <div>
              <h3 className="truncate text-lg font-extrabold text-black">
                {student?.user?.name || "Student"}
              </h3>
              <p className="text-sm text-gray-500">
                {student?.admissionNo || "N/A"} •{" "}
                {student?.class?.displayName || "Class N/A"}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Father: <b>{student?.fatherName || "N/A"}</b>
          </p>
          <p className="text-sm text-gray-500">
            Phone: <b>{phone || "N/A"}</b>
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 px-5 py-4 text-right">
          <p className="text-xs font-bold uppercase text-red-500">Balance</p>
          <p className="text-2xl font-extrabold text-red-600">
            Rs. {item.balance}
          </p>
          <p className="mt-1 text-xs font-semibold text-red-500">
            {overdueDays > 0 ? `${overdueDays} days overdue` : "Pending"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {item.records.map((fee) => {
          const balance = Math.max(
            Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
            0
          );

          return (
            <div key={fee._id} className="rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-extrabold text-black">
                  {fee.month} {fee.year}
                </p>
                <Status status={fee.status} />
              </div>

              <div className="mt-3 grid gap-2">
                <Info label="Total" value={`Rs. ${fee.totalAmount || 0}`} />
                <Info label="Paid" value={`Rs. ${fee.paidAmount || 0}`} />
                <Info label="Balance" value={`Rs. ${balance}`} danger />
                <Info
                  label="Due"
                  value={
                    fee.dueDate
                      ? new Date(fee.dueDate).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link
          href={`/portals/accountant/fee-collection?studentId=${student?._id}`}
          className="rounded-2xl bg-black px-4 py-3 text-center text-sm font-extrabold text-white hover:bg-gray-800"
        >
          Collect Fee
        </Link>

        <a
          href={phone ? `tel:${phone}` : "#"}
          className="flex items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm font-extrabold text-black hover:bg-gray-50"
        >
          <FaPhoneAlt />
          Call
        </a>

        <a
          href={phone ? `https://wa.me/${cleanPhone(phone)}?text=${whatsappText}` : "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-green-600"
        >
          <FaWhatsapp />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

function StatCard({ title, value, danger }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2
        className={`mt-2 text-3xl font-extrabold ${danger ? "text-red-600" : "text-black"
          }`}
      >
        {value}
      </h2>
    </div>
  );
}

function Info({ label, value, danger }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className={`text-sm font-extrabold ${danger ? "text-red-600" : "text-black"}`}>
        {value}
      </p>
    </div>
  );
}

function Status({ status }) {
  const styles = {
    Unpaid: "bg-red-100 text-red-700",
    Partial: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${styles[status] || "bg-gray-100 text-gray-700"
        }`}
    >
      {status || "N/A"}
    </span>
  );
}

function getOverdueDays(date) {
  if (!date) return 0;

  const due = new Date(date);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (due >= today) return 0;

  return Math.floor((today - due) / (1000 * 60 * 60 * 24));
}

function cleanPhone(phone) {
  let value = String(phone || "").replace(/\D/g, "");

  if (value.startsWith("0")) {
    value = `92${value.slice(1)}`;
  }

  return value;
}

function printDefaulters(items, stats) {
  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.student?.user?.name || "N/A"}</td>
          <td>${item.student?.admissionNo || "N/A"}</td>
          <td>${item.student?.class?.displayName || "N/A"}</td>
          <td>${item.student?.fatherName || "N/A"}</td>
          <td>${item.student?.user?.phone || "N/A"}</td>
          <td>${item.records.length}</td>
          <td>Rs. ${item.balance}</td>
        </tr>
      `
    )
    .join("");

  const w = window.open("", "_blank");

  w.document.write(`
    <html>
      <head>
        <title>Fee Defaulters Report</title>
        <style>
          body { font-family: Arial; padding: 30px; color: #111; }
          h1 { margin: 0; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .card { border: 1px solid #ddd; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #111; padding: 8px; text-align: left; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h1>CENNA School & College Pabbi</h1>
        <p>Fee Defaulters Report</p>

        <div class="summary">
          <div class="card"><b>Students</b><br/>${stats.students}</div>
          <div class="card"><b>Records</b><br/>${stats.records}</div>
          <div class="card"><b>Overdue</b><br/>${stats.overdue}</div>
          <div class="card"><b>Balance</b><br/>Rs. ${stats.balance}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Admission</th>
              <th>Class</th>
              <th>Father</th>
              <th>Phone</th>
              <th>Records</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <script>window.onload = function(){ window.print(); }</script>
      </body>
    </html>
  `);

  w.document.close();
}