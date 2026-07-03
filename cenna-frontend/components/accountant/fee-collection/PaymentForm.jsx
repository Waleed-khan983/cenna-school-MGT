"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";

import { collectFeeApi, getStudentFeesApi } from "@/services/feeService";

const paymentMethods = ["Cash", "Online", "Bank", "JazzCash", "Easypaisa"];

export default function PaymentForm({
  student,
  selectedFee,
  onPaymentSuccess,
}) {
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const balance = useMemo(() => {
    if (!selectedFee) return 0;

    return Math.max(
      Number(selectedFee.totalAmount || 0) -
        Number(selectedFee.paidAmount || 0),
      0
    );
  }, [selectedFee]);

  useEffect(() => {
    if (selectedFee) {
      setPaidAmount(String(balance));
      setPaymentMethod("Cash");
      setNotes("");
    }
  }, [selectedFee, balance]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!student) {
      toast.error("Please select student first");
      return;
    }

    if (!selectedFee) {
      toast.error("Please select fee record first");
      return;
    }

    if (!paidAmount || Number(paidAmount) <= 0) {
      toast.error("Paid amount must be greater than 0");
      return;
    }

    if (Number(paidAmount) > balance) {
      toast.error("Paid amount cannot be greater than balance");
      return;
    }

    try {
      setLoading(true);

      const result = await collectFeeApi({
        id: selectedFee._id,
        data: {
          paidAmount: Number(paidAmount),
          paymentMethod,
          notes,
        },
      });

      const feesResult = await getStudentFeesApi(student._id);

      onPaymentSuccess({
        fee: result.fee,
        updatedFees: feesResult.fees || [],
      });

      setPaidAmount("");
      setNotes("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to collect fee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold text-black">
          Collect Payment
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter payment details and collect fee.
        </p>
      </div>

      {selectedFee ? (
        <div className="mb-5 rounded-3xl bg-gradient-to-r from-black to-gray-800 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black">
              <FaReceipt />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-300">
                Selected Challan
              </p>
              <h3 className="text-xl font-extrabold">
                {selectedFee.month} {selectedFee.year}
              </h3>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat
              label="Total"
              value={`Rs. ${selectedFee.totalAmount || 0}`}
            />
            <MiniStat
              label="Already Paid"
              value={`Rs. ${selectedFee.paidAmount || 0}`}
            />
            <MiniStat
              label="Balance"
              value={`Rs. ${balance}`}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl bg-gray-50 p-6 text-center font-semibold text-gray-500">
          Select a pending fee to collect payment.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Paid Amount"
          type="number"
          value={paidAmount}
          onChange={(event) => setPaidAmount(event.target.value)}
          placeholder="Enter amount"
          disabled={!selectedFee}
          icon={<FaMoneyBillWave />}
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Payment Method
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FaCreditCard />
            </span>

            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              disabled={!selectedFee}
              className="w-full rounded-2xl border bg-white py-3 pl-11 pr-4 font-semibold outline-none focus:border-black disabled:bg-gray-100"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={!selectedFee}
            placeholder="Optional payment note..."
            rows={4}
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFee}
          className="w-full rounded-2xl bg-black py-4 font-extrabold text-white transition hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
        >
          {loading ? "Collecting Payment..." : "Collect Payment"}
        </button>
      </form>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold text-gray-300">{label}</p>
      <p className="mt-1 font-extrabold text-white">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-2xl border bg-white py-3 pr-4 font-semibold outline-none focus:border-black disabled:bg-gray-100 ${
            icon ? "pl-11" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}