"use client";

import Link from "next/link";
import {
  FaIdCard,
  FaFileAlt,
  FaCertificate,
  FaCalendarAlt,
  FaClipboardList,
  FaBell,
  FaMoneyBillWave,
} from "react-icons/fa";

import DashboardCard from "@/components/portals/DashboardCard";

export default function OperatorDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Computer Operator Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage student documents, certificates, ID cards and view academic
          schedules.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Certificates"
          value="Generate"
          icon="📜"
          change="Character / Bonafide"
          color="green"
        />

        <DashboardCard
          title="DMC"
          value="Generate"
          icon="📄"
          change="Download & Print"
          color="blue"
        />

        <DashboardCard
          title="Student Cards"
          value="Print"
          icon="🪪"
          change="Student ID Cards"
          color="gold"
        />

        <DashboardCard
          title="Fee Structure"
          value="View"
          icon="💰"
          change="Latest Fee Details"
          color="black"
        />
      </div>

      {/* Quick Access */}
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-black">
          Quick Access
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <QuickCard
            href="/portals/operator/certificates"
            icon={<FaCertificate />}
            title="Certificates"
            text="Generate Bonafide, Character and other certificates."
          />

          <QuickCard
            href="/portals/operator/dmc"
            icon={<FaFileAlt />}
            title="DMC"
            text="Generate and print student DMC."
          />

          <QuickCard
            href="/portals/operator/student-cards"
            icon={<FaIdCard />}
            title="Student Cards"
            text="Generate and print student ID cards."
          />

          <QuickCard
            href="/portals/operator/timetable"
            icon={<FaCalendarAlt />}
            title="Timetable"
            text="View current class timetable."
          />

          <QuickCard
            href="/portals/operator/datesheet"
            icon={<FaClipboardList />}
            title="Exam Datesheet"
            text="View examination schedules."
          />

          <QuickCard
            href="/portals/operator/notices"
            icon={<FaBell />}
            title="Notices"
            text="Read latest notices and announcements."
          />

          <QuickCard
            href="/portals/operator/fee-structure"
            icon={<FaMoneyBillWave />}
            title="Fee Structure"
            text="View class-wise fee structure."
          />
        </div>
      </section>

      {/* Welcome */}
      <section className="rounded-3xl bg-gradient-to-r from-yellow-50 to-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-black">
          Welcome to the Computer Operator Portal
        </h2>

        <p className="mt-3 leading-7 text-gray-600">
          This portal is designed for generating official student documents,
          including certificates, DMCs, and ID cards. You can also access the
          latest timetables, examination datesheets, notices, and fee
          structures published by the school administration.
        </p>
      </section>
    </div>
  );
}

function QuickCard({ href, icon, title, text }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:border-yellow-500 hover:shadow-lg"
    >
      <div className="mb-4 text-4xl text-yellow-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </Link>
  );
}