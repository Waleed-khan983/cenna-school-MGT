"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaReceipt,
  FaSearch,
} from "react-icons/fa";

import StudentSearch from "@/components/accountant/fee-collection/StudentSearch";
import StudentCard from "@/components/accountant/fee-collection/StudentCard";
import PendingFees from "@/components/accountant/fee-collection/PendingFees";
import PaymentForm from "@/components/accountant/fee-collection/PaymentForm";
import ReceiptModal from "@/components/accountant/fee-collection/ReceiptModal";

export default function AccountantFeeCollectionPage() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);

  const totalAmount = fees.reduce(
    (sum, fee) => sum + Number(fee.totalAmount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const totalBalance = fees.reduce((sum, fee) => {
    return (
      sum +
      Math.max(Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0), 0)
    );
  }, 0);

  const pendingFees = fees.filter((fee) => fee.status !== "Paid");

  const handleStudentSelected = ({ student, fees }) => {
    setSelectedStudent(student);
    setFees(fees || []);
    setSelectedFee(null);
    setLastReceipt(null);
  };

  const handlePaymentSuccess = ({ fee, updatedFees }) => {
    toast.success("Fee collected successfully");

    setLastReceipt(fee);
    setSelectedFee(null);

    if (updatedFees) {
      setFees(updatedFees);
    } else {
      setFees((prev) =>
        prev.map((item) => (item._id === fee._id ? fee : item))
      );
    }
  };

  return (
    <section className="min-h-screen space-y-6 bg-[#f8fafc] p-4 md:p-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-black to-gray-800 p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-extrabold text-yellow-400">
              Accountant Portal
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Fee Collection
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-300 md:text-base">
              Search student by admission number, name, father name, or phone.
              Collect pending fee and print receipt instantly.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            <TopStat
              icon={<FaSearch />}
              label="Search First"
              value="Fast"
            />

            <TopStat
              icon={<FaMoneyBillWave />}
              label="Pending"
              value={`Rs. ${totalBalance}`}
            />

            <TopStat
              icon={<FaReceipt />}
              label="Receipt"
              value="Ready"
            />
          </div>
        </div>
      </div>

      <StudentSearch onStudentSelected={handleStudentSelected} />

      {selectedStudent ? (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <SummaryCard
              label="Total Fee"
              value={`Rs. ${totalAmount}`}
              tone="black"
            />

            <SummaryCard
              label="Total Paid"
              value={`Rs. ${totalPaid}`}
              tone="green"
            />

            <SummaryCard
              label="Remaining Balance"
              value={`Rs. ${totalBalance}`}
              tone={totalBalance > 0 ? "red" : "green"}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
            <div className="space-y-6">
              <StudentCard student={selectedStudent} balance={totalBalance} />

              {lastReceipt && (
                <button
                  type="button"
                  onClick={() => setLastReceipt(lastReceipt)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 font-extrabold text-black shadow-sm hover:bg-yellow-300"
                >
                  <FaCheckCircle />
                  Last Payment Receipt
                </button>
              )}
            </div>

            <div className="grid gap-6 2xl:grid-cols-[1fr_430px]">
              <PendingFees
                fees={pendingFees}
                selectedFee={selectedFee}
                onSelectFee={setSelectedFee}
              />

              <PaymentForm
                student={selectedStudent}
                selectedFee={selectedFee}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-3xl text-yellow-600">
            <FaSearch />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-black">
            Search Student to Start Collection
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-gray-500">
            No student data is loaded by default. This keeps the system fast and
            professional for thousands of students.
          </p>
        </div>
      )}

      {lastReceipt && (
        <ReceiptModal
          fee={lastReceipt}
          onClose={() => setLastReceipt(null)}
        />
      )}
    </section>
  );
}

function TopStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 text-yellow-400">{icon}</div>
      <p className="text-xs font-bold text-gray-300">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-white">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-green-600"
      : tone === "red"
      ? "text-red-600"
      : "text-black";

  return (
    <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <h3 className={`mt-2 text-3xl font-extrabold ${toneClass}`}>
        {value}
      </h3>
    </div>
  );
}