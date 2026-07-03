"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

export default function SiteShell({ children }) {
  const pathname = usePathname();

  const hideNavbarFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/portals");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
}