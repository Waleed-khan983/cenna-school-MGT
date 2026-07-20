"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyStudentRemarks } from "@/store/remarkSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function StudentBehaviorPage() {
  const dispatch = useDispatch();

  const { remarks = [], loading, error } = useSelector(
    (state) => state.remarks || {}
  );

  useEffect(() => {
    dispatch(fetchMyStudentRemarks());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading behavior records..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Behavior & Remarks
      </h1>
      <p className="mb-6 text-gray-500">View teacher feedback and behavior records.</p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && remarks.length > 0 ? (
        <div className="space-y-5">
          {remarks.map((item) => (
            <div key={item._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2
                className={`text-xl font-bold ${
                  item.isPositive ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {item.type || "General"}
              </h2>
              <p className="mt-2 text-gray-500">
                Teacher: {item.teacher?.user?.name || "N/A"}
              </p>
              <p className="text-gray-500">
                Date:{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mt-3 text-gray-700">{item.remark}</p>
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
