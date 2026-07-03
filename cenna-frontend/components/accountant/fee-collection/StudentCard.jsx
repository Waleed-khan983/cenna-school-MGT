"use client";

import Image from "next/image";
import {
  FaUserGraduate,
  FaSchool,
  FaPhone,
  FaMoneyBillWave,
  FaIdCard,
  FaUsers,
} from "react-icons/fa";

const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

export default function StudentCard({
  student,
  balance = 0,
}) {
  if (!student) return null;

  const image =
    student.user?.avatar
      ? `${FILE_URL}${student.user.avatar}`
      : "/images/student.png";

  return (
    <div className="overflow-hidden rounded-[2rem] border bg-white shadow-sm">

      <div className="bg-gradient-to-r from-black to-gray-800 p-6 text-white">

        <div className="flex items-center gap-4">

          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-yellow-400">

            <Image
              src={image}
              alt={student.user?.name}
              fill
              className="object-cover"
              unoptimized
            />

          </div>

          <div>

            <h2 className="text-2xl font-extrabold">
              {student.user?.name}
            </h2>

            <p className="text-gray-300">
              {student.class?.displayName}
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-4 p-6">

        <Info
          icon={<FaIdCard />}
          label="Admission No"
          value={student.admissionNo}
        />

        <Info
          icon={<FaSchool />}
          label="Class"
          value={student.class?.displayName}
        />

        <Info
          icon={<FaUsers />}
          label="Father"
          value={student.fatherName}
        />

        <Info
          icon={<FaPhone />}
          label="Phone"
          value={student.user?.phone || "-"}
        />

        <div className="rounded-2xl bg-red-50 p-5">

          <div className="flex items-center gap-3">

            <FaMoneyBillWave className="text-2xl text-red-600" />

            <div>

              <p className="text-sm font-semibold text-red-500">
                Outstanding Balance
              </p>

              <h2 className="mt-1 text-3xl font-extrabold text-red-600">
                Rs. {Number(balance).toLocaleString()}
              </h2>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <SmallCard
            title="Gender"
            value={student.gender || "-"}
          />

          <SmallCard
            title="Section"
            value={student.section || "-"}
          />

          <SmallCard
            title="Roll No"
            value={student.rollNumber || "-"}
          />

          <SmallCard
            title="Status"
            value={
              student.isActive
                ? "Active"
                : "Inactive"
            }
          />

        </div>

      </div>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
        {icon}
      </div>

      <div>

        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="font-bold text-black">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}

function SmallCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 text-center">

      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-lg font-extrabold text-black">
        {value}
      </p>

    </div>
  );
}