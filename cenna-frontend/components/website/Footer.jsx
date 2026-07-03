"use client";

import Link from "next/link";

import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import useSchoolSettings from "@/hooks/useSchoolSettings";

export default function Footer() {
  const settings = useSchoolSettings();

  const schoolName = settings?.schoolName || "CENNA School & College";
  const schoolAddress = settings?.schoolAddress || "Main Road, Pabbi, Nowshera";
  const schoolPhone = settings?.schoolPhone || "+92-333-9038030";
  const schoolEmail = settings?.schoolEmail || "info@cennaschool.edu.pk";
  const whatsappNumber = settings?.whatsappNumber || schoolPhone;
  const officeHours = settings?.officeHours || "Mon–Sat: 8:00 AM – 3:00 PM";
  const website = settings?.website || "";

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="mb-3 text-xl font-extrabold">{schoolName}</h2>

          <p className="mb-5 text-sm leading-7 text-gray-400">
            {schoolName} is committed to providing quality education, developing
            character, and preparing students for future success.
          </p>

          <div className="flex gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-yellow-500 hover:text-black" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-yellow-500 hover:text-black" aria-label="Twitter">
              <FaTwitter />
            </a>

            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-yellow-500 hover:text-black" aria-label="YouTube">
              <FaYoutube />
            </a>

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-green-500" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-500">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/academics" className="hover:text-white">Academics</Link></li>
            <li><Link href="/job-application" className="hover:text-white">Careers</Link></li>

            {settings?.enableNews !== false && (
              <li><Link href="/news" className="hover:text-white">News & Events</Link></li>
            )}

            {settings?.enableGallery !== false && (
              <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
            )}

            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/alumini-registration" className="hover:text-white">Alumni</Link></li>

            {website && (
              <li>
                <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Official Website
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-500">
            Portals
          </h3>

          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/portals/student" className="hover:text-white">Student Portal</Link></li>
            <li><Link href="/portals/teacher" className="hover:text-white">Teacher Portal</Link></li>
            <li><Link href="/portals/parent" className="hover:text-white">Parent Portal</Link></li>
            <li><Link href="/portals/coordinator" className="hover:text-white">Coordinator Portal</Link></li>
            <li><Link href="/portals/accountant" className="hover:text-white">Accountant Portal</Link></li>
            <li><Link href="/portals/operator" className="hover:text-white">Computer Operator Portal</Link></li>
             <li><Link href="/portals/admin" className="hover:text-white">Admin Panel</Link></li>
          </ul>

          <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-widest text-yellow-500">
            Academics
          </h3>

          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/academics" className="hover:text-white">Classes Offered</Link></li>
            <li><Link href="/academics#curriculum" className="hover:text-white">Curriculum</Link></li>
            <li><Link href="/academics#exams" className="hover:text-white">Exam System</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-500">
            Contact
          </h3>

          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-yellow-500" />
              <span>{schoolAddress}</span>
            </li>

            <li className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-yellow-500" />
              <a href={`tel:${schoolPhone}`} className="hover:text-white">
                {schoolPhone}
              </a>
            </li>

            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-yellow-500" />
              <a href={`mailto:${schoolEmail}`} className="hover:text-white">
                {schoolEmail}
              </a>
            </li>

            <li className="flex items-start gap-3">
              <FaWhatsapp className="mt-1 text-green-500" />
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp
              </a>
            </li>
          </ul>

          <div className="mt-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              School Hours
            </p>
            <p className="text-sm text-gray-400">{officeHours}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row">
          <span>© {currentYear} {schoolName}. All Rights Reserved.</span>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}