"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  sendNotification,
  fetchAllNotifications,
  removeNotification,
} from "@/store/notificationSlice";

import PageLoader from "@/components/ui/PageLoader";

const roles = [
  "admin",
  "teacher",
  "student",
  "parent",
  "coordinator",
  "accountant",
  "operator",
];

const types = [
  "announcement",
  "fee",
  "attendance",
  "result",
  "event",
  "holiday",
  "general",
];

const priorities = ["normal", "important", "urgent"];

export default function AdminNotificationsPage() {
  const dispatch = useDispatch();

  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    priority: "normal",
    roles: [],
  });

  useEffect(() => {
    dispatch(fetchAllNotifications());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRole = (role) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((item) => item !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      toast.error("Title and message are required");
      return;
    }

    if (form.roles.length === 0) {
      toast.error("Select at least one role");
      return;
    }

    try {
      await dispatch(
        sendNotification({
          title: form.title,
          message: form.message,
          type: form.type,
          priority: form.priority,
          roles: form.roles,
          channels: {
            app: true,
            sms: false,
            email: false,
          },
        })
      ).unwrap();

      toast.success("Notification sent");

      setForm({
        title: "",
        message: "",
        type: "general",
        priority: "normal",
        roles: [],
      });

      dispatch(fetchAllNotifications());
    } catch (error) {
      toast.error(error || "Failed to send notification");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      await dispatch(removeNotification(id)).unwrap();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error(error || "Failed to delete notification");
    }
  };

  if (loading) return <PageLoader text="Loading notifications..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Send notices and announcements to portal users.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-3xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-xl font-extrabold text-black">
          Send New Notification
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Select Roles
            </label>

            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`!cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold capitalize ${
                    form.roles.includes(role)
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Message
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          Send Notification
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4 text-left">Title</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Priority</th>
                <th className="px-4 py-4">Roles</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-bold text-black">{item.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {item.message}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center capitalize">
                      {item.type}
                    </td>

                    <td className="px-4 py-4 text-center capitalize">
                      {item.priority}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {item.recipients?.roles?.join(", ") || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {item.sentAt
                        ? new Date(item.sentAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="!cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No notifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}