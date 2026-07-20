"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFeeReports } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
}

export default function AccountantReportsPage() {
  const dispatch = useDispatch();

  const { reports, loading, error } = useSelector((state) => state.fees || {});

  useEffect(() => {
    dispatch(fetchFeeReports());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading reports..." />;

  const cards = reports
    ? [
        {
          title: "Monthly Collection Report",
          value: formatCurrency(reports.monthlyCollected),
        },
        {
          title: "Pending Dues Report",
          value: formatCurrency(reports.pendingDues),
        },
        {
          title: "Defaulter Report",
          value: `${reports.defaulterCount} student${reports.defaulterCount === 1 ? "" : "s"}`,
        },
      ]
    : [];

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Financial Reports
      </h1>
      <p className="mb-6 text-gray-500">
        View financial reports and summaries.
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && reports ? (
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black">{item.title}</h2>
              <p className="mt-3 text-2xl font-extrabold text-yellow-600">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No fee data found.
          </div>
        )
      )}
    </section>
  );
}
