"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaUserGraduate } from "react-icons/fa";

import { fetchStudents } from "@/store/studentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function AccountantStudentsPage() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const { students = [], loading, error } = useSelector(
    (state) => state.students || {}
  );

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return students;

    return students.filter((student) => {
      const name = student.user?.name?.toLowerCase() || "";
      const admissionNo = student.admissionNo?.toLowerCase() || "";
      const className = student.class?.displayName?.toLowerCase() || "";
      const fatherName = student.fatherName?.toLowerCase() || "";
      const phone = student.user?.phone?.toLowerCase() || "";

      return (
        name.includes(value) ||
        admissionNo.includes(value) ||
        className.includes(value) ||
        fatherName.includes(value) ||
        phone.includes(value)
      );
    });
  }, [students, search]);

  if (loading) {
    return <PageLoader text="Loading students..." />;
  }

  return (
    <section className="space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
            Students
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Search students and manage fee records.
          </p>
        </div>

        <div className="relative w-full xl:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, admission no, class..."
            className="w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-extrabold text-black sm:text-xl">
            Student Records
          </h2>
          <p className="text-sm font-bold text-gray-500">
            Total: {filteredStudents.length}
          </p>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-10 text-center font-semibold text-gray-500">
            No students found.
          </div>
        )}
      </div>
    </section>
  );
}

function StudentCard({ student }) {
  return (
    <div className="rounded-3xl border bg-gray-50 p-5 transition hover:border-yellow-400 hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-600">
          <FaUserGraduate />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-extrabold text-black">
            {student.user?.name || "N/A"}
          </h3>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            {student.admissionNo || "No Admission No"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <Info label="Class" value={student.class?.displayName || "N/A"} />
        <Info label="Father Name" value={student.fatherName || "N/A"} />
        <Info label="Phone" value={student.user?.phone || "N/A"} />
        <Info label="Gender" value={student.gender || "N/A"} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <ActionButton
          href={`/portals/accountant/fee-collection?studentId=${student._id}`}
          text="Collect"
          primary
        />

        <ActionButton
          href={`/portals/accountant/fee-challan?studentId=${student._id}`}
          text="Challan"
          yellow
        />

        <ActionButton
          href={`/portals/accountant/payment-history?studentId=${student._id}`}
          text="History"
        />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="truncate text-sm font-bold text-black">{value}</p>
    </div>
  );
}

function ActionButton({ href, text, primary, yellow }) {
  const className = primary
    ? "bg-black text-white hover:bg-gray-800"
    : yellow
    ? "bg-yellow-500 text-black hover:bg-yellow-400"
    : "border bg-white text-black hover:bg-gray-100";

  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2.5 text-center text-sm font-extrabold transition ${className}`}
    >
      {text}
    </Link>
  );
}