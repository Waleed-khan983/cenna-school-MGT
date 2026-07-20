"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaGraduationCap,
  FaMoneyBillWave,
  FaFileAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaSchool,
  FaBookOpen,
} from "react-icons/fa";

import useSchoolSettings from "@/hooks/useSchoolSettings";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const settings = useSchoolSettings();

  const schoolName = settings.schoolName || "CENNA School & College Pabbi";
  const schoolAddress =
    settings.schoolAddress || "Main Road, Pabbi, Nowshera, KPK, Pakistan";
  const schoolPhone = settings.schoolPhone || "+92-300-9290845";
  const whatsappNumber = settings.whatsappNumber || schoolPhone;
  const schoolEmail = settings.schoolEmail || "institute.cenna@gmail.com";
  const officeHours = settings.officeHours || "Mon–Sat: 8:00 AM – 3:00 PM";
  const googleMapLink =
    settings.googleMapLink ||
    `https://www.google.com/maps/search/${encodeURIComponent(schoolAddress)}`;

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  const contactItems = [
    {
      icon: <FaMapMarkerAlt />,
      label: "Address",
      value: <>{schoolAddress}</>,
    },
    {
      icon: <FaPhoneAlt />,
      label: "Phone Number",
      value: <>{schoolPhone}</>,
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      value: (
        <>
          {whatsappNumber}
          <br />
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <FaWhatsapp />
            Open WhatsApp Chat
          </a>
        </>
      ),
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: <>{schoolEmail}</>,
    },
    {
      icon: <FaClock />,
      label: "Office Hours",
      value: <>{officeHours}</>,
    },
  ];

   

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    toast.success("Message sent successfully!");
  };

  return (
    <>
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.12, rotate: 8 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <FaWhatsapp />
      </motion.a>

      <motion.section
        className="relative mt-20 overflow-hidden bg-black px-6 py-20 text-white lg:px-20"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute right-10 top-10 text-8xl text-white/5"
          variants={floating}
          animate="animate"
        >
          <FaSchool />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-10 text-7xl text-yellow-500/10"
          variants={floating}
          animate="animate"
        >
          <FaBookOpen />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">Contact</span>
          </nav>

          <motion.h1
            className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Contact Us
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-8 text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Contact {schoolName} by phone, WhatsApp, email, or visit us in
            person.
          </motion.p>
        </div>
      </motion.section>

      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
                Get in Touch
              </p>

              <h2 className="mb-5 text-3xl font-extrabold text-black md:text-5xl">
                Contact Information
              </h2>

              <p className="mb-8 leading-8 text-gray-600">
                We welcome all inquiries regarding admissions, academics, and
                general school matters.
              </p>

              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {contactItems.map((item) => (
                  <ContactInfoItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </motion.div>

              <motion.div
                className="mt-8"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                
              </motion.div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
                Send a Message
              </p>

              <h2 className="mb-5 text-3xl font-extrabold text-black md:text-5xl">
                Contact Form
              </h2>

              <motion.form
                onSubmit={handleSubmit}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
                whileHover={{ y: -4 }}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormInput label="Your Name *">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className={inputClass()}
                    />
                  </FormInput>

                  <FormInput label="Phone *">
                    <input
                      type="tel"
                      required
                      placeholder="03XX-XXXXXXX"
                      className={inputClass()}
                    />
                  </FormInput>
                </div>

                <div className="mt-5">
                  <FormInput label="Email">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className={inputClass()}
                    />
                  </FormInput>
                </div>

                <div className="mt-5">
                  <FormInput label="Subject *">
                    <select required className={inputClass()}>
                      <option value="">— Select Subject —</option>
                      <option>Admission Inquiry</option>
                      <option>Fee Inquiry</option>
                      <option>Academic Issue</option>
                      <option>Transport</option>
                      <option>Complaint</option>
                      <option>General Inquiry</option>
                    </select>
                  </FormInput>
                </div>

                <div className="mt-5">
                  <FormInput label="Message *">
                    <textarea
                      required
                      rows="5"
                      placeholder="Write your message here..."
                      className={inputClass()}
                    />
                  </FormInput>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                  <FaPaperPlane />
                  Send Message
                </button>

                {sent && (
                  <motion.div
                    className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                      <FaCheckCircle />
                    </div>

                    <strong className="text-lg text-black">
                      Message Sent!
                    </strong>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Thank you for contacting us. We will respond within 1–2
                      working days.
                    </p>
                  </motion.div>
                )}
              </motion.form>
            </motion.div>
          </div>

          <motion.div
            className="mt-20"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
                Find Us
              </p>

              <h2 className="text-3xl font-extrabold text-black md:text-5xl">
                Location on Map
              </h2>
            </div>

             

            <p className="mt-4 text-center text-sm text-gray-500">
              {schoolName}
              <br />
              {schoolAddress}
            </p>

            <div className="mt-5 text-center">
              <a
                href={googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-black px-5 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                <FaMapMarkedAlt />
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function ContactInfoItem({ icon, label, value }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6 }}
      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl text-yellow-600">
        {icon}
      </div>

      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-yellow-600">
          {label}
        </p>

        <div className="text-sm leading-7 text-gray-600">{value}</div>
      </div>
    </motion.div>
  );
}

function FormInput({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black";
}