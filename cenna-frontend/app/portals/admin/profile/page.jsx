"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchMyProfile,
  updateProfile,
  changePassword
} from "@/store/profileSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminProfilePage() {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.profile || {});

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      setPreviewImage(user.avatar || "");
    }
  }, [user]);

  const profileLetter = useMemo(() => {
    return profileForm.name?.charAt(0)?.toUpperCase() || "A";
  }, [profileForm.name]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.name) {
      toast.error("Name is required");
      return;
    }

    const formData = new FormData();

    formData.append("name", profileForm.name);
    formData.append("phone", profileForm.phone || "");
    formData.append("email", profileForm.email || "");

    if (profileImage) {
      formData.append("avatar", profileImage);
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();

      toast.success("Profile updated successfully");

      setProfileImage(null);
      await dispatch(fetchMyProfile());
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(changePassword(passwordForm)).unwrap();

      toast.success("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      toast.error(error || "Failed to change password");
    }
  };

  if (loading) return <PageLoader text="Loading profile..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Admin Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information, profile picture, and password.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-black text-5xl font-extrabold text-white">
            {previewImage ? (
              <img
                src={previewImage}
                alt={profileForm.name}
                className="h-full w-full object-cover"
              />
            ) : (
              profileLetter
            )}
          </div>

          <h2 className="mt-4 text-2xl font-extrabold text-black">
            {profileForm.name || "Admin"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {profileForm.email || "No email"}
          </p>

          <span
            className={`mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold ${
              user?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user?.isActive ? "Active" : "Inactive"}
          </span>

          <p className="mt-4 text-xs text-gray-400">
            Last Login:{" "}
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "Never"}
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2"
        >
          <h2 className="mb-5 text-xl font-extrabold text-black">
            Profile Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
            />

            <Input
              label="Email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Profile Picture
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />

              {profileImage && (
                <p className="mt-2 text-xs font-semibold text-green-600">
                  Selected: {profileImage.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
          >
            Update Profile
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-3"
        >
          <h2 className="mb-5 text-xl font-extrabold text-black">
            Change Password
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <button
            type="submit"
            className="mt-5 !cursor-pointer rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
          >
            Change Password
          </button>
        </form>
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