"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";

import { fetchMyParentProfile } from "@/store/parentSlice";
import { fetchStudentProfile } from "@/store/studentProfileSlice";
import { fetchMyProfile } from "@/store/profileSlice";
import { fetchMyNotifications } from "@/store/notificationSlice";

const FILE_URL = process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const roleImages = {
  Admin: "/images/logo.jpg",
  Student: "/images/logo.jpg",
  Teacher: "/images/logo.jpg",
  Parent: "/images/logo.jpg",
  Coordinator: "/images/logo.jpg",
  Accountant: "/images/logo.jpg",
  Operator: "/images/logo.jpg",
  Alumni: "/images/logo.jpg",
};

function getImageUrl(path) {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const cleanPath = path.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${FILE_URL}${cleanPath}`
    : `${FILE_URL}/${cleanPath}`;
}

function getRole(pathname) {
  if (pathname.startsWith("/portals/student")) return "Student";
  if (pathname.startsWith("/portals/teacher")) return "Teacher";
  if (pathname.startsWith("/portals/parent")) return "Parent";
  if (pathname.startsWith("/portals/coordinator")) return "Coordinator";
  if (pathname.startsWith("/portals/accountant")) return "Accountant";
  if (pathname.startsWith("/portals/operator")) return "Operator";
  if (pathname.startsWith("/portals/alumni")) return "Alumni";

  return "Admin";
}

function getProfilePath(role) {
  return `/portals/${role.toLowerCase()}/profile`;
}

function getNoticesPath(role) {
  return role === "Admin"
    ? "/portals/admin/notifications"
    : `/portals/${role.toLowerCase()}/notices`;
}

function getPageTitle(pathname, role) {
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  if (!lastSegment || lastSegment === role.toLowerCase()) {
    return `${role} Dashboard`;
  }

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Topbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);

  const role = getRole(pathname);
  const pageTitle = getPageTitle(pathname, role);

  const { user } = useSelector((state) => state.profile || {});
  const { student } = useSelector((state) => state.studentProfile || {});
  const { parent } = useSelector((state) => state.parents || {});
  const { unreadCount = 0 } = useSelector((state) => state.notifications || {});

  useEffect(() => {
    setMounted(true);

    if (role === "Student") {
      dispatch(fetchStudentProfile());
    } else if (role === "Parent") {
      dispatch(fetchMyParentProfile());
    } else {
      dispatch(fetchMyProfile());
    }

    dispatch(fetchMyNotifications());
  }, [dispatch, role]);

  if (!mounted) {
    return null;
  }

  const studentUser = student?.user;
  const parentUser = parent?.user;

  const profileName =
    role === "Student"
      ? studentUser?.name || user?.name || "Student"
      : role === "Parent"
        ? parentUser?.name || user?.name || "Parent"
        : user?.name || role;

  const rawAvatar =
    role === "Student"
      ? studentUser?.avatar || user?.avatar
      : role === "Parent"
        ? parent?.profileImage || parentUser?.avatar || user?.avatar
        : user?.avatar;

  const profileImage = rawAvatar
    ? getImageUrl(rawAvatar)
    : roleImages[role] || "/images/logo.jpg";

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6 md:px-8">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-extrabold text-black sm:text-xl">
          {pageTitle}
        </h1>

        <p className="text-xs text-gray-500 sm:text-sm">
          CENNA School Management System
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={getNoticesPath(role)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-black transition hover:bg-black hover:text-white"
          title="Notifications"
        >
          <FaBell />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        <Link
          href={getProfilePath(role)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-100"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-black">{profileName}</p>

            <p className="text-xs text-gray-500">{role} Portal</p>
          </div>

          <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-yellow-500 bg-gray-100">
            <Image
              src={profileImage}
              alt={profileName}
              fill
              sizes="44px"
              className="object-cover"
              unoptimized
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
