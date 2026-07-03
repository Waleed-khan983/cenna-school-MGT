"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBook,
  FaSchool,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function TeacherClassesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const {
    teacher,
    assignments = [],
    loading,
    error,
  } = useSelector((state) => state.teacherAssignments || {});

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
  }, [dispatch]);

  const filteredAssignments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return assignments;

    return assignments.filter((item) => {
      const className =
        item.class?.displayName?.toLowerCase() ||
        item.class?.name?.toLowerCase() ||
        "";

      const subjectName = item.subject?.name?.toLowerCase() || "";
      const subjectCode = item.subject?.code?.toLowerCase() || "";

      return (
        className.includes(value) ||
        subjectName.includes(value) ||
        subjectCode.includes(value)
      );
    });
  }, [assignments, search]);

  if (loading) return <PageLoader text="Loading assigned classes..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            My Classes & Subjects
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View the classes and subjects assigned to you.
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search class or subject..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Teacher" value={teacher?.user?.name || "N/A"} />
        <Card title="Total Assignments" value={assignments.length} />
        <Card
          title="Classes"
          value={new Set(assignments.map((item) => item.class?._id)).size || 0}
        />
        <Card
          title="Subjects"
          value={
            new Set(assignments.map((item) => item.subject?._id)).size || 0
          }
        />
      </div>

      {filteredAssignments.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                  <FaSchool />
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Active
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-black">
                {item.class?.displayName ||
                  `${item.class?.name || ""} - ${item.class?.section || ""}`}
              </h2>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                Room: {item.class?.room || "N/A"}
              </p>

              <div className="mt-5 space-y-3">
                <Info
                  icon={<FaBook />}
                  label="Subject"
                  value={item.subject?.name}
                />

                <Info
                  icon={<FaClipboardList />}
                  label="Subject Code"
                  value={item.subject?.code}
                />

                <Info
                  icon={<FaCheckCircle />}
                  label="Marks"
                  value={`${item.subject?.passMark || 40}/${
                    item.subject?.maxMarks || 100
                  } Pass`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-500">
            No class-subject assignments found.
          </p>
        </div>
      )}
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-3 text-2xl font-extrabold text-black">{value}</h2>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
      <div className="text-gray-500">{icon}</div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="font-semibold text-black">{value || "N/A"}</p>
      </div>
    </div>
  );
}
