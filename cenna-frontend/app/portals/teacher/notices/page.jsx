"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/notificationSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function TeacherNoticesPage() {
  const dispatch = useDispatch();

  const { notifications = [], unreadCount = 0, loading, error } = useSelector(
    (state) => state.notifications || {}
  );

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const handleRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleReadAll = () => {
    dispatch(markAllNotificationsRead()).then(() => {
      dispatch(fetchMyNotifications());
    });
  };

  if (loading) return <PageLoader text="Loading notices..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Teacher Notices</h1>
          <p className="mt-1 text-sm text-gray-500">
            School announcements and important updates for teachers.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
          >
            Mark All Read
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-extrabold text-black">Notices</h2>
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
            {unreadCount} unread
          </span>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notice) => {
              const isRead = notice.readBy?.length > 0;

              return (
                <div
                  key={notice._id}
                  className={`rounded-2xl border p-5 ${
                    isRead ? "bg-gray-50" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-black">
                        {notice.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {notice.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                        <span className="rounded-full bg-black px-3 py-1 text-white">
                          {notice.type || "general"}
                        </span>

                        <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">
                          {notice.priority || "normal"}
                        </span>

                        <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">
                          {notice.sentAt
                            ? new Date(notice.sentAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {!isRead && (
                      <button
                        onClick={() => handleRead(notice._id)}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-10 text-center font-semibold text-gray-500">
            No notices found.
          </div>
        )}
      </div>
    </section>
  );
}