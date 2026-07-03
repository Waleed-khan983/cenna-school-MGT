"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentProfile } from "@/store/studentProfileSlice";
import { fetchMyResults } from "@/store/studentResultSlice";
import { fetchStudentLiveClasses } from "@/store/liveClassSlice";
import { fetchStudentLectures } from "@/store/lectureSlice";
import { fetchStudentAssignments } from "@/store/assignmentSlice";
import { fetchStudentQuizzes } from "@/store/quizSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function StudentDashboardPage() {
  const dispatch = useDispatch();

  const { student, loading: profileLoading } = useSelector(
    (state) => state.studentProfile || {}
  );

  const { results = [] } = useSelector((state) => state.studentResults || {});
  const { liveClasses = [] } = useSelector((state) => state.liveClasses || {});
  const { lectures = [] } = useSelector((state) => state.lectures || {});
  const { assignments = [] } = useSelector((state) => state.assignments || {});
  const { quizzes = [] } = useSelector((state) => state.quizzes || {});

  useEffect(() => {
    dispatch(fetchStudentProfile());
    dispatch(fetchMyResults());
    dispatch(fetchStudentLiveClasses());
    dispatch(fetchStudentLectures());
    dispatch(fetchStudentAssignments());
    dispatch(fetchStudentQuizzes());
  }, [dispatch]);

  const latestResult = results?.[0];

  const pendingAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (!item.dueDate) return true;
      return new Date(item.dueDate) >= new Date();
    });
  }, [assignments]);

  const upcomingLiveClasses = useMemo(() => {
    return liveClasses
      .filter((item) => item.startTime && new Date(item.startTime) >= new Date())
      .slice(0, 3);
  }, [liveClasses]);

  const pendingQuizzes = quizzes.filter((quiz) => !quiz.attempted);

  if (profileLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <section className="space-y-8 p-4 md:p-6">
      <div className="rounded-3xl bg-gradient-to-r from-black to-gray-800 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold text-yellow-400">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
          {student?.user?.name || "Student"}
        </h1>

        <p className="mt-2 text-gray-300">
          {student?.class?.displayName || "Your Class"} • CENNA School Portal
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <QuickLink href="/portals/student/live-classes" text="Join Live Class" />
          <QuickLink href="/portals/student/assignments" text="View Assignments" />
          <QuickLink href="/portals/student/results" text="Check Results" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Latest Percentage" value={latestResult ? `${latestResult.percentage}%` : "N/A"} />
        <StatCard title="Latest Grade" value={latestResult?.grade || "N/A"} />
        <StatCard title="Pending Assignments" value={pendingAssignments.length} />
        <StatCard title="Pending Quizzes" value={pendingQuizzes.length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Upcoming Live Classes" href="/portals/student/live-classes">
          {upcomingLiveClasses.length > 0 ? (
            upcomingLiveClasses.map((item) => (
              <MiniItem
                key={item._id}
                title={item.title}
                subtitle={`${item.subject?.name || "Subject"} • ${item.startTime ? new Date(item.startTime).toLocaleString() : "N/A"
                  }`}
              />
            ))
          ) : (
            <Empty text="No upcoming live classes." />
          )}
        </Panel>

        <Panel title="Recent Lectures" href="/portals/student/lectures">
          {lectures.slice(0, 3).map((item) => (
            <MiniItem
              key={item._id}
              title={item.title}
              subtitle={item.subject?.name || "Subject"}
            />
          ))}

          {lectures.length === 0 && <Empty text="No lectures uploaded yet." />}
        </Panel>

        <Panel title="Assignments" href="/portals/student/assignments">
          {assignments.slice(0, 3).map((item) => (
            <MiniItem
              key={item._id}
              title={item.title}
              subtitle={
                item.dueDate
                  ? `Due: ${new Date(item.dueDate).toLocaleDateString()}`
                  : "No due date"
              }
            />
          ))}

          {assignments.length === 0 && <Empty text="No assignments yet." />}
        </Panel>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold text-black">
          Academic Summary
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <SummaryBox label="Total Results" value={results.length} />
          <SummaryBox label="Total Lectures" value={lectures.length} />
          <SummaryBox label="Total Live Classes" value={liveClasses.length} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-3 text-4xl font-extrabold text-black">{value}</h2>
    </div>
  );
}

function Panel({ title, href, children }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
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

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <h3 className="mt-2 text-3xl font-extrabold text-black">{value}</h3>
    </div>
  );
}