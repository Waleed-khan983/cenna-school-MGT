"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { logout } from "@/store/authSlice";

import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaSchool,
  FaBook,
  FaClipboardCheck,
  FaChartBar,
  FaMoneyBillWave,
  FaBell,
  FaCog,
  FaTasks,
  FaVideo,
  FaQuestionCircle,
  FaPhoneAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaImages,
  FaUsersCog,
  FaClipboardList,
  FaComments,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaBriefcase,
  FaExchangeAlt,
} from "react-icons/fa";

const sidebarData = {
  admin: {
    title: "Admin Portal",
    subtitle: "Manage school system",
    links: [
      { name: "Dashboard", href: "/portals/admin", icon: <FaHome /> },
      {
        name: "Registration",
        href: "/portals/admin/registration",
        icon: <FaUserCircle />,
      },
      {
        name: "Students",
        href: "/portals/admin/students",
        icon: <FaUserGraduate />,
      },
      {
        name: "Promotions",
        href: "/portals/admin/promotions",
        icon: <FaExchangeAlt />,
      },
      {
        name: "Class Subjects",
        href: "/portals/admin/class-subjects",
        icon: <FaBook />,
      },
      {
        name: "Teachers",
        href: "/portals/admin/teachers",
        icon: <FaChalkboardTeacher />,
      },
      { name: "Parents", href: "/portals/admin/parents", icon: <FaUsers /> },
      { name: "Classes", href: "/portals/admin/classes", icon: <FaSchool /> },
      { name: "Subjects", href: "/portals/admin/subjects", icon: <FaBook /> },
      {
        name: "Timetable",
        href: "/portals/admin/timetable",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Exam Datesheet",
        href: "/portals/admin/datesheet",
        icon: <FaClipboardList />,
      },
      {
        name: "Attendance",
        href: "/portals/admin/attendance",
        icon: <FaClipboardCheck />,
      },
      { name: "Results", href: "/portals/admin/results", icon: <FaChartBar /> },
      { name: "Fees", href: "/portals/admin/fees", icon: <FaMoneyBillWave /> },
      {
        name: "Job Vacancies",
        href: "/portals/admin/job-vacancies",
        icon: <FaBriefcase />,
      },
      {
        name: "Job Applications",
        href: "/portals/admin/job-applications",
        icon: <FaClipboardList />,
      },
      {
        name: "Alumni Registrations",
        href: "/portals/admin/alumni-registrations",
        icon: <FaUserGraduate />,
      },
      { name: "News", href: "/portals/admin/news", icon: <FaBell /> },
      { name: "Gallery", href: "/portals/admin/gallery", icon: <FaImages /> },
      { name: "Users", href: "/portals/admin/users", icon: <FaUsersCog /> },
      {
        name: "Evaluations",
        href: "/portals/admin/evaluations",
        icon: <FaClipboardList />,
      },
      {
        name: "Notifications",
        href: "/portals/admin/notifications",
        icon: <FaBell />,
      },
      { name: "Settings", href: "/portals/admin/settings", icon: <FaCog /> },
    ],
  },

  student: {
    title: "Student Portal",
    subtitle: "Learning dashboard",
    links: [
      { name: "Dashboard", href: "/portals/student", icon: <FaHome /> },
      { name: "Subjects", href: "/portals/student/subjects", icon: <FaBook /> },
      {
        name: "Timetable",
        href: "/portals/student/timetable",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Exam Datesheet",
        href: "/portals/student/datesheet",
        icon: <FaClipboardList />,
      },
      {
        name: "Live Classes",
        href: "/portals/student/live-classes",
        icon: <FaVideo />,
      },
      {
        name: "Lectures",
        href: "/portals/student/lectures",
        icon: <FaVideo />,
      },
      {
        name: "Assignments",
        href: "/portals/student/assignments",
        icon: <FaTasks />,
      },
      {
        name: "Quizzes",
        href: "/portals/student/quizzes",
        icon: <FaQuestionCircle />,
      },
      {
        name: "Teacher Evaluation",
        href: "/portals/student/evaluation",
        icon: <FaClipboardList />,
      },
      {
        name: "Attendance",
        href: "/portals/student/attendance",
        icon: <FaClipboardCheck />,
      },
      {
        name: "Results",
        href: "/portals/student/results",
        icon: <FaChartBar />,
      },
      {
        name: "Fees",
        href: "/portals/student/fees",
        icon: <FaMoneyBillWave />,
      },
      { name: "Notices", href: "/portals/student/notices", icon: <FaBell /> },
    ],
  },

  teacher: {
    title: "Teacher Portal",
    subtitle: "Class management",
    links: [
      { name: "Dashboard", href: "/portals/teacher", icon: <FaHome /> },
      {
        name: "Attendance",
        href: "/portals/teacher/attendance",
        icon: <FaClipboardCheck />,
      },
      {
        name: "Lectures",
        href: "/portals/teacher/lectures",
        icon: <FaVideo />,
      },
      {
        name: "Live Classes",
        href: "/portals/teacher/live-classes",
        icon: <FaVideo />,
      },
      {
        name: "Assignments",
        href: "/portals/teacher/assignments",
        icon: <FaTasks />,
      },
      {
        name: "Quizzes",
        href: "/portals/teacher/quizzes",
        icon: <FaQuestionCircle />,
      },
      {
        name: "Results",
        href: "/portals/teacher/results",
        icon: <FaChartBar />,
      },
      {
        name: "Remarks",
        href: "/portals/teacher/remarks",
        icon: <FaComments />,
      },
      {
        name: "Evaluations",
        href: "/portals/teacher/evaluations",
        icon: <FaClipboardList />,
      },
      { name: "Notices", href: "/portals/teacher/notices", icon: <FaBell /> },
    ],
  },

  parent: {
    title: "Parent Portal",
    subtitle: "Child progress view",
    links: [
      { name: "Dashboard", href: "/portals/parent", icon: <FaHome /> },
      {
        name: "My Children",
        href: "/portals/parent/children",
        icon: <FaUsers />,
      },
      {
        name: "Attendance",
        href: "/portals/parent/attendance",
        icon: <FaClipboardCheck />,
      },
      {
        name: "Results",
        href: "/portals/parent/results",
        icon: <FaChartBar />,
      },
      {
        name: "Assignments",
        href: "/portals/parent/assignments",
        icon: <FaTasks />,
      },
      { name: "Fees", href: "/portals/parent/fees", icon: <FaMoneyBillWave /> },
      {
        name: "Evaluations",
        href: "/portals/parent/evaluations",
        icon: <FaClipboardList />,
      },
      { name: "Notices", href: "/portals/parent/notices", icon: <FaBell /> },
      {
        name: "Contact School",
        href: "/portals/parent/contact",
        icon: <FaPhoneAlt />,
      },
    ],
  },

  coordinator: {
    title: "Coordinator Portal",
    subtitle: "Academic Supervision",
    links: [
      {
        name: "Dashboard",
        href: "/portals/coordinator",
        icon: <FaHome />,
      },
      {
        name: "Class Monitoring",
        href: "/portals/coordinator/classes",
        icon: <FaSchool />,
      },
      {
        name: "Attendance Monitoring",
        href: "/portals/coordinator/attendance",
        icon: <FaClipboardCheck />,
      },
      {
        name: "Teacher Monitoring",
        href: "/portals/coordinator/teachers",
        icon: <FaChalkboardTeacher />,
      },
      {
        name: "Student Performance",
        href: "/portals/coordinator/performance",
        icon: <FaChartBar />,
      },
      {
        name: "Student Remarks",
        href: "/portals/coordinator/remarks",
        icon: <FaComments />,
      },
      {
        name: "Award Recommendations",
        href: "/portals/coordinator/awards",
        icon: <FaUsers />,
      },
      {
        name: "Evaluations",
        href: "/portals/coordinator/evaluations",
        icon: <FaClipboardList />,
      },
    ],
  },

  accountant: {
    title: "Accountant Portal",
    subtitle: "Finance management",
    links: [
      { name: "Dashboard", href: "/portals/accountant", icon: <FaHome /> },
      {
        name: "Students",
        href: "/portals/accountant/students",
        icon: <FaUserGraduate />,
      },
      {
        name: "Fee Collection",
        href: "/portals/accountant/fee-collection",
        icon: <FaMoneyBillWave />,
      },
      {
        name: "Fee Challans",
        href: "/portals/accountant/fee-challans",
        icon: <FaClipboardList />,
      },
      {
        name: "Fee Defaulters",
        href: "/portals/accountant/fee-defaulters",
        icon: <FaUsers />,
      },
      {
        name: "Payment History",
        href: "/portals/accountant/payment-history",
        icon: <FaChartBar />,
      },
      {
        name: "Notices",
        href: "/portals/accountant/notices",
        icon: <FaBell />,
      },
    ],
  },

  operator: {
    title: "Computer Operator Portal",
    subtitle: "Certificates & cards",
    links: [
      { name: "Dashboard", href: "/portals/operator", icon: <FaHome /> },
      {
        name: "Certificates",
        href: "/portals/operator/certificates",
        icon: <FaClipboardList />,
      },
      { name: "DMC", href: "/portals/operator/dmc", icon: <FaChartBar /> },
      {
        name: "Student Cards",
        href: "/portals/operator/student-cards",
        icon: <FaUserGraduate />,
      },
      {
        name: "Exam Datesheet",
        href: "/portals/operator/datesheet",
        icon: <FaClipboardList />,
      },
      {
        name: "Timetable",
        href: "/portals/operator/timetable",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Fee Structure",
        href: "/portals/operator/fee-structure",
        icon: <FaMoneyBillWave />,
      },
      { name: "Notices", href: "/portals/operator/notices", icon: <FaBell /> },
    ],
  },
};

function getPortalRole(pathname) {
  if (pathname.startsWith("/portals/student")) return "student";
  if (pathname.startsWith("/portals/teacher")) return "teacher";
  if (pathname.startsWith("/portals/parent")) return "parent";
  if (pathname.startsWith("/portals/coordinator")) return "coordinator";
  if (pathname.startsWith("/portals/accountant")) return "accountant";
  if (pathname.startsWith("/portals/operator")) return "operator";

  return "admin";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const role = getPortalRole(pathname);
  const sidebar = sidebarData[role] || sidebarData.admin;

  const closeSidebar = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-black text-xl text-white shadow-lg transition hover:bg-black/80 lg:hidden"
        aria-label="Open sidebar"
      >
        <FaBars />
      </button>

      {open && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-[80] bg-black/60 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[90] flex h-screen w-80 shrink-0 flex-col bg-black text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={closeSidebar}
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>

        <div className="border-b border-white/10 p-8 text-center">
          <div className="flex justify-center">
            <Image
              src="/images/logo.jpg"
              alt="CENNA Logo"
              width={92}
              height={92}
              className="rounded-full border-2 border-yellow-500 object-cover"
              priority
            />
          </div>

          <p className="mt-4 text-lg font-bold text-white">{sidebar.title}</p>
          <p className="mt-1 text-sm text-gray-400">{sidebar.subtitle}</p>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto p-6">
          {sidebar.links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-semibold transition ${
                  active
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-6">
          <Link
            href={`/portals/${role}/profile`}
            onClick={closeSidebar}
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-semibold transition ${
              pathname === `/portals/${role}/profile`
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FaUserCircle className="text-lg" />
            <span>My Profile</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-base font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
