"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaDownload,
  FaEye,
  FaPrint,
  FaSearch,
  FaUsers,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import { fetchFees } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function AccountantPaymentHistoryPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { fees = [], loading, error } = useSelector((state) => state.fees || {});

  useEffect(() => {
    dispatch(fetchFees());
  }, [dispatch]);

  const groupedStudents = useMemo(() => {
    const map = {};

    fees.forEach((fee) => {
      const studentId = fee.student?._id || fee.student || "unknown";

      if (!map[studentId]) {
        map[studentId] = {
          studentId,
          student: fee.student,
          class: fee.student?.class || fee.class,
          records: [],
          totalFee: 0,
          totalPaid: 0,
          balance: 0,
          status: "Paid",
          lastPayment: null,
        };
      }

      const total = Number(fee.totalAmount || 0);
      const paid = Number(fee.paidAmount || 0);
      const balance = Math.max(total - paid, 0);

      map[studentId].records.push(fee);
      map[studentId].totalFee += total;
      map[studentId].totalPaid += paid;
      map[studentId].balance += balance;

      if (balance > 0 && paid > 0) map[studentId].status = "Partial";
      if (balance > 0 && paid === 0) map[studentId].status = "Unpaid";

      if (fee.paidDate) {
        const date = new Date(fee.paidDate);
        if (!map[studentId].lastPayment || date > map[studentId].lastPayment) {
          map[studentId].lastPayment = date;
        }
      }
    });

    return Object.values(map);
  }, [fees]);

  const classes = useMemo(() => {
    const map = {};

    groupedStudents.forEach((item) => {
      const cls = item.class;
      const id = cls?._id || cls;

      if (id) {
        map[id] = {
          _id: id,
          displayName: cls?.displayName || "Class N/A",
        };
      }
    });

    return Object.values(map);
  }, [groupedStudents]);

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    return groupedStudents.filter((item) => {
      const name = item.student?.user?.name?.toLowerCase() || "";
      const admissionNo = item.student?.admissionNo?.toLowerCase() || "";
      const fatherName = item.student?.fatherName?.toLowerCase() || "";
      const phone = item.student?.user?.phone?.toLowerCase() || "";
      const className = item.class?.displayName?.toLowerCase() || "";
      const itemClassId = item.class?._id || item.class;

      const matchSearch =
        !value ||
        name.includes(value) ||
        admissionNo.includes(value) ||
        fatherName.includes(value) ||
        phone.includes(value) ||
        className.includes(value);

      const matchStatus = !status || item.status === status;
      const matchClass = !classId || String(itemClassId) === String(classId);

      return matchSearch && matchStatus && matchClass;
    });
  }, [groupedStudents, search, status, classId]);

  const stats = useMemo(() => {
    return filteredStudents.reduce(
      (acc, item) => {
        acc.students += 1;
        acc.totalFee += item.totalFee;
        acc.totalPaid += item.totalPaid;
        acc.totalBalance += item.balance;
        return acc;
      },
      { students: 0, totalFee: 0, totalPaid: 0, totalBalance: 0 }
    );
  }, [filteredStudents]);

  useEffect(() => {
    if (!selectedStudent && filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0]);
    }
  }, [filteredStudents, selectedStudent]);

  const handleExportPDF = () => {
    printReport(filteredStudents, stats);
  };

  if (loading) {
    return <PageLoader text="Loading payment history..." />;
  }

  return (
    <section className="space-y-6 bg-[#f8fafc] p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Payment History</h1>
          <p className="mt-2 text-sm text-gray-500">Dashboard &gt; Payment History</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-xl border bg-white px-5 py-3 font-bold text-black hover:bg-gray-50"
          >
            <FaDownload /> Export PDF
          </button>

          <button
            type="button"
            onClick={() => selectedStudent && printReceipt(selectedStudent)}
            className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300"
          >
            <FaPrint /> Print Receipt
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<FaUsers />} title="Total Students" value={stats.students} subtitle="All Students" color="yellow" />
        <StatCard icon={<FaFileInvoiceDollar />} title="Total Fee" value={`Rs. ${stats.totalFee}`} subtitle="All Students" color="green" />
        <StatCard icon={<FaCheckCircle />} title="Total Paid" value={`Rs. ${stats.totalPaid}`} subtitle="All Students" color="emerald" />
        <StatCard icon={<FaExclamationCircle />} title="Total Balance" value={`Rs. ${stats.totalBalance}`} subtitle="Pending Amount" color="red" />
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_260px_160px]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission no, father name, phone..."
              className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
            />
          </div>

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.displayName}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border px-4 py-3 outline-none"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <button type="button" className="rounded-xl bg-black px-5 py-3 font-bold text-white">
            Search
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_470px]">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-extrabold text-black">Students Fee Summary</h2>
            <p className="text-sm text-gray-500">Total: {filteredStudents.length}</p>
          </div>

          <div className="hidden overflow-hidden rounded-xl border lg:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Admission No</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left">Total Fee</th>
                  <th className="p-3 text-left">Paid</th>
                  <th className="p-3 text-left">Balance</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Last Payment</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((item, index) => (
                  <tr key={item.studentId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-semibold">{item.student?.user?.name || "N/A"}</td>
                    <td className="p-3">{item.student?.admissionNo || "N/A"}</td>
                    <td className="p-3">{item.class?.displayName || "N/A"}</td>
                    <td className="p-3">Rs. {item.totalFee}</td>
                    <td className="p-3">Rs. {item.totalPaid}</td>
                    <td className={`p-3 font-bold ${item.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      Rs. {item.balance}
                    </td>
                    <td className="p-3"><Status status={item.status} /></td>
                    <td className="p-3">{item.lastPayment ? item.lastPayment.toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(item)}
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold"
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredStudents.map((item) => (
              <div key={item.studentId} className="rounded-2xl border bg-gray-50 p-4">
                <h3 className="font-extrabold">{item.student?.user?.name || "N/A"}</h3>
                <p className="text-sm text-gray-500">
                  {item.student?.admissionNo || "N/A"} • {item.class?.displayName || "Class N/A"}
                </p>

                <div className="mt-4 grid gap-2">
                  <Info label="Total Fee" value={`Rs. ${item.totalFee}`} />
                  <Info label="Paid" value={`Rs. ${item.totalPaid}`} />
                  <Info label="Balance" value={`Rs. ${item.balance}`} />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(item)}
                  className="mt-4 w-full rounded-xl bg-black py-3 font-bold text-white"
                >
                  View Receipt
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            <b>Note:</b> This receipt shows all pending months together. When student pays, a single receipt is generated for total pending amount.
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-extrabold text-black">Receipt Preview</h2>

            <button
              type="button"
              onClick={() => selectedStudent && printReceipt(selectedStudent)}
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white"
            >
              View Full Receipt
            </button>
          </div>

          {selectedStudent ? (
            <ReceiptPreview item={selectedStudent} />
          ) : (
            <div className="rounded-2xl bg-gray-50 p-10 text-center text-gray-500">
              Select a student to preview receipt.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReceiptPreview({ item }) {
  const records = item.records || [];
  const latest = records[0];

  return (
    <div className="rounded-xl border bg-white p-4 text-[11px] text-black">
      <div className="text-center">
        <h2 className="font-extrabold underline">CENNA SCHOOL & COLLEGE PABBI NSR</h2>
        <p className="mt-1 underline">0923-529166/466</p>
        <p className="underline">Pabbi Nowshera</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 font-bold">
        <p>Month: {latest?.month}-{String(latest?.year || "").slice(-2)}</p>
        <p>Due date: {formatDate(latest?.dueDate)}</p>
        <p>Admc No. {item.student?.admissionNo || "N/A"}</p>
        <p>Student Name: {item.student?.user?.name || "N/A"}</p>
        <p>Father Name: {item.student?.fatherName || "N/A"}</p>
        <p>Class-Sec: {item.class?.displayName || "N/A"}</p>
      </div>

      <FeeSlipTable records={records} />

      <table className="mt-3 w-full border-collapse">
        <tbody>
          <tr><td className="border-b p-1 font-bold">Head</td><td className="border-b p-1 font-bold">Amount</td></tr>
          <tr><td className="border-b p-1">Tuition Fee</td><td className="border-b p-1">{item.balance}</td></tr>
          <tr><td className="border-b p-1 font-bold">Total</td><td className="border-b p-1 font-bold">{item.balance}</td></tr>
          <tr><td className="border-b p-1 font-bold">Balance:</td><td className="border-b p-1 font-bold">{item.balance}</td></tr>
        </tbody>
      </table>

      <p className="mt-3 text-[10px] font-semibold">
        NOTE: FOR ANY QUERY IN THE SLIP PLEASE CONTACT WITH SCHOOL ADMINISTRATION IN WORKING HOURS. THANKS
      </p>

      <div className="mt-4 border-b border-dashed border-gray-400">✂</div>
    </div>
  );
}

function FeeSlipTable({ records }) {
  return (
    <table className="mt-4 w-full border-collapse border text-center">
      <thead>
        <tr>
          <th className="border p-1">Month</th>
          <th className="border p-1">Pre. Bal</th>
          <th className="border p-1">Monthly Fee</th>
          <th className="border p-1">Discount</th>
          <th className="border p-1">Amt. Received</th>
          <th className="border p-1">Closing Bal.</th>
        </tr>
      </thead>
      <tbody>
        {records.map((fee) => (
          <tr key={fee._id}>
            <td className="border p-1">{fee.month}-{String(fee.year).slice(-2)}</td>
            <td className="border p-1">{Math.max(Number(fee.totalAmount || 0) - Number(fee.monthlyFee || 0), 0)}</td>
            <td className="border p-1">{fee.monthlyFee || 0}</td>
            <td className="border p-1">{fee.discount || 0}</td>
            <td className="border p-1">{fee.paidAmount || 0}</td>
            <td className="border p-1">{Math.max(Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0), 0)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    emerald: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold text-black">{title}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-black">{value}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between rounded-xl bg-white px-4 py-3">
      <span className="text-xs font-bold uppercase text-gray-400">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function Status({ status }) {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    Partial: "bg-yellow-100 text-yellow-700",
    Unpaid: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
}

function printReceipt(item) {
  const w = window.open("", "_blank");

  const rows = item.records
    .map(
      (fee) => `
      <tr>
        <td>${fee.month}-${String(fee.year).slice(-2)}</td>
        <td>${Math.max(Number(fee.totalAmount || 0) - Number(fee.monthlyFee || 0), 0)}</td>
        <td>${fee.monthlyFee || 0}</td>
        <td>${fee.discount || 0}</td>
        <td>${fee.paidAmount || 0}</td>
        <td>${Math.max(Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0), 0)}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <html>
      <head>
        <title>Fee Receipt</title>
        <style>
          body { font-family: Arial; padding: 25px; color: #111; }
          .slip { width: 850px; padding: 25px; border: 1px solid #ddd; }
          .center { text-align: center; }
          h2 { font-size: 18px; margin: 0; text-decoration: underline; }
          p { margin: 4px 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 25px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
          th, td { border: 1px solid #111; padding: 6px; text-align: center; }
          .head td { border: none; border-bottom: 1px solid #111; text-align: left; }
          .note { margin-top: 15px; font-size: 12px; font-weight: bold; }
          .cut { margin-top: 25px; border-bottom: 1px dashed #444; }
        </style>
      </head>
      <body>
        <div class="slip">
          <div class="center">
            <h2>CENNA SCHOOL & COLLEGE PABBI NSR</h2>
            <p><u>0923-529166/466</u></p>
            <p><u>Pabbi Nowshera</u></p>
          </div>
          <div class="grid">
            <p>Admc No. ${item.student?.admissionNo || "N/A"}</p>
            <p>Student Name: ${item.student?.user?.name || "N/A"}</p>
            <p>Father Name: ${item.student?.fatherName || "N/A"}</p>
            <p>Class-Sec: ${item.class?.displayName || "N/A"}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Month</th><th>Pre. Bal</th><th>Monthly Fee</th><th>Discount</th><th>Amt. Received</th><th>Closing Bal.</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <table class="head">
            <tr><td><b>Head</b></td><td><b>Amount</b></td></tr>
            <tr><td>Tuition Fee</td><td>${item.balance}</td></tr>
            <tr><td><b>Total</b></td><td><b>${item.balance}</b></td></tr>
            <tr><td><b>Balance:</b></td><td><b>${item.balance}</b></td></tr>
          </table>
          <p class="note">NOTE: FOR ANY QUERY IN THE SLIP PLEASE CONTACT WITH SCHOOL ADMINISTRATION IN WORKING HOURS. THANKS</p>
          <div class="cut">✂</div>
        </div>
        <script>window.onload = function(){ window.print(); }</script>
      </body>
    </html>
  `;

  w.document.write(html);
  w.document.close();
}

function printReport(students, stats) {
  const rows = students
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.student?.user?.name || "N/A"}</td>
        <td>${item.student?.admissionNo || "N/A"}</td>
        <td>${item.class?.displayName || "N/A"}</td>
        <td>${item.totalFee}</td>
        <td>${item.totalPaid}</td>
        <td>${item.balance}</td>
        <td>${item.status}</td>
      </tr>
    `
    )
    .join("");

  const w = window.open("", "_blank");

  w.document.write(`
    <html>
      <head>
        <title>Payment History Report</title>
        <style>
          body { font-family: Arial; padding: 30px; color: #111; }
          h1 { margin-bottom: 5px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .card { border: 1px solid #ddd; padding: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th, td { border: 1px solid #111; padding: 8px; text-align: left; }
          th { background: #eee; }
        </style>
      </head>
      <body>
        <h1>CENNA School & College Pabbi</h1>
        <p>Payment History Report</p>

        <div class="summary">
          <div class="card"><b>Total Students</b><br/>${stats.students}</div>
          <div class="card"><b>Total Fee</b><br/>Rs. ${stats.totalFee}</div>
          <div class="card"><b>Total Paid</b><br/>Rs. ${stats.totalPaid}</div>
          <div class="card"><b>Total Balance</b><br/>Rs. ${stats.totalBalance}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th><th>Student</th><th>Admission No</th><th>Class</th><th>Total Fee</th><th>Paid</th><th>Balance</th><th>Status</th>
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