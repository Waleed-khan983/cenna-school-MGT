"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyChildrenFees } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

const STATUS_STYLES = {
  Paid: "bg-green-100 text-green-700",
  Partial: "bg-yellow-100 text-yellow-700",
  Unpaid: "bg-red-100 text-red-700",
  Waived: "bg-gray-200 text-gray-600",
};

export default function ParentPaymentHistoryPage() {
  const dispatch = useDispatch();

  const { fees = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenFees());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading payment history..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Payment History
      </h1>
      <p className="mb-6 text-gray-500">
        View fee records, receipts, and payment status for your children.
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && fees.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4">Receipt</th>
                <th className="p-4">Child</th>
                <th className="p-4">Month</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Remaining</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => {
                const total = Number(fee.totalAmount || 0);
                const paid = Number(fee.paidAmount || 0);
                const remaining = Math.max(0, total - paid);

                return (
                  <tr key={fee._id} className="border-b">
                    <td className="p-4 font-semibold">
                      {fee.receiptNo || "—"}
                    </td>
                    <td className="p-4">{fee.student?.user?.name || "N/A"}</td>
                    <td className="p-4">
                      {fee.month} {fee.year}
                    </td>
                    <td className="p-4">
                      {fee.dueDate
                        ? new Date(fee.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4">Rs. {total.toLocaleString()}</td>
                    <td className="p-4 font-bold">
                      Rs. {paid.toLocaleString()}
                    </td>
                    <td className="p-4">Rs. {remaining.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          STATUS_STYLES[fee.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {fee.status || "Unpaid"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No fee records found.
          </div>
        )
      )}
    </section>
  );
}
