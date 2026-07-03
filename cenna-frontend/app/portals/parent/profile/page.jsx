"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyParentProfile } from "@/store/parentSlice";
import PageLoader from "@/components/ui/PageLoader";
import api from "@/services/api";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

function getImageUrl(path) {
  if (!path) return "/images/parent.png";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

export default function ParentProfilePage() {
  const dispatch = useDispatch();

  const { parent, children = [], loading, error } = useSelector(
    (state) => state.parents || {}
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyParentProfile());
  }, [dispatch]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      await api.put("/parents/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile image updated");
      setSelectedFile(null);
      dispatch(fetchMyParentProfile());
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile image"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading parent profile..." />;
  }

  const imageUrl = getImageUrl(parent?.profileImage);

  return (
    <section className="space-y-6 p-4 md:p-6">
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <Image
            src={imageUrl}
            alt="Parent Profile"
            width={140}
            height={140}
            className="h-[140px] w-[140px] rounded-full border object-cover"
            unoptimized
          />

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-black">
              Parent Profile
            </h1>

            <p className="mt-2 text-gray-500">
              Parent account and contact information.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border px-4 py-3 text-sm sm:w-auto"
              />

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-500"
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Info label="Full Name" value={parent?.user?.name || "N/A"} />
          <Info label="CNIC" value={parent?.cnic || "N/A"} />
          <Info label="Phone" value={parent?.user?.phone || "N/A"} />
          <Info label="Email" value={parent?.user?.email || "N/A"} />
          <Info
            label="Children"
            value={`${children.length} linked student${
              children.length === 1 ? "" : "s"
            }`}
          />
          <Info label="WhatsApp" value={parent?.whatsapp || "N/A"} />
          <Info label="Occupation" value={parent?.occupation || "N/A"} />
          <Info label="Address" value={parent?.address || "N/A"} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-black">
          Linked Children
        </h2>

        {children.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <div key={child._id} className="rounded-2xl border p-4">
                <h3 className="font-extrabold text-black">
                  {child.user?.name || "Student"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Admission No: {child.admissionNo || "N/A"}
                </p>

                <p className="text-sm text-gray-500">
                  Class: {child.class?.displayName || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No children linked.
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-black">{value}</p>
    </div>
  );
}