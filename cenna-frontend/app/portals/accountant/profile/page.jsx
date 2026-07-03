"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchMyProfile,
  updateProfile,
} from "@/store/profileSlice";

import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/images/admin.png";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
};

export default function AccountantProfilePage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const { user, loading } = useSelector((state) => state.profile || {});

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
      });

      setAvatarPreview(getImageUrl(user.avatar));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("avatar", file);

      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(fetchMyProfile()).unwrap();

      toast.success("Profile image updated");
    } catch (error) {
      toast.error(error || "Failed to update image");
      setAvatarPreview(getImageUrl(user?.avatar));
    } finally {
      setSaving(false);
      URL.revokeObjectURL(localPreview);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);

      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(fetchMyProfile()).unwrap();

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Accountant Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your accountant account information.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-3">
            <img
              src={avatarPreview}
              alt="Accountant Profile"
              className="h-28 w-28 rounded-full border-4 border-yellow-500 object-cover"
            />

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={saving}
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-500"
            >
              Change Photo
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-black">
              {user?.name || "Accountant"}
            </h2>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              {user?.email || "N/A"}
            </p>

            <span className="mt-3 inline-block rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              Accountant Portal
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            value={user?.email || ""}
            disabled
          />

          <Input
            label="Role"
            value={user?.role || "accountant"}
            disabled
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-500"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
          Note: Email and role are controlled by admin and cannot be changed
          from this page.
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 outline-none ${
          disabled
            ? "cursor-not-allowed bg-gray-100 text-gray-500"
            : "bg-white focus:border-black"
        }`}
      />
    </div>
  );
}