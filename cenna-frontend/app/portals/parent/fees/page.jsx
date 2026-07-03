"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChildrenFees } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentFeesPage() {
  const dispatch = useDispatch();

  const { fees = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenFees());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading fees..." />;

  const totalDue = fees.reduce(
    (sum, fee) => sum + Math.max(Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0), 0),
    0
  );

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">Fees</h1>
        <p className="mt-2 text-gray-500">
          View fee records and print challans.
        </p>
      </div>

      <div className="rounded-3xl bg-black p-6 text-white shadow-sm">
        <p className="text-sm font-bold text-yellow-400">Total Remaining Balance</p>
        <h2 className="mt-2 text-4xl font-extrabold">Rs. {totalDue}</h2>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Paid</th>
                <th className="p-4 text-left">Balance</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Due Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {fees.length > 0 ? (
                fees.map((fee) => {
                  const balance = Math.max(
                    Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
                    0
                  );

                  return (
                    <tr key={fee._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold">
                        {fee.student?.user?.name || "N/A"}
                      </td>
                      <td className="p-4">
                        {fee.month} {fee.year}
                      </td>
                      <td className="p-4 font-bold">Rs. {fee.totalAmount}</td>
                      <td className="p-4 ">Rs. {fee.paidAmount}</td>
                      <td className="p-4 font-bold">Rs. {balance}</td>
                      <td className="p-4 font-bold">{fee.status}</td>
                      <td className="p-4">
                        {fee.dueDate
                          ? new Date(fee.dueDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => printChallan(fee)}
                          className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-bold text-black hover:bg-yellow-400"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    No fees found.
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

function printChallan(fee) {
  const w = window.open("", "_blank");

  w.document.write(`
    <html>
      <head>
        <title>Fee Challan</title>
        <style>
          body { font-family: Arial; padding: 30px; color: #111; }
          .card { max-width: 850px; margin: auto; border: 2px solid #111; padding: 25px; }
          .header { text-align: center; border-bottom: 3px solid #111; padding-bottom: 15px; margin-bottom: 20px; }
          .title { text-align: center; background: #0f172a; color: white; padding: 12px; font-weight: bold; margin-bottom: 20px; }
          .info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
          .info div { border: 1px solid #ddd; padding: 10px; background: #f8fafc; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #111; padding: 10px; text-align: center; }
          th { background: #e5e7eb; }
          .signatures { display: flex; justify-content: space-between; margin-top: 60px; font-weight: bold; }
          .signatures div { width: 220px; border-top: 1px solid #111; text-align: center; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>CENNA School & College Pabbi</h1>
            <p>Official Fee Challan</p>
          </div>

          <div class="title">FEE CHALLAN</div>

          <div class="info">
            <div><strong>Student:</strong> ${fee.student?.user?.name || "N/A"}</div>
            <div><strong>Challan No:</strong> ${fee.challanNo || "N/A"}</div>
            <div><strong>Status:</strong> ${fee.status || "N/A"}</div>
            <div><strong>Month:</strong> ${fee.month} ${fee.year}</div>
            <div><strong>Due Date:</strong> ${
              fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "N/A"
            }</div>
          </div>

          <table>
            <tbody>
              <tr><td>Monthly Fee</td><td>${fee.monthlyFee || 0}</td></tr>
              <tr><td>Admission Fee</td><td>${fee.admissionFee || 0}</td></tr>
              <tr><td>Exam Fee</td><td>${fee.examFee || 0}</td></tr>
              <tr><td>Late Fine</td><td>${fee.lateFine || 0}</td></tr>
              <tr><td>Discount</td><td>${fee.discount || 0}</td></tr>
              <tr><th>Total Amount</th><th>${fee.totalAmount || 0}</th></tr>
              <tr><th>Paid Amount</th><th>${fee.paidAmount || 0}</th></tr>
            </tbody>
          </table>

          <div class="signatures">
            <div>Accountant</div>
            <div>Principal</div>
          </div>
        </div>

        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `);

  w.document.close();
}