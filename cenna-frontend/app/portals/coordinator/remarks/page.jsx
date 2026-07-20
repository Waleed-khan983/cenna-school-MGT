"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentRemarks } from "@/store/coordinatorSlice";

export default function CoordinatorRemarksPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { remarks = [],loading} = useSelector(
    (state) => state.coordinator
  );

  const filteredRemarks = useMemo(() => {
    const keyword = search.toLowerCase();

     if (loading) {
        return <PageLoader text="Loading remarks..." />;
      }

    return remarks.filter((item) => {
      return (
        item.student?.user?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.teacher?.user?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.class?.displayName
          ?.toLowerCase()
          .includes(keyword) ||
        item.subject?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.type?.toLowerCase().includes(keyword)
      );
    });
  }, [remarks, search]);

  useEffect(() => {
    dispatch(fetchStudentRemarks());
  }, [dispatch]);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">
        Student Remarks
      </h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by student, teacher, class, subject or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      <div className="space-y-4">
        {filteredRemarks.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl bg-white p-5 shadow"
          >
            <h2 className="font-bold">
              {item.student?.user?.name}
            </h2>

            <p>
              <span className="font-semibold">
                Teacher:
              </span>{" "}
              {item.teacher?.user?.name}
            </p>

            <p>
              <span className="font-semibold">
                Class:
              </span>{" "}
              {item.class?.displayName}
            </p>

            <p>
              <span className="font-semibold">
                Subject:
              </span>{" "}
              {item.subject?.name || "-"}
            </p>

            <p>
              <span className="font-semibold">
                Type:
              </span>{" "}
              {item.type}
            </p>

            <p>
              <span className="font-semibold">
                Remark:
              </span>{" "}
              {item.remark}
            </p>

            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${item.isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {item.isPositive
                ? "Positive"
                : "Needs Attention"}
            </span>
          </div>
        ))}
      </div>

      {!loading && filteredRemarks.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
          No remarks found.
        </div>
      )}
    </section>
  );
}