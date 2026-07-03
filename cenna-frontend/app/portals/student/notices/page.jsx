"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/notificationSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function NoticesPage() {
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const handleRead = async (id) => {
    await dispatch(markNotificationRead(id));
    dispatch(fetchMyNotifications());
  };

  const handleReadAll = async () => {
    await dispatch(markAllNotificationsRead());
    dispatch(fetchMyNotifications());
  };

  if (loading) return <PageLoader text="Loading notices..." />;

  return (
    <section className="p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Notices
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View school notices and announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleReadAll}
            className="!cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            Mark All Read ({unreadCount})
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-bold capitalize text-white">
                      {item.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        item.priority === "urgent"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "important"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-black">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    Sent by {item.sentBy?.name || "Admin"} ·{" "}
                    {item.sentAt
                      ? new Date(item.sentAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRead(item._id)}
                  className="!cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-black hover:bg-black hover:text-white"
                >
                  Mark Read
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500">
            No notices available.
          </div>
        )}
      </div>
    </section>
  );
}