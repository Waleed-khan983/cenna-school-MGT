"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchClassMonitoring } from "@/store/coordinatorSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function CoordinatorClassesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const {
    classes = [],
    loading,
  } = useSelector((state) => state.coordinator);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.displayName?.toLowerCase().includes(keyword) ||
        item.classTeacher?.user?.name
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [classes, search]);



  // -------------------------------
  // Load
  // -------------------------------
  useEffect(() => {
    dispatch(fetchClassMonitoring())
      .unwrap()
      .then((data) => {
        console.log("Coordinator API:", data);
      })
      .catch(console.error);
  }, [dispatch]);

  if (loading) {
    return <PageLoader text="Loading classes..." />;
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Class Monitoring
      </h1>

      <p className="mb-8 text-gray-500">
        Monitor every class, assigned teacher and student strength.
      </p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by class or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.map((item) => (
          <div
            key={item._id}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">
              {item.displayName}
            </h2>

            <div className="mt-5 space-y-2">
              <p>
                <span className="font-semibold">
                  Class Teacher:
                </span>{" "}
                {item.classTeacher?.user?.name || "Not Assigned"}
              </p>

              <p>
                <span className="font-semibold">
                  Students:
                </span>{" "}
                {item.studentCount || 0}
              </p>

              <p>
                <span className="font-semibold">
                  Boys:
                </span>{" "}
                {item.boys}
              </p>

              <p>
                <span className="font-semibold">
                  Girls:
                </span>{" "}
                {item.girls}
              </p>

              <p>
                <span className="font-semibold">
                  Attendance:
                </span>{" "}
                {item.attendancePercentage}%
              </p>

              <p>
                <span className="font-semibold">
                  Average Performance:
                </span>{" "}
                {item.averagePerformance}%
              </p>

              <p>
                <span className="font-semibold">
                  Weak Students:
                </span>{" "}
                {item.weakStudents}
              </p>

              <p>
                <span className="font-semibold">
                  Top Student:
                </span>{" "}
                {item.topStudent?.user?.name || "-"}
              </p>

              <p>
                <span className="font-semibold">
                  Room:
                </span>{" "}
                {item.room || "-"}
              </p>

              <p>
                <span className="font-semibold">
                  Capacity:
                </span>{" "}
                {item.capacity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredClasses.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
          No classes found.
        </div>
      )}
    </section>
  );
}