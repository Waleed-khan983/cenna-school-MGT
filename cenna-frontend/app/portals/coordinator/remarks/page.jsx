"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchStudentRemarks } from "@/store/coordinatorSlice";

export default function CoordinatorRemarksPage() {
  const dispatch = useDispatch();

  const { remarks = [] } = useSelector(
    (state) => state.coordinator
  );

  useEffect(() => {
    dispatch(fetchStudentRemarks());
  }, [dispatch]);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">
        Student Remarks
      </h1>

      <div className="space-y-4">
        {remarks.map((item) => (
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
              className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${
                item.isPositive
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
    </section>
  );
}