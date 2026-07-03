"use client";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function PendingFees({ fees = [], selectedFee, onSelectFee }) {
  return (
    <div className="rounded-[2rem] border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-black">Pending Fees</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a challan to collect payment.
          </p>
        </div>

        <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-extrabold text-yellow-700">
          {fees.length} Pending
        </span>
      </div>

      {fees.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fees.map((fee) => (
            <FeeCard
              key={fee._id}
              fee={fee}
              active={selectedFee?._id === fee._id}
              onClick={() => onSelectFee(fee)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-green-50 p-10 text-center">
          <FaCheckCircle className="mx-auto text-4xl text-green-600" />
          <h3 className="mt-4 text-xl font-extrabold text-green-700">
            No Pending Fees
          </h3>
          <p className="mt-2 text-sm font-semibold text-green-600">
            This student has no unpaid or partial challans.
          </p>
        </div>
      )}
    </div>
  );
}

function FeeCard({ fee, active, onClick }) {
  const total = Number(fee.totalAmount || 0);
  const paid = Number(fee.paidAmount || 0);
  const balance = Math.max(total - paid, 0);

  const overdue =
    fee.dueDate &&
    new Date(fee.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left transition ${
        active
          ? "border-black bg-yellow-50 shadow-sm"
          : "bg-gray-50 hover:border-yellow-400 hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-500">Fee Month</p>
          <h3 className="mt-1 text-xl font-extrabold text-black">
            {fee.month} {fee.year}
          </h3>
        </div>

        <Status status={fee.status} overdue={overdue} />
      </div>

      <div className="mt-5 grid gap-3">
        <Info icon={<FaMoneyBillWave />} label="Total" value={`Rs. ${total}`} />
        <Info icon={<FaCheckCircle />} label="Paid" value={`Rs. ${paid}`} />
        <Info
          icon={<FaExclamationTriangle />}
          label="Balance"
          value={`Rs. ${balance}`}
          danger={balance > 0}
        />
        <Info
          icon={<FaCalendarAlt />}
          label="Due Date"
          value={fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "N/A"}
          danger={overdue}
        />
      </div>

      <div
        className={`mt-5 rounded-2xl px-4 py-3 text-center text-sm font-extrabold ${
          active
            ? "bg-black text-white"
            : "bg-white text-black border"
        }`}
      >
        {active ? "Selected" : "Collect This Fee"}
      </div>
    </button>
  );
}

function Info({ icon, label, value, danger }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={danger ? "text-red-600" : "text-yellow-600"}>
          {icon}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <span
        className={`text-sm font-extrabold ${
          danger ? "text-red-600" : "text-black"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Status({ status, overdue }) {
  if (overdue && status !== "Paid") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700">
        Overdue
      </span>
    );
  }

  const styles = {
    Paid: "bg-green-100 text-green-700",
    Partial: "bg-yellow-100 text-yellow-700",
    Unpaid: "bg-red-100 text-red-700",
    Waived: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "N/A"}
    </span>
  );
}