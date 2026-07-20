"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  FaBars,
  FaTimes,
  FaDownload,
 
} from "react-icons/fa";

import useSchoolSettings from "@/hooks/useSchoolSettings";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const settings = useSchoolSettings();

  const navLinks = [
    {
      name: "Home",
      href: "/",

      show: true,
    },
    {
      name: "About",
      href: "/about",

      show: true,
    },
    {
      name: "Academics",
      href: "/academics",

      show: true,
    },
    {
      name: "Admission Form",
      href: "/admission-form",

      show: true,
    },
    {
      name: "Jobs",
      href: "/job-application",

      show: true,
    },
    {
      name: "News & Events",
      href: "/news",

      show: settings.enableNews !== false,
    },
    {
      name: "Gallery",
      href: "/gallery",

      show: settings.enableGallery !== false,
    },
    {
      name: "Contact",
      href: "/contact",

      show: true,
    },
    {
      name: "Alumni Registration",
      href: "/alumini-registration",

      show: true,
    },

  ];

  const visibleLinks = navLinks.filter((link) => link.show);

  const schoolName = settings.schoolName || "CENNA School & College";
  const schoolLogo = settings.schoolLogo || "/images/logo.jpg";

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full bg-gray-100">
            <Image
              src={schoolLogo}
              alt={`${schoolName} Logo`}
              fill
              sizes="52px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <div>
            <h1 className="text-base font-extrabold leading-tight text-black md:text-lg">
              {schoolName}
            </h1>

            <p className="text-xs font-medium text-gray-500">
              {settings.schoolAddress || "Pabbi • Est. 2005"}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          {visibleLinks.map((link) =>
            link.download ? (
              <a
                key={link.href}
                href={link.href}
                download
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                <FaDownload />
                <span>{link.name}</span>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-yellow-600"
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ),
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-xl text-black transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle mobile menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {visibleLinks.map((link) =>
              link.download ? (
                <a
                  key={link.href}
                  href={link.href}
                  download
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white"
                >
                  <FaDownload />
                  <span>{link.name}</span>
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-yellow-600"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
}