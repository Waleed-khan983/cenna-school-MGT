"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchStudentProfile,
  updateStudentAvatar,
} from "@/store/studentProfileSlice";

import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const cleanPath = path.replace(/\\/g, "/");

  if (cleanPath.startsWith("uploads/")) {
    return `${FILE_URL}/${cleanPath}`;
  }

  if (cleanPath.startsWith("/uploads/")) {
    return `${FILE_URL}${cleanPath}`;
  }

  return `${FILE_URL}/${cleanPath}`;
};

const getClassName = (student) => {
  if (!student?.class) return "Class N/A";

  if (student.class.displayName) return student.class.displayName;

  const name = student.class.name || "";
  const section = student.class.section || student.section || "";

  if (name && section) return `${name} - ${section}`;
  if (name) return name;

  return "Class N/A";
};

export default function StudentProfilePage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const { student, loading } = useSelector(
    (state) => state.studentProfile || {}
  );

  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    setPreviewImage(getImageUrl(student?.user?.avatar));
  }, [student?.user?.avatar]);

  const className = getClassName(student);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await dispatch(updateStudentAvatar(formData)).unwrap();
      await dispatch(fetchStudentProfile()).unwrap();

      toast.success("Profile image updated successfully");
    } catch (error) {
      setPreviewImage(getImageUrl(student?.user?.avatar));
      toast.error(error || "Failed to update profile image");
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      URL.revokeObjectURL(localPreview);
    }
  };

  if (loading && !student) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your important student information.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="mb-8 flex flex-col gap-5 border-b pb-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-3">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Student Profile"
                className="h-28 w-28 rounded-full border-4 border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-gray-200 bg-black text-4xl font-extrabold text-white">
                {student?.user?.name?.charAt(0) || "S"}
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
              {student?.user?.name || "Student"}
            </h2>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Admission No: {student?.admissionNo || "N/A"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              {className} • Section {student?.section || "N/A"}
            </p>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="mt-4 cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {uploading ? "Uploading..." : "Change Profile Picture"}
            </button>

            <p className="mt-2 text-xs font-medium text-gray-400">
              JPG, PNG, or WEBP. Max size 2MB.
            </p>
          </div>
        </div>

        <ProfileSection title="Student Information">
          <Info label="Student Name" value={student?.user?.name} />
          <Info label="Admission No" value={student?.admissionNo} />
          <Info label="Class" value={className} />
          <Info label="Section" value={student?.section} />
          <Info label="Father Name" value={student?.fatherName} />
        </ProfileSection>

        <ProfileSection title="Contact Information">
          <Info label="Phone" value={student?.user?.phone} />
          <Info label="Address" value={student?.address} />
        </ProfileSection>

        <ProfileSection title="Academic Information">
          <Info
            label="Admission Date"
            value={
              student?.admissionDate
                ? new Date(student.admissionDate).toLocaleDateString()
                : "N/A"
            }
          />

          <Info label="Class Room" value={student?.class?.room} />
        </ProfileSection>

        <div className="mt-8 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
          Note: Admission number, class, section, and parent information are
          taken from official student registration and can only be changed by
          school admin.
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-extrabold text-black">{title}</h3>

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