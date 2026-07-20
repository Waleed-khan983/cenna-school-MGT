"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/store/notificationSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function TeacherNotificationsPage() {
  const dispatch = useDispatch();

  const { notifications = [], unreadCount = 0, loading, error } = useSelector(
    (state) => state.notifications || {}
  );

  const currentUserId = useSelector((state) => state.auth?.user?.id);

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const isRead = (notice) =>
    notice.readBy?.some(
      (id) => id === "me" || String(id) === String(currentUserId)
    );

  const handleRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  const handleReadAll = () => {
    dispatch(markAllNotificationsRead()).then(() => {
      dispatch(fetchMyNotifications());
    });
  };

  if (loading) return <PageLoader text="Loading notifications..." />;

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Notifications
          </h1>
          <p className="mt-1 text-gray-500">
            View teaching and school notifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleReadAll}
            className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
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

      {!error && notifications.length > 0 ? (
        <div className="space-y-5">
          {notifications.map((item) => {
            const read = isRead(item);

            return (
              <div
                key={item._id}
                className={`rounded-3xl border p-6 shadow-sm ${
                  read ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold capitalize text-black">
                      {item.type || "Notification"}
                    </h2>
                    <p className="mt-2 text-gray-500">{item.message}</p>
                    <p className="mt-3 text-xs text-gray-400">
                      {item.sentAt
                        ? new Date(item.sentAt).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  {!read && (
                    <button
                      type="button"
                      onClick={() => handleRead(item._id)}
                      className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-black hover:bg-black hover:text-white"
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
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No notifications found.
          </div>
        )
      )}
    </section>
  );
}
