"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaUserGraduate,
  FaSchool,
  FaClipboardCheck,
  FaChartLine,
  FaMoneyBillWave,
  FaBookOpen,
} from "react-icons/fa";

import { fetchMyParentProfile } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentChildrenPage() {
  const dispatch = useDispatch();

  const { children = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyParentProfile());
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading children..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">My Children</h1>
        <p className="mt-2 text-gray-500">
          View all children linked to your parent account.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {children.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {children.map((child) => (
            <div key={child._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-2xl text-yellow-600">
                  <FaUserGraduate />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-black">
                    {child.user?.name || "Student"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Admission No: {child.admissionNo || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<FaSchool />}
                  label="Class"
                  value={
                    child.class?.displayName ||
                    `${child.class?.name || "N/A"} - ${child.section || "A"}`
                  }
                />

                <InfoCard
                  icon={<FaBookOpen />}
                  label="Roll Number"
                  value={child.rollNumber || "N/A"}
                />

                <InfoCard
                  icon={<FaClipboardCheck />}
                  label="Status"
                  value={child.isActive ? "Active" : "Inactive"}
                />

                <InfoCard
                  icon={<FaChartLine />}
                  label="Father Name"
                  value={child.fatherName || "N/A"}
                />

                <InfoCard
                  icon={<FaMoneyBillWave />}
                  label="Gender"
                  value={child.gender || "N/A"}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/portals/parent/attendance?studentId=${child._id}`}
                  className="rounded-xl bg-black px-4 py-2 font-semibold text-white"
                >
                  View Attendance
                </Link>

                <Link
                  href={`/portals/parent/results?studentId=${child._id}`}
                  className="rounded-xl border border-black px-4 py-2 font-semibold"
                >
                  View Results
                </Link>

                <Link
                  href={`/portals/parent/assignments?studentId=${child._id}`}
                  className="rounded-xl border border-black px-4 py-2 font-semibold"
                >
                  View Assignments
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-600">
            No Children Linked
          </h2>
          <p className="mt-2 text-gray-500">
            No student is currently linked to this parent account.
          </p>
        </div>
      )}
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 flex items-center gap-2 text-yellow-600">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <p className="font-bold text-black">{value}</p>
    </div>
  );
}