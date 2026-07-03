"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaMoneyBillWave,
  FaReceipt,
  FaExclamationTriangle,
  FaHistory,
  FaUserGraduate,
  FaFileInvoice,
} from "react-icons/fa";

import { fetchFees, fetchDefaulters } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function AccountantDashboardPage() {
  const dispatch = useDispatch();

  const { fees = [], defaulters = [], loading, error } = useSelector(
    (state) => state.fees || {}
  );

  useEffect(() => {
    dispatch(fetchFees());
    dispatch(fetchDefaulters());
  }, [dispatch]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let totalCollected = 0;
    let pendingAmount = 0;
    let todayCollection = 0;
    let thisMonthCollection = 0;

    fees.forEach((fee) => {
      const paid = Number(fee.paidAmount || 0);
      const total = Number(fee.totalAmount || 0);
      const balance = Math.max(total - paid, 0);

      totalCollected += paid;
      pendingAmount += balance;

      if (fee.paidDate && new Date(fee.paidDate).toDateString() === today) {
        todayCollection += paid;
      }

      if (
        fee.paidDate &&
        new Date(fee.paidDate).getMonth() + 1 === currentMonth &&
        new Date(fee.paidDate).getFullYear() === currentYear
      ) {
        thisMonthCollection += paid;
      }
    });

    return {
      totalCollected,
      pendingAmount,
      todayCollection,
      thisMonthCollection,
      defaulterCount: defaulters.length,
      totalChallans: fees.length,
    };
  }, [fees, defaulters]);

  const recentCollections = fees
    .filter((fee) => Number(fee.paidAmount || 0) > 0)
    .slice(0, 6);

  if (loading && fees.length === 0) {
    return <PageLoader text="Loading accountant dashboard..." />;
  }

  return (
    <section className="space-y-8 p-4 md:p-6">
      <div className="rounded-3xl bg-gradient-to-r from-black to-gray-800 p-8 text-white shadow-lg">
        <p className="text-sm font-bold text-yellow-400">
          Accountant Portal
        </p>

        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
          Fee Management Dashboard
        </h1>

        <p className="mt-2 text-gray-300">
          Manage fee collection, challans, defaulters, and payment history.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <QuickLink href="/portals/accountant/fee-collection" text="Collect Fee" />
          <QuickLink href="/portals/accountant/fee-challan" text="Generate Challan" />
          <QuickLink href="/portals/accountant/fee-defaulters" text="View Defaulters" />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FaMoneyBillWave />}
          title="This Month Collected"
          value={`Rs. ${stats.thisMonthCollection}`}
        />

        <StatCard
          icon={<FaReceipt />}
          title="Today Collection"
          value={`Rs. ${stats.todayCollection}`}
        />

        <StatCard
          icon={<FaExclamationTriangle />}
          title="Pending Amount"
          value={`Rs. ${stats.pendingAmount}`}
        />

        <StatCard
          icon={<FaUserGraduate />}
          title="Defaulters"
          value={stats.defaulterCount}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Quick Actions">
          <Action href="/portals/accountant/students" icon={<FaUserGraduate />} text="Search Students" />
          <Action href="/portals/accountant/fee-collection" icon={<FaMoneyBillWave />} text="Fee Collection" />
          <Action href="/portals/accountant/fee-challan" icon={<FaFileInvoice />} text="Fee Challans" />
          <Action href="/portals/accountant/payment-history" icon={<FaHistory />} text="Payment History" />
        </Panel>

        <Panel title="Fee Summary">
          <SummaryRow label="Total Challans" value={stats.totalChallans} />
          <SummaryRow label="Total Collected" value={`Rs. ${stats.totalCollected}`} />
          <SummaryRow label="Pending Amount" value={`Rs. ${stats.pendingAmount}`} />
          <SummaryRow label="Defaulters" value={stats.defaulterCount} />
        </Panel>

        <Panel title="Recent Defaulters">
          {defaulters.slice(0, 5).length > 0 ? (
            defaulters.slice(0, 5).map((fee) => (
              <MiniItem
                key={fee._id}
                title={fee.student?.user?.name || "Student"}
                subtitle={`${fee.student?.class?.displayName || "Class N/A"} • ${
                  fee.month
                } ${fee.year} • Rs. ${
                  Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0)
                }`}
              />
            ))
          ) : (
            <Empty text="No defaulters found." />
          )}
        </Panel>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-black">
            Recent Collections
          </h2>

          <Link
            href="/portals/accountant/payment-history"
            className="text-sm font-bold text-blue-600"
          >
            View all
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Student</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Month</th>
                <th className="p-4 text-left">Paid</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentCollections.length > 0 ? (
                recentCollections.map((fee) => (
                  <tr key={fee._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">
                      {fee.student?.user?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      {fee.student?.class?.displayName || "N/A"}
                    </td>
                    <td className="p-4">
                      {fee.month} {fee.year}
                    </td>
                    <td className="p-4 font-bold">
                      Rs. {fee.paidAmount || 0}
                    </td>
                    <td className="p-4">{fee.paymentMethod || "Cash"}</td>
                    <td className="p-4">
                      {fee.paidDate
                        ? new Date(fee.paidDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    No collections yet.
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

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-600">
        {icon}
      </div>
      <p className="mt-4 text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-black">{value}</h2>
    </div>
  );
}

function QuickLink({ href, text }) {
  return (
    <Link
      href={href}
      className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-extrabold text-black hover:bg-yellow-400"
    >
      {text}
    </Link>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-extrabold text-black">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Action({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border p-4 font-bold text-black hover:bg-gray-50"
    >
      <span className="text-yellow-600">{icon}</span>
      {text}
    </Link>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <p className="font-semibold text-gray-600">{label}</p>
      <p className="font-extrabold text-black">{value}</p>
    </div>
  );
}

function MiniItem({ title, subtitle }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="font-bold text-black">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 text-center font-semibold text-gray-500">
      {text}
    </div>
  );
}