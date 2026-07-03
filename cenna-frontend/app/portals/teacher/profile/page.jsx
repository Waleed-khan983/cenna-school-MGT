"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchMyTeacherAssignments } from "@/store/teacherAssignmentSlice";
import { updateMyProfile } from "@/store/profileSlice";
import PageLoader from "@/components/ui/PageLoader";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

function getImageUrl(path) {
  if (!path) return "/images/teacher.png";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

export default function TeacherProfilePage() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [previewImage, setPreviewImage] = useState("");

  const { teacher, assignments = [], loading, error } = useSelector(
    (state) => state.teacherAssignments || {}
  );

  const { loading: profileLoading } = useSelector((state) => state.profile || {});

  useEffect(() => {
    dispatch(fetchMyTeacherAssignments());
  }, [dispatch]);

  const user = teacher?.user;

  useEffect(() => {
    setPreviewImage(getImageUrl(user?.avatar));
  }, [user?.avatar]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setPreviewImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("avatar", file);

      await dispatch(updateMyProfile(formData)).unwrap();
      await dispatch(fetchMyTeacherAssignments()).unwrap();

      toast.success("Profile photo updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile photo");
      setPreviewImage(getImageUrl(user?.avatar));
    }
  };

  if (loading) return <PageLoader text="Loading teacher profile..." />;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="text-center">
            <div className="relative mx-auto h-[140px] w-[140px] overflow-hidden rounded-full border bg-gray-100">
              <Image
                src={previewImage || "/images/teacher.png"}
                alt="Teacher Profile"
                fill
                sizes="140px"
                className="object-cover"
                unoptimized
              />
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={profileLoading}
              className="mt-4 cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {profileLoading ? "Uploading..." : "Change Photo"}
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-black">
              {user?.name || "Teacher Profile"}
            </h1>

            <p className="mt-2 text-gray-500">
              Teacher personal and academic details
            </p>

            <p className="mt-3 inline-block rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
              {teacher?.designation || "Teacher"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Full Name" value={user?.name} />
          <Info label="Employee ID" value={teacher?.employeeId} />
          <Info label="Phone" value={user?.phone} />
          <Info label="Email" value={user?.email} />
          <Info label="Qualification" value={teacher?.qualification} />
          <Info label="Designation" value={teacher?.designation} />
          <Info label="CNIC" value={teacher?.cnic} />
          <Info label="Address" value={teacher?.address} />
          <Info
            label="Joining Date"
            value={
              teacher?.joiningDate
                ? new Date(teacher.joiningDate).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        <div className="mt-8 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
          Personal details are updated by admin. Teacher can only change profile
          photo.
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-black">
          Teaching Assignments
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Classes and subjects assigned to this teacher.
        </p>

        {assignments.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.map((item) => (
              <div key={item._id} className="rounded-2xl border bg-gray-50 p-5">
                <h3 className="text-lg font-extrabold text-black">
                  {item.class?.displayName ||
                    `${item.class?.name || ""} - ${item.class?.section || ""}`}
                </h3>

                <p className="mt-2 text-sm font-semibold text-gray-700">
                  Subject: {item.subject?.name || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Code: {item.subject?.code || "N/A"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Room: {item.class?.room || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No teaching assignments found.
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-1 break-words text-lg font-semibold text-black">
        {value || "N/A"}
      </p>
    </div>
  );
}