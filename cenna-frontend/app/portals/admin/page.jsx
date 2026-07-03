"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaSchool,
  FaBook,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaNewspaper,
  FaImages,
  FaBell,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";

import { fetchDashboardStats } from "@/store/dashboardSlice";
import PageLoader from "@/components/ui/PageLoader";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
];

export default function AdminDashboardPage() {
  const dispatch = useDispatch();

  const { stats = {}, loading } = useSelector((state) => state.dashboard || {});

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading dashboard..." />;

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents || 0,
      icon: <FaUserGraduate />,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers || 0,
      icon: <FaChalkboardTeacher />,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Total Parents",
      value: stats.totalParents || 0,
      icon: <FaUsers />,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses || 0,
      icon: <FaSchool />,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects || 0,
      icon: <FaBook />,
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      title: "Fees Collected",
      value: `PKR ${Number(stats.totalCollected || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Fees Pending",
      value: `PKR ${Number(stats.totalPending || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Attendance %",
      value: `${stats.attendancePercentage || 0}%`,
      icon: <FaClipboardCheck />,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "News Articles",
      value: stats.totalNews || 0,
      icon: <FaNewspaper />,
      bg: "bg-cyan-50",
      text: "text-cyan-600",
    },
    {
      title: "Gallery Images",
      value: stats.totalGallery || 0,
      icon: <FaImages />,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      title: "Notifications",
      value: stats.totalNotifications || 0,
      icon: <FaBell />,
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      title: "Upcoming Exams",
      value: stats.upcomingExams || 0,
      icon: <FaCalendarAlt />,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  ];

  const roleChartData = [
    { name: "Students", value: stats.totalStudents || 0 },
    { name: "Teachers", value: stats.totalTeachers || 0 },
    { name: "Parents", value: stats.totalParents || 0 },
  ];

  const feeChartData = [
    { name: "Collected", value: stats.totalCollected || 0 },
    { name: "Pending", value: stats.totalPending || 0 },
  ];

  const monthlyAdmissions = stats.monthlyAdmissions?.length
    ? stats.monthlyAdmissions
    : [
        { month: "Jan", students: 0 },
        { month: "Feb", students: 0 },
        { month: "Mar", students: 0 },
        { month: "Apr", students: 0 },
        { month: "May", students: 0 },
        { month: "Jun", students: 0 },
      ];

  const monthlyFees = stats.monthlyFees?.length
    ? stats.monthlyFees
    : [
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 },
        { month: "May", amount: 0 },
        { month: "Jun", amount: 0 },
      ];

  const recentStudents = stats.recentStudents || [];
  const recentNotifications = stats.recentNotifications || [];
  const recentExams = stats.recentExams || [];

  return (
    <section className="space-y-8 p-3 sm:p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete analytics overview of CENNA School Management System.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-500">{card.title}</p>
                <h2 className="mt-3 text-2xl font-extrabold text-black">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${card.bg} ${card.text}`}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Users Overview"
          subtitle="Students, teachers and parents registered in the system"
        >
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={roleChartData} barSize={48}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[14, 14, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Fee Overview"
          subtitle="Collected fee compared with pending balance"
        >
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={feeChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={6}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {feeChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Monthly Admissions"
          subtitle="New student admissions by month"
        >
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={monthlyAdmissions}>
              <defs>
                <linearGradient
                  id="studentsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="students"
                stroke="#16a34a"
                strokeWidth={4}
                fill="url(#studentsGradient)"
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Monthly Fee Collection"
          subtitle="Fee collection trend across months"
        >
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={monthlyFees}>
              <defs>
                <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#f59e0b"
                strokeWidth={4}
                fill="url(#feeGradient)"
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Recent Students">
          {recentStudents.length > 0 ? (
            recentStudents.map((student) => (
              <InfoItem key={student._id}>
                <p className="font-bold text-black">
                  {student.user?.name || "Unnamed Student"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Admission No: {student.admissionNo || "N/A"}
                </p>
              </InfoItem>
            ))
          ) : (
            <EmptyText text="No recent students found." />
          )}
        </InfoCard>

        <InfoCard title="Recent Notifications">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((item) => (
              <InfoItem key={item._id}>
                <p className="font-bold text-black">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {item.message}
                </p>
              </InfoItem>
            ))
          ) : (
            <EmptyText text="No recent notifications found." />
          )}
        </InfoCard>

        <InfoCard title="Upcoming Exams">
          {recentExams.length > 0 ? (
            recentExams.map((exam) => (
              <InfoItem key={exam._id}>
                <p className="font-bold text-black">
                  {exam.subjectId?.name || "Subject"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {exam.classId?.displayName || exam.classId?.name || "Class"}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-400">
                  {exam.examDate
                    ? new Date(exam.examDate).toLocaleDateString()
                    : "No date"}
                </p>
              </InfoItem>
            ))
          ) : (
            <EmptyText text="No upcoming exams found." />
          )}
        </InfoCard>
      </div>
    </section>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-3xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-black">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {children}
    </motion.div>
  );
}

function InfoCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-xl font-extrabold text-black">{title}</h2>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function InfoItem({ children }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm">
      {children}
    </div>
  );
}

function EmptyText({ text }) {
  return (
    <p className="rounded-2xl bg-gray-50 p-5 text-center text-sm font-semibold text-gray-500">
      {text}
    </p>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-extrabold text-black">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="text-sm font-semibold text-gray-600">
          {item.name}:{" "}
          <span className="font-extrabold text-black">
            {Number(item.value || 0).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
}
