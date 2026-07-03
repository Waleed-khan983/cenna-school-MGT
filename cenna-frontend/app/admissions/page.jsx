"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaWhatsapp,
  FaGraduationCap,
  FaBookOpen,
  FaDownload,
  FaFileAlt,
  FaClipboardList,
  FaCheckCircle,
  FaMoneyBillWave,
  FaIdCard,
  FaUser,
  FaCamera,
  FaSchool,
  FaSyringe,
  FaCalendarAlt,
  FaPenAlt,
  FaUpload,
  FaArrowRight,
  FaArrowLeft,
  FaHome,
  FaStar,
  FaPhoneAlt,
  FaEnvelope,
  FaChild,
} from "react-icons/fa";

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

export default function AdmissionsPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const procedureSteps = [
    {
      number: "1",
      icon: <FaDownload />,
      title: "Download Prospectus",
      text: "Download or collect prospectus from school office.",
    },
    {
      number: "2",
      icon: <FaPenAlt />,
      title: "Fill Application",
      text: "Complete the online form below or visit in person.",
    },
    {
      number: "3",
      icon: <FaFileAlt />,
      title: "Submit Documents",
      text: "Submit required documents at the admin office.",
    },
    {
      number: "4",
      icon: <FaCheckCircle />,
      title: "Confirmation",
      text: "Receive confirmation & pay admission fee.",
      gold: true,
    },
  ];

  const feeRows = [
    ["Nursery – KG", "Rs. 800", "Rs. 1,500", "Rs. 500", "Rs. 2,800"],
    ["Grade 1 – 3", "Rs. 1,000", "Rs. 2,000", "Rs. 700", "Rs. 3,700"],
    ["Grade 4 – 5", "Rs. 1,200", "Rs. 2,000", "Rs. 700", "Rs. 3,900"],
    ["Grade 6 – 8", "Rs. 1,500", "Rs. 2,500", "Rs. 1,000", "Rs. 5,000"],
    ["Grade 9 – 10 (Matric)", "Rs. 2,000", "Rs. 3,000", "Rs. 2,500", "Rs. 7,500"],
    ["F.Sc Part 1 & 2", "Rs. 2,500", "Rs. 4,000", "Rs. 3,500", "Rs. 10,000"],
  ];

  const documents = [
    {
      icon: <FaClipboardList />,
      text: "Filled Admission Form (online or paper)",
    },
    {
      icon: <FaGraduationCap />,
      text: "Previous School Result / Report Card (Original + Copy)",
    },
    {
      icon: <FaIdCard />,
      text: "Student's B-Form / CNIC (for seniors)",
    },
    {
      icon: <FaUser />,
      text: "Father/Guardian CNIC Copy",
    },
    {
      icon: <FaCamera />,
      text: "4 Passport-size Photos (recent, white background)",
    },
    {
      icon: <FaSchool />,
      text: "School Leaving Certificate (SLC)",
    },
    {
      icon: <FaSyringe />,
      text: "Vaccination Card (for Nursery–Grade 3)",
    },
  ];

  const keyDates = [
    {
      title: "Admission Forms Available",
      date: "From January 1, 2025",
      badge: "Open",
      badgeClass: "bg-green-100 text-green-700",
    },
    {
      title: "Last Date for Submission",
      date: "March 31, 2025",
      badge: "Ongoing",
      badgeClass: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Entry Test (Matric/FSc)",
      date: "April 5, 2025",
      badge: "Upcoming",
      badgeClass: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Session Starts",
      date: "April 14, 2025",
      badge: "Upcoming",
      badgeClass: "bg-black text-white",
    },
  ];

  const nextStep = () => {
    if (step < 4) {
      setStep((current) => current + 1);
      toast.info(`Step ${step + 1} opened`);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const handleProspectus = () => {
    toast.info("Prospectus PDF will be available after backend integration.");
  };

  const handleSubmit = () => {
    if (!agreed) {
      toast.error("Please confirm the terms and conditions before submitting.");
      return;
    }

    setSubmitted(true);
    toast.success("Application submitted successfully!");
  };

  return (
    <>
      {/* WHATSAPP FLOAT */}
      <motion.a
        href="https://wa.me/+923339038030"
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

      {/* PAGE HERO */}
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
          <FaGraduationCap />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-10 text-7xl text-yellow-500/10"
          variants={floating}
          animate="animate"
        >
          <FaFileAlt />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">Admissions</span>
          </nav>

          <motion.h1
            className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Admissions 2026
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-8 text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Join the CENNA family. Limited seats available — apply today.
          </motion.p>
        </div>
      </motion.section>

      {/* PROCEDURE */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Step by Step" title="Admission Procedure" />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {procedureSteps.map((item) => (
              <ProcedureCard
                key={item.number}
                number={item.number}
                icon={item.icon}
                title={item.title}
                text={item.text}
                gold={item.gold}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEE STRUCTURE */}
      <section id="fees" className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Transparent Pricing"
            title="Fee Structure 2024–25"
          />

          <motion.div
            className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-5 py-4 text-sm font-bold uppercase tracking-widest">
                    Class
                  </th>
                  <th className="px-5 py-4 text-sm font-bold uppercase tracking-widest">
                    Monthly Fee
                  </th>
                  <th className="px-5 py-4 text-sm font-bold uppercase tracking-widest">
                    Admission Fee
                  </th>
                  <th className="px-5 py-4 text-sm font-bold uppercase tracking-widest">
                    Exam Fee
                  </th>
                  <th className="px-5 py-4 text-sm font-bold uppercase tracking-widest">
                    Total 1st Month
                  </th>
                </tr>
              </thead>

              <tbody>
                {feeRows.map((row) => (
                  <motion.tr
                    key={row[0]}
                    className="border-b border-gray-100 last:border-b-0"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    {row.map((cell, index) => (
                      <td
                        key={cell}
                        className={`px-5 py-4 text-sm ${
                          index === 0
                            ? "font-semibold text-gray-800"
                            : "font-bold text-yellow-600"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            className="mt-4 text-center text-sm text-gray-500"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            * Fee structure is subject to change. Sibling discounts available.
            Merit scholarships for top students. Contact office for details.
          </motion.p>

          <motion.div
            className="mt-8 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <button
              id="prospectus"
              type="button"
              onClick={handleProspectus}
              className="inline-flex cursor-pointer items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              <FaFileAlt />
              Download Prospectus
            </button>
          </motion.div>
        </div>
      </section>

      {/* REQUIRED DOCS */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
              Checklist
            </p>
            <h2 className="mb-8 text-3xl font-extrabold text-black md:text-5xl">
              Required Documents
            </h2>

            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {documents.map((doc) => (
                <DocumentItem key={doc.text} icon={doc.icon} text={doc.text} />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
              Important
            </p>
            <h2 className="mb-8 text-3xl font-extrabold text-black md:text-5xl">
              Key Dates
            </h2>

            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {keyDates.map((date) => (
                <KeyDateCard
                  key={date.title}
                  title={date.title}
                  date={date.date}
                  badge={date.badge}
                  badgeClass={date.badgeClass}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ONLINE ADMISSION FORM */}
      <section id="apply" className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Apply Online"
            title="Online Admission Form"
            subtitle="Fill the form carefully. Fields marked * are required."
          />

          <motion.div
            className="mx-auto mb-10 flex max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[1, 2, 3, 4].map((item) => (
              <StepIndicator
                key={item}
                number={item}
                label={
                  item === 1
                    ? "Personal"
                    : item === 2
                    ? "Academic"
                    : item === 3
                    ? "Documents"
                    : "Confirm"
                }
                active={step === item}
                done={step > item || submitted}
              />
            ))}
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {!submitted ? (
              <AnimatePresence mode="wait">
                {step === 1 && <StepOne key="step-1" onNext={nextStep} />}
                {step === 2 && (
                  <StepTwo key="step-2" onNext={nextStep} onBack={prevStep} />
                )}
                {step === 3 && (
                  <StepThree key="step-3" onNext={nextStep} onBack={prevStep} />
                )}
                {step === 4 && (
                  <StepFour
                    key="step-4"
                    onBack={prevStep}
                    onSubmit={handleSubmit}
                    agreed={agreed}
                    setAgreed={setAgreed}
                  />
                )}
              </AnimatePresence>
            ) : (
              <SuccessBox />
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <motion.div
      className="mb-12 text-center"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
        {label}
      </p>

      <h2 className="mb-4 text-3xl font-extrabold text-black md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto max-w-2xl leading-7 text-gray-600">{subtitle}</p>
      )}
    </motion.div>
  );
}

function ProcedureCard({ number, icon, title, text, gold }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="rounded-xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:border-black hover:shadow-md"
    >
      <motion.div
        className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold ${
          gold ? "bg-yellow-500 text-black" : "bg-black text-white"
        }`}
        whileHover={{ rotate: 8, scale: 1.08 }}
      >
        {number}
      </motion.div>

      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600">
        {icon}
      </div>

      <h4 className="mb-2 text-lg font-extrabold text-black">{title}</h4>
      <p className="text-sm leading-6 text-gray-500">{text}</p>
    </motion.div>
  );
}

function DocumentItem({ icon, text }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6 }}
      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-lg text-yellow-600">
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-700">{text}</p>
    </motion.div>
  );
}

function KeyDateCard({ title, date, badge, badgeClass }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6 }}
      className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div>
        <h4 className="text-sm font-extrabold text-black">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
      </div>

      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
        {badge}
      </span>
    </motion.div>
  );
}

function StepIndicator({ number, label, active, done }) {
  return (
    <div className="relative flex flex-1 flex-col items-center gap-2">
      {number !== 4 && (
        <div className="absolute left-[calc(50%+22px)] right-[calc(-50%+22px)] top-[18px] h-[2px] bg-gray-200" />
      )}

      <motion.div
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
          done
            ? "border-yellow-500 bg-yellow-500 text-black"
            : active
            ? "border-black bg-black text-white"
            : "border-gray-200 bg-white text-gray-400"
        }`}
        animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
      >
        {done ? <FaCheckCircle /> : number}
      </motion.div>

      <p
        className={`text-xs font-bold uppercase tracking-widest ${
          active ? "text-black" : "text-gray-400"
        }`}
      >
        {label}
      </p>
    </div>
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

function StepWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function StepOne({ onNext }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Student Personal Information
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="First Name *">
          <input className={inputClass()} type="text" placeholder="Muhammad" />
        </FormInput>

        <FormInput label="Last Name *">
          <input className={inputClass()} type="text" placeholder="Ali" />
        </FormInput>

        <FormInput label="Date of Birth *">
          <input className={inputClass()} type="date" />
        </FormInput>

        <FormInput label="Gender *">
          <select className={inputClass()}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </FormInput>

        <FormInput label="Religion">
          <select className={inputClass()}>
            <option>Islam</option>
            <option>Other</option>
          </select>
        </FormInput>

        <FormInput label="Nationality">
          <input className={inputClass()} type="text" defaultValue="Pakistani" />
        </FormInput>
      </div>

      <div className="mt-5">
        <FormInput label="Home Address *">
          <textarea
            className={inputClass()}
            rows="3"
            placeholder="House No, Street, Area, Pabbi, Nowshera"
          />
        </FormInput>
      </div>

      <div className="mt-8 text-right">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Next: Academic Info <FaArrowRight />
        </button>
      </div>
    </StepWrapper>
  );
}

function StepTwo({ onNext, onBack }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Academic & Parent Information
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Class Applying For *">
          <select className={inputClass()}>
            {[
              "Nursery",
              "KG",
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
              "Grade 7",
              "Grade 8",
              "Grade 9",
              "Grade 10",
              "F.Sc Part 1",
              "F.Sc Part 2",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </FormInput>

        <FormInput label="Previous School">
          <input
            className={inputClass()}
            type="text"
            placeholder="Previous school name"
          />
        </FormInput>

        <FormInput label="Last Grade/Marks">
          <input className={inputClass()} type="text" placeholder="e.g. 85%" />
        </FormInput>

        <FormInput label="B-Form / CNIC #">
          <input
            className={inputClass()}
            type="text"
            placeholder="XXXXX-XXXXXXX-X"
          />
        </FormInput>
      </div>

      <div className="my-8 h-px bg-gray-200" />

      <h4 className="mb-5 text-lg font-extrabold text-black">
        Parent / Guardian Details
      </h4>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Father's Name *">
          <input className={inputClass()} type="text" placeholder="Full Name" />
        </FormInput>

        <FormInput label="Occupation">
          <input
            className={inputClass()}
            type="text"
            placeholder="e.g. Teacher, Farmer"
          />
        </FormInput>

        <FormInput label="Phone (WhatsApp) *">
          <input
            className={inputClass()}
            type="tel"
            placeholder="03XX-XXXXXXX"
          />
        </FormInput>

        <FormInput label="Email (optional)">
          <input
            className={inputClass()}
            type="email"
            placeholder="email@example.com"
          />
        </FormInput>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded border border-black px-6 py-3 font-semibold text-black transition hover:bg-black hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Next: Documents <FaArrowRight />
        </button>
      </div>
    </StepWrapper>
  );
}

function StepThree({ onNext, onBack }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Upload Documents
      </h3>

      <div className="space-y-5">
        <FileUpload label="Student Photo *" text="Click to upload passport photo (JPG/PNG)" icon={<FaCamera />} />
        <FileUpload label="Previous Result Card *" text="Upload result card (PDF or Image)" icon={<FaFileAlt />} />
        <FileUpload label="Father's CNIC Copy" text="Upload CNIC copy" icon={<FaIdCard />} />
        <FileUpload label="School Leaving Certificate" text="Upload SLC (if applicable)" icon={<FaSchool />} />
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded border border-black px-6 py-3 font-semibold text-black transition hover:bg-black hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Review Application <FaArrowRight />
        </button>
      </div>
    </StepWrapper>
  );
}

function FileUpload({ label, text, icon }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      toast.success(`${file.name} selected`);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <motion.label
        whileHover={{ scale: 1.01 }}
        className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-7 text-center transition hover:border-black hover:bg-gray-100"
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600">
          {icon}
        </div>

        <p className="text-sm font-semibold text-gray-600">{text}</p>
        <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
          <FaUpload />
          JPG, PNG, or PDF
        </p>
      </motion.label>
    </div>
  );
}

function StepFour({ onBack, onSubmit, agreed, setAgreed }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Review & Submit
      </h3>

      <div className="mb-6 rounded-xl bg-gray-100 p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          Application Summary
        </p>

        <div className="grid gap-4 text-sm md:grid-cols-2">
          <SummaryItem label="Student Name" value="Muhammad Ali" />
          <SummaryItem label="Class" value="Grade 9" />
          <SummaryItem label="Date of Birth" value="01-01-2010" />
          <SummaryItem label="Father's Name" value="Khan Sahib" />
          <SummaryItem label="Contact" value="03XX-XXXXXXX" />
          <SummaryItem label="Documents" value="3 Uploaded" />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1"
        />
        <span className="text-sm leading-6 text-gray-600">
          I confirm that all the information provided is correct and I agree to
          the school&apos;s terms and conditions.
        </span>
      </label>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded border border-black px-6 py-3 font-semibold text-black transition hover:bg-black hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
        >
          Submit Application <FaCheckCircle />
        </button>
      </div>
    </StepWrapper>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <span className="text-gray-400">{label}: </span>
      <strong className="text-black">{value}</strong>
    </div>
  );
}

function SuccessBox() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FaCheckCircle />
      </motion.div>

      <h3 className="mb-3 text-2xl font-extrabold text-black">
        Application Submitted!
      </h3>

      <p className="mx-auto mb-6 max-w-xl leading-7 text-gray-600">
        Thank you! Your admission application has been received. We will contact
        you within 2-3 working days via phone/WhatsApp to confirm your
        appointment.
      </p>

      <div className="mx-auto mb-8 inline-block rounded-xl bg-gray-100 px-8 py-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
          Application Reference #
        </p>
        <p className="text-2xl font-extrabold text-black">CSP-2025-0472</p>
      </div>

      <br />

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
      >
        <FaHome />
        Return to Home
      </Link>
    </motion.div>
  );
}