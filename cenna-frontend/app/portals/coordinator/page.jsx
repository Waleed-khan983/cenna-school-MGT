"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowRight,
  FaBook,
  FaChalkboardTeacher,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaComments,
  FaExclamationTriangle,
  FaSchool,
  FaStar,
  FaTrophy,
  FaUserGraduate,
} from "react-icons/fa";

import { fetchCoordinatorDashboard } from "@/store/coordinatorSlice";
import PageLoader from "@/components/ui/PageLoader";

const FILE_URL = process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

function getFileUrl(filePath) {
  if (!filePath) return "";

  if (filePath.startsWith("http")) {
    return filePath;
  }

  const cleanPath = filePath.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

export default function CoordinatorDashboardPage() {
  const dispatch = useDispatch();
  const requestStarted = useRef(false);

  const {
    dashboard = {},
    dashboardStatus = "idle",
    dashboardError = null,
  } = useSelector((state) => state.coordinator || {});

  useEffect(() => {
    if (dashboardStatus === "idle" && !requestStarted.current) {
      requestStarted.current = true;
      dispatch(fetchCoordinatorDashboard());
    }
  }, [dispatch, dashboardStatus]);

  const hasDashboardData = dashboard && Object.keys(dashboard).length > 0;

  if (dashboardStatus === "loading" && !hasDashboardData) {
    return <PageLoader text="Loading coordinator dashboard..." />;
  }

  const attendance = Math.min(
    Math.max(Number(dashboard.attendancePercentage) || 0, 0),
    100,
  );

  const performance = Math.min(
    Math.max(Number(dashboard.averagePerformance) || 0, 0),
    100,
  );

  const topStudent = dashboard.topStudent || null;
  const recentRemarks = Array.isArray(dashboard.recentRemarks)
    ? dashboard.recentRemarks
    : [];

  // Continue with your existing return JSX...

  return (
    <section className="space-y-7">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-black via-gray-900 to-gray-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-400">
              Academic Supervision
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Coordinator Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Monitor classes, teachers, attendance, student performance,
              remarks, and award recommendations.
            </p>
          </div>

          <Link
            href="/portals/coordinator/performance"
            className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-2xl bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400"
          >
            View Performance
            <FaArrowRight />
          </Link>
        </div>
      </header>

      {dashboardError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-red-700">{dashboardError}</p>

          <button
            type="button"
            onClick={() => {
              requestStarted.current = true;
              dispatch(fetchCoordinatorDashboard());
            }}
            disabled={dashboardStatus === "loading"}
            className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dashboardStatus === "loading" ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Students"
          value={dashboard.totalStudents || 0}
          description="Currently enrolled"
          icon={<FaUserGraduate />}
          iconClass="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Active Teachers"
          value={dashboard.totalTeachers || 0}
          description="Teaching staff"
          icon={<FaChalkboardTeacher />}
          iconClass="bg-yellow-100 text-yellow-700"
        />

        <StatCard
          title="Active Classes"
          value={dashboard.totalClasses || 0}
          description="Running sections"
          icon={<FaSchool />}
          iconClass="bg-purple-100 text-purple-700"
        />

        <StatCard
          title="Subjects"
          value={dashboard.totalSubjects || 0}
          description="Available subjects"
          icon={<FaBook />}
          iconClass="bg-green-100 text-green-700"
        />

        <StatCard
          title="Attendance"
          value={`${attendance}%`}
          description="Overall attendance"
          icon={<FaCheckCircle />}
          iconClass="bg-emerald-100 text-emerald-700"
        />

        <StatCard
          title="Performance"
          value={`${performance}%`}
          description="Average result"
          icon={<FaChartLine />}
          iconClass="bg-cyan-100 text-cyan-700"
        />

        <StatCard
          title="Weak Students"
          value={dashboard.weakStudents || 0}
          description="Require attention"
          icon={<FaExclamationTriangle />}
          iconClass="bg-red-100 text-red-700"
        />

        <StatCard
          title="Teacher Rating"
          value={dashboard.teacherScore ? `${dashboard.teacherScore}/4` : "0/4"}
          description="Evaluation average"
          icon={<FaStar />}
          iconClass="bg-orange-100 text-orange-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProgressPanel
          title="Attendance Overview"
          description="School-wide recorded attendance"
          value={attendance}
          barClass="bg-emerald-500"
          icon={<FaClipboardCheck />}
        />

        <ProgressPanel
          title="Academic Performance"
          description="Overall published result average"
          value={performance}
          barClass="bg-blue-600"
          icon={<FaChartLine />}
        />
      </div>

      <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-black">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Open frequently used monitoring sections.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickAction
            href="/portals/coordinator/classes"
            title="Class Monitoring"
            description="Review class strength and performance"
            icon={<FaSchool />}
          />

          <QuickAction
            href="/portals/coordinator/attendance"
            title="Attendance Monitoring"
            description="Review class-wise attendance"
            icon={<FaClipboardCheck />}
          />

          <QuickAction
            href="/portals/coordinator/teachers"
            title="Teacher Monitoring"
            description="Review teacher workload and ratings"
            icon={<FaChalkboardTeacher />}
          />

          <QuickAction
            href="/portals/coordinator/performance"
            title="Student Performance"
            description="Find toppers and weak students"
            icon={<FaChartLine />}
          />

          <QuickAction
            href="/portals/coordinator/remarks"
            title="Student Remarks"
            description="Review recent teacher remarks"
            icon={<FaComments />}
          />

          <QuickAction
            href="/portals/coordinator/awards"
            title="Award Recommendations"
            description="Review recommended candidates"
            icon={<FaTrophy />}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-black">Top Student</h2>
              <p className="mt-1 text-sm text-gray-500">
                Highest recorded academic performance.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-700">
              <FaTrophy />
            </div>
          </div>

          {topStudent?.student ? (
            <div className="flex flex-col gap-5 rounded-2xl bg-gray-50 p-5 sm:flex-row sm:items-center">
              {topStudent.student?.user?.avatar ? (
                <img
                  src={getFileUrl(topStudent.student.user.avatar)}
                  alt={topStudent.student.user.name || "Top student"}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-extrabold text-white">
                  {topStudent.student?.user?.name?.charAt(0) || "S"}
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-black">
                  {topStudent.student?.user?.name || "Student"}
                </h3>

                <p className="mt-1 text-sm font-semibold text-gray-500">
                  Academic Top Performer
                </p>

                <div className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-extrabold text-green-700">
                  {Number(topStudent.percentage) || 0}%
                </div>
              </div>
            </div>
          ) : (
            <EmptyState text="No published result is available." />
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-black">
                Recent Remarks
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Latest student observations from teachers.
              </p>
            </div>

            <Link
              href="/portals/coordinator/remarks"
              className="cursor-pointer text-sm font-bold text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentRemarks.length > 0 ? (
            <div className="space-y-3">
              {recentRemarks.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-extrabold text-black">
                        {item.student?.user?.name || "Student"}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {item.remark || "No remark"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        item.isPositive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isPositive ? "Positive" : "Attention"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No student remarks are available." />
          )}
        </section>
      </div>
    </section>
  );
}

function StatCard({ title, value, description, icon, iconClass }) {
  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold text-black">{value}</p>
          <p className="mt-2 text-xs font-semibold text-gray-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

function ProgressPanel({ title, description, value, barClass, icon }) {
  return (
    <article className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl text-black">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-black">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <span className="text-sm font-bold text-gray-500">
          Current progress
        </span>
        <span className="text-3xl font-extrabold text-black">{value}%</span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </article>
  );
}

function QuickAction({ href, title, description, icon }) {
  return (
    <Link
      href={href}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border bg-gray-50 p-5 transition hover:border-black hover:bg-white hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-xl text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold text-black">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <FaArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black" />
    </Link>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed bg-gray-50 p-8 text-center font-semibold text-gray-500">
      {text}
    </div>
  );
}
