"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserGraduate,
  FaClipboardCheck,
  FaChartLine,
  FaMoneyBillWave,
  FaTasks,
  FaBell,
} from "react-icons/fa";

import {
  fetchMyParentProfile,
  fetchMyChildrenAttendance,
  fetchMyChildrenResults,
  fetchMyChildrenAssignments,
  fetchMyChildrenFees,
} from "@/store/parentSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function ParentDashboardPage() {
  const dispatch = useDispatch();

  const {
    parent,
    children = [],
    attendance = [],
    results = [],
    assignments = [],
    fees = [],
    loading,
  } = useSelector((state) => state.parents || {});

  useEffect(() => {
    dispatch(fetchMyParentProfile());
    dispatch(fetchMyChildrenAttendance());
    dispatch(fetchMyChildrenResults());
    dispatch(fetchMyChildrenAssignments());
    dispatch(fetchMyChildrenFees());
  }, [dispatch]);

  const attendancePercent = useMemo(() => {
    if (!attendance.length) return 0;

    const present = attendance.filter(
      (item) => item.status === "present"
    ).length;

    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  const pendingFees = useMemo(() => {
    return fees.reduce((sum, fee) => {
      return (
        sum +
        Math.max(
          Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
          0
        )
      );
    }, 0);
  }, [fees]);

  const latestResult = results[0];
  const upcomingAssignments = assignments.slice(0, 3);
  const recentFees = fees.slice(0, 3);

  if (loading && !parent) {
    return <PageLoader text="Loading parent dashboard..." />;
  }

  return (
    <section className="space-y-8 p-4 md:p-6">
      <div className="rounded-3xl bg-gradient-to-r from-black to-gray-800 p-8 text-white shadow-lg">
        <p className="text-sm font-bold text-yellow-400">
          Parent Portal
        </p>

        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
          Welcome, {parent?.user?.name || "Parent"}
        </h1>

        <p className="mt-2 text-gray-300">
          Track your children&apos;s academics, attendance, fees, and school updates.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <QuickLink href="/portals/parent/children" text="My Children" />
          <QuickLink href="/portals/parent/fees" text="View Fees" />
          <QuickLink href="/portals/parent/contact" text="Contact School" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FaUserGraduate />}
          title="Linked Children"
          value={children.length}
        />

        <StatCard
          icon={<FaClipboardCheck />}
          title="Attendance"
          value={`${attendancePercent}%`}
        />

        <StatCard
          icon={<FaChartLine />}
          title="Latest Result"
          value={
            latestResult
              ? `${latestResult.percentage || 0}%`
              : "N/A"
          }
        />

        <StatCard
          icon={<FaMoneyBillWave />}
          title="Pending Fees"
          value={`Rs. ${pendingFees}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Children" href="/portals/parent/children">
          {children.length > 0 ? (
            children.slice(0, 3).map((child) => (
              <MiniItem
                key={child._id}
                title={child.user?.name || "Student"}
                subtitle={`${child.class?.displayName || "Class N/A"} • Admission: ${
                  child.admissionNo || "N/A"
                }`}
              />
            ))
          ) : (
            <Empty text="No children linked." />
          )}
        </Panel>

        <Panel title="Assignments" href="/portals/parent/assignments">
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map((item) => (
              <MiniItem
                key={item._id}
                title={item.title}
                subtitle={`${item.subject?.name || "Subject"} • Due: ${
                  item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : "N/A"
                }`}
              />
            ))
          ) : (
            <Empty text="No assignments found." />
          )}
        </Panel>

        <Panel title="Recent Fees" href="/portals/parent/fees">
          {recentFees.length > 0 ? (
            recentFees.map((fee) => (
              <MiniItem
                key={fee._id}
                title={`${fee.month} ${fee.year}`}
                subtitle={`${fee.student?.user?.name || "Student"} • ${
                  fee.status
                } • Rs. ${fee.totalAmount}`}
              />
            ))
          ) : (
            <Empty text="No fees found." />
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <FaTasks className="text-yellow-600" />
            <h2 className="text-xl font-extrabold text-black">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Action href="/portals/parent/attendance" text="Check Attendance" />
            <Action href="/portals/parent/results" text="View Results" />
            <Action href="/portals/parent/assignments" text="View Assignments" />
            <Action href="/portals/parent/contact" text="Send Message" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <FaBell className="text-yellow-600" />
            <h2 className="text-xl font-extrabold text-black">
              Latest Result
            </h2>
          </div>

          {latestResult ? (
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="font-extrabold text-black">
                {latestResult.student?.user?.name || "Student"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {latestResult.examType} • {latestResult.session}
              </p>

              <p className="mt-3 text-3xl font-extrabold text-black">
                {latestResult.percentage || 0}%
              </p>

              <p className="mt-1 font-bold text-gray-600">
                Grade: {latestResult.grade || "N/A"} •{" "}
                {latestResult.isPassed ? "Passed" : "Failed"}
              </p>
            </div>
          ) : (
            <Empty text="No result available yet." />
          )}
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
      <h2 className="mt-2 text-3xl font-extrabold text-black">{value}</h2>
    </div>
  );
}

function Panel({ title, href, children }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-black">{title}</h2>

        <Link href={href} className="text-sm font-bold text-blue-600">
          View all
        </Link>
      </div>

      <div className="space-y-3">{children}</div>
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

function Action({ href, text }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 px-4 py-3 text-center font-bold text-black hover:bg-gray-50"
    >
      {text}
    </Link>
  );
}