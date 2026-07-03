"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchUsers,
  changeUserStatus,
  removeUser,
} from "@/store/userSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminUsersPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { users = [], loading = false, error = null } = useSelector(
    (state) => state.users || {}
  );

  useEffect(() => {
    dispatch(fetchUsers(roleFilter));
  }, [dispatch, roleFilter]);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const phone = user.phone?.toLowerCase() || "";
      const role = user.role?.toLowerCase() || "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        phone.includes(value) ||
        role.includes(value)
      );
    });
  }, [users, search]);

  const handleStatus = async (user) => {
    try {
      await dispatch(changeUserStatus(user._id)).unwrap();
      toast.success(user.isActive ? "User deactivated" : "User activated");
    } catch (error) {
      toast.error(error || "Failed to update user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    try {
      await dispatch(removeUser(user._id)).unwrap();
      toast.success("User deleted");
    } catch (error) {
      toast.error(error || "Failed to delete user");
    }
  };

  if (loading) return <PageLoader text="Loading users..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all system users, roles, and account status.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          placeholder="Search by name, email, phone, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-black"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-black"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="coordinator">Coordinator</option>
          <option value="accountant">Accountant</option>
          <option value="operator">Operator</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4 text-left">Name</th>
                <th className="px-4 py-4 text-left">Email/Login</th>
                <th className="px-4 py-4">Phone</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Last Login</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold">
                      {user.name || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      {user.email || "Admission No / CNIC Login"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {user.phone || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center capitalize">
                      {user.role}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatus(user)}
                          className="!cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No users found.
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