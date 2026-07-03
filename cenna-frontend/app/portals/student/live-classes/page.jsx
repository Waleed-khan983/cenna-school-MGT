"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchStudentLiveClasses,
  joinLiveClass,
} from "@/store/liveClassSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function StudentLiveClassesPage() {
  const dispatch = useDispatch();

  const {
    liveClasses = [],
    loading,
    error,
  } = useSelector(
    (state) => state.liveClasses || {}
  );

  useEffect(() => {
    dispatch(fetchStudentLiveClasses());
  }, [dispatch]);

  const handleJoin = async (liveClass) => {
    try {
      const response = await dispatch(
        joinLiveClass(liveClass._id)
      ).unwrap();

      window.open(
        response.meetingLink,
        "_blank"
      );

      toast.success("Joining class...");
    } catch (error) {
      toast.error(
        error || "Failed to join class"
      );
    }
  };

  if (loading) {
    return (
      <PageLoader text="Loading live classes..." />
    );
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Live Classes
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Join your scheduled online classes.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {liveClasses.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {liveClasses.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-extrabold text-black">
                {item.title}
              </h2>

              <p className="mt-2 text-gray-500">
                Subject:
                {" "}
                {item.subject?.name}
              </p>

              <p className="text-gray-500">
                Teacher:
                {" "}
                {item.teacher?.user?.name}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Start:
                {" "}
                {new Date(
                  item.startTime
                ).toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                End:
                {" "}
                {new Date(
                  item.endTime
                ).toLocaleString()}
              </p>

              <p className="mt-3 rounded-lg bg-green-100 px-3 py-2 text-center text-sm font-bold text-green-700">
                {item.meetingPlatform || "Jitsi"}
              </p>

              <button
                onClick={() =>
                  handleJoin(item)
                }
                className="mt-5 w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800 cursor-pointer"
              >
                Join Class
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-600">
            No Live Classes Available
          </h2>

          <p className="mt-2 text-gray-500">
            Your teacher has not scheduled any
            live classes yet.
          </p>
        </div>
      )}
    </section>
  );
}