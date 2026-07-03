"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/portals/Sidebar";
import Topbar from "@/components/portals/Topbar";
import PageLoader from "@/components/ui/PageLoader";

const roleRoutes = {
  admin: "/portals/admin",
  student: "/portals/student",
  teacher: "/portals/teacher",
  parent: "/portals/parent",
  accountant: "/portals/accountant",
  operator: "/portals/operator",
  coordinator: "/portals/coordinator",
};

export default function PortalsLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cenna_token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      localStorage.removeItem("cenna_token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(userRaw);
    } catch {
      localStorage.removeItem("cenna_token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    const role = user?.role?.toLowerCase();
    const allowedBase = roleRoutes[role];

    if (!role || !allowedBase) {
      localStorage.removeItem("cenna_token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    if (!pathname.startsWith(allowedBase)) {
      router.replace(allowedBase);
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return <PageLoader text="Checking access..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}