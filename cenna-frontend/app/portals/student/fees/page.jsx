"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyFees } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentFeesPage() {
  const dispatch = useDispatch();
  const { fees, loading, error } = useSelector((state) => state.fees);

  useEffect(() => {
    dispatch(fetchMyFees());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading fees..." />;

  return (
    <section className="p-6">
      <h1 className="text-3xl font-extrabold text-black">My Fees</h1>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Month</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {fees.length > 0 ? (
              fees.map((fee) => (
                <tr key={fee._id} className="border-b">
                  <td className="p-4 text-center">
                    {fee.month} {fee.year}
                  </td>
                  <td className="p-4 text-center font-bold">{fee.totalAmount}</td>
                  <td className="p-4 text-center">{fee.paidAmount}</td>
                  <td className="p-4 text-center font-bold">{fee.status}</td>
                  <td className="p-4 text-center">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => printChallan(fee)}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-bold text-black"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  No fees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function printChallan(fee) {
  const w = window.open("", "_blank");

  w.document.write(`
    <html>
      <head>
        <title>Fee Challan</title>
        <style>
          body { font-family: Arial; padding: 30px; }
          .card { max-width: 800px; margin: auto; border: 2px solid #111; padding: 25px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #111; padding: 10px; text-align: center; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>CENNA School & College Pabbi</h1>
          <h2>Fee Challan</h2>

          <p><b>Challan No:</b> ${fee.challanNo || "N/A"}</p>
          <p><b>Month:</b> ${fee.month} ${fee.year}</p>
          <p><b>Status:</b> ${fee.status}</p>
          <p><b>Due Date:</b> ${new Date(fee.dueDate).toLocaleDateString()}</p>

          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Monthly Fee</td><td>${fee.monthlyFee || 0}</td></tr>
            <tr><td>Admission Fee</td><td>${fee.admissionFee || 0}</td></tr>
            <tr><td>Exam Fee</td><td>${fee.examFee || 0}</td></tr>
            <tr><td>Late Fine</td><td>${fee.lateFine || 0}</td></tr>
            <tr><td>Discount</td><td>${fee.discount || 0}</td></tr>
            <tr><th>Total</th><th>${fee.totalAmount || 0}</th></tr>
            <tr><th>Paid</th><th>${fee.paidAmount || 0}</th></tr>
          </table>
        </div>

        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);

  w.document.close();
}