"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyChildrenRemarks } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function ParentBehaviorPage() {
  const dispatch = useDispatch();

  const { remarks = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  useEffect(() => {
    dispatch(fetchMyChildrenRemarks());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading behavior records..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Behavior & Remarks
      </h1>
      <p className="mb-6 text-gray-500">
        View teacher remarks and behavior records for your children.
      </p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && remarks.length > 0 ? (
        <div className="space-y-5">
          {remarks.map((item) => (
            <div key={item._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-black">
                  {item.student?.user?.name || "Student"}
                </h2>

                <span className="text-xs text-gray-400">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <p
                className={`mt-2 font-bold ${
                  item.isPositive ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {item.type || "General"}
              </p>

              <p className="text-gray-500">{item.remark}</p>

              <p className="mt-2 text-xs text-gray-400">
                {item.teacher?.user?.name
                  ? `By ${item.teacher.user.name}`
                  : ""}
                {item.subject?.name ? ` · ${item.subject.name}` : ""}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No behavior records found.
          </div>
        )
      )}
    </section>
  );
}
