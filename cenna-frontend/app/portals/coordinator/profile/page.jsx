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
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const clean = path.replace(/\\/g, "/");

  if (clean.startsWith("uploads/")) return `${FILE_URL}/${clean}`;
  if (clean.startsWith("/uploads/")) return `${FILE_URL}${clean}`;

  return `${FILE_URL}/${clean}`;
};

export default function CoordinatorProfilePage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const { user, profile, loading } = useSelector(
    (state) => state.profile || {}
  );

  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    setPreviewImage(getImageUrl(user?.avatar));
  }, [user?.avatar]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setUploading(true);

      const localPreview = URL.createObjectURL(file);
      setPreviewImage(localPreview);

      const formData = new FormData();
      formData.append("avatar", file);

      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(fetchMyProfile()).unwrap();

      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error || "Failed to update profile picture");
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  if (loading && !user) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your coordinator profile.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-3">
            {previewImage ? (
              <img
                src={previewImage}
                alt={user?.name || "Coordinator"}
                className="h-28 w-28 rounded-full border-4 border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-gray-200 bg-black text-4xl font-extrabold text-white">
                {user?.name?.charAt(0) || "C"}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-black">
              {user?.name || "Coordinator"}
            </h2>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-500">
              {user?.role || "coordinator"} Portal
            </p>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="mt-4 cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {uploading ? "Uploading..." : "Change Profile Picture"}
            </button>
          </div>
        </div>

        <ProfileSection title="Basic Information">
          <Info label="Full Name" value={user?.name} />
          <Info label="Role" value={user?.role} />
          <Info label="Email" value={user?.email} />
          <Info label="Phone" value={user?.phone} />
        </ProfileSection>

        <ProfileSection title="Personal Information">
          <Info label="CNIC" value={profile?.cnic} />
          <Info label="Gender" value={profile?.gender} />
          <Info
            label="Joining Date"
            value={
              profile?.joiningDate
                ? new Date(profile.joiningDate).toLocaleDateString()
                : "N/A"
            }
          />

          <Info label="Address" value={profile?.address} />
        </ProfileSection>

        <div className="mt-8 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
          Note: If CNIC, gender, address, or joining date shows N/A, it means
          those details were not added in the coordinator record by admin.
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-extrabold text-black">
        {title}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-black">
        {value || "N/A"}
      </p>
    </div>
  );
}