"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { getPublicVacanciesApi } from "@/services/publicJobService";
import { submitApplication } from "@/services/jobApplicationPublicService";

import {
  FaWhatsapp,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaHome,
  FaUpload,
  FaFileAlt,
  FaUserTie,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaFlask,
  FaCalculator,
  FaRunning,
  FaBriefcase,
  FaGraduationCap,
  FaMoneyBillWave,
  FaHeartbeat,
  FaStar,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const benefits = [
  {
    icon: <FaMoneyBillWave />,
    title: "Competitive Salary",
    text: "Market-rate salaries with annual increments and performance bonuses.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Professional Growth",
    text: "Regular training workshops, seminars, and career development programs.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Health Coverage",
    text: "Medical allowance and health support for staff and their families.",
  },
  {
    icon: <FaStar />,
    title: "Positive Environment",
    text: "A collaborative, respectful and growth-oriented school culture.",
  },
];

const qualifications = [
  "Matric (SSC)",
  "Intermediate (HSSC / FA / FSc)",
  "Bachelor's Degree (BA / BSc / BEd)",
  "Master's Degree (MA / MSc / MEd)",
  "M.Phil",
  "PhD",
  "Diploma / Certificate",
];

const initialForm = {
  vacancy: "",
  position: "",
  fullName: "",
  fatherName: "",
  cnic: "",
  phone: "",
  email: "",
  address: "",
  qualification: "",
  experience: "",
  expectedSalary: "",
  coverLetter: "",
};

function getJobIcon(title = "") {
  const value = title.toLowerCase();

  if (value.includes("math")) return <FaCalculator />;
  if (value.includes("science") || value.includes("lab")) return <FaFlask />;
  if (value.includes("computer") || value.includes("it"))
    return <FaLaptopCode />;
  if (value.includes("physical") || value.includes("sports"))
    return <FaRunning />;
  if (value.includes("teacher")) return <FaChalkboardTeacher />;
  if (value.includes("admin") || value.includes("officer"))
    return <FaUserTie />;

  return <FaBriefcase />;
}

export default function JobApplicationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [vacancies, setVacancies] = useState([]);
  const [vacancyLoading, setVacancyLoading] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPublicVacancies = async () => {
    try {
      setVacancyLoading(true);
      const data = await getPublicVacanciesApi();
      setVacancies(data?.vacancies || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load job vacancies");
    } finally {
      setVacancyLoading(false);
    }
  };

  useEffect(() => {
    loadPublicVacancies();
  }, []);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectVacancy = (job) => {
    setSelectedVacancy(job);

    setFormData((prev) => ({
      ...prev,
      vacancy: job?._id || "",
      position: job?.title || "",
    }));
  };

  const handleApplyClick = (job) => {
    selectVacancy(job);
    setStep(4);

    setTimeout(() => {
      document.getElementById("apply")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    toast.info(`${job.title} selected`);
  };

  const nextStep = () => {
    if (step < 5) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const validateBeforeSubmit = () => {
    if (!agreed) {
      toast.error("Please accept the declaration before submitting.");
      return false;
    }

    if (!formData.position || !formData.fullName) {
      toast.error("Position and full name are required.");
      return false;
    }

    if (!formData.phone || !formData.email) {
      toast.error("Phone and email are required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("vacancy", formData.vacancy);
      data.append("position", formData.position);
      data.append("fullName", formData.fullName);
      data.append("fatherName", formData.fatherName);
      data.append("cnic", formData.cnic);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("qualification", formData.qualification);
      data.append("experience", formData.experience);
      data.append("expectedSalary", formData.expectedSalary);
      data.append("coverLetter", formData.coverLetter);

      if (cvFile) {
        data.append("cv", cvFile);
      }

      await submitApplication(data);

      toast.success("Application submitted successfully");
      setSubmitted(true);
      setFormData(initialForm);
      setCvFile(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.a
        href="https://wa.me/+923339038030"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.12, rotate: 8 }}
      >
        <FaWhatsapp />
      </motion.a>

      <motion.section
        className="relative mt-20 overflow-hidden bg-black px-6 py-20 text-white lg:px-20"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute right-10 top-10 text-8xl text-white/5">
          <FaBriefcase />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">Careers</span>
          </nav>

          <motion.h1
            className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Join Our Team
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-8 text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Be part of a dedicated team shaping the future of education at CENNA
            School.
          </motion.p>
        </div>
      </motion.section>

      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Why Work With Us" title="Benefits & Perks" />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {benefits.map((item) => (
              <BenefitCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Now Hiring"
            title="Open Positions"
            subtitle="These vacancies are published by the school administration."
          />

          {vacancyLoading ? (
            <div className="rounded-2xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm">
              Loading vacancies...
            </div>
          ) : vacancies.length > 0 ? (
            <motion.div
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {vacancies.map((job) => (
                <PositionCard
                  key={job._id}
                  icon={getJobIcon(job.title)}
                  title={job.title}
                  type={job.jobType}
                  seats={`${job.seats || 1} Seat${Number(job.seats) > 1 ? "s" : ""}`}
                  department={job.department}
                  lastDate={job.lastDate}
                  onApply={() => handleApplyClick(job)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center font-bold text-gray-500 shadow-sm">
              No active job vacancies right now.
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Apply Online"
            title="Job Application Form"
            subtitle="Select a vacancy above or choose a position in the form."
          />

          {selectedVacancy && (
            <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                Selected Vacancy
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-black">
                {selectedVacancy.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {selectedVacancy.department || "Department N/A"} •{" "}
                {selectedVacancy.jobType || "Job Type N/A"} •{" "}
                {selectedVacancy.seats || 1} Seat
              </p>
            </div>
          )}

          <motion.div className="mx-auto mb-10 flex max-w-3xl overflow-x-auto">
            {[1, 2, 3, 4, 5].map((item) => (
              <StepIndicator
                key={item}
                number={item}
                label={
                  item === 1
                    ? "Personal"
                    : item === 2
                      ? "Education"
                      : item === 3
                        ? "Experience"
                        : item === 4
                          ? "Position"
                          : "Confirm"
                }
                active={step === item}
                done={step > item || submitted}
              />
            ))}
          </motion.div>

          <motion.div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
            {!submitted ? (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepOne
                    key="step-1"
                    formData={formData}
                    updateField={updateField}
                    onNext={nextStep}
                  />
                )}

                {step === 2 && (
                  <StepTwo
                    key="step-2"
                    formData={formData}
                    updateField={updateField}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {step === 3 && (
                  <StepThree
                    key="step-3"
                    formData={formData}
                    updateField={updateField}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {step === 4 && (
                  <StepFour
                    key="step-4"
                    formData={formData}
                    updateField={updateField}
                    vacancies={vacancies}
                    selectedVacancy={selectedVacancy}
                    selectVacancy={selectVacancy}
                    cvFile={cvFile}
                    setCvFile={setCvFile}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {step === 5 && (
                  <StepFive
                    key="step-5"
                    formData={formData}
                    selectedVacancy={selectedVacancy}
                    onBack={prevStep}
                    onSubmit={handleSubmit}
                    agreed={agreed}
                    setAgreed={setAgreed}
                    submitting={submitting}
                  />
                )}
              </AnimatePresence>
            ) : (
              <SuccessBox selectedVacancy={selectedVacancy} />
            )}
          </motion.div>
        </div>
      </section>

      <section className="bg-black px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-yellow-500">
                Have Questions?
              </p>
              <h3 className="text-2xl font-extrabold text-white md:text-3xl">
                Contact HR Department
              </h3>
            </div>

            <div className="flex flex-wrap gap-5">
              <ContactChip icon={<FaPhoneAlt />} text="0333-9038030" />
              <ContactChip icon={<FaEnvelope />} text="hr@cennaschool.edu.pk" />
              <ContactChip
                icon={<FaMapMarkerAlt />}
                text="Pabbi, Nowshera, KPK"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <motion.div className="mb-12 text-center">
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

function BenefitCard({ icon, title, text }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="rounded-xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600">
        {icon}
      </div>
      <h4 className="mb-2 text-lg font-extrabold text-black">{title}</h4>
      <p className="text-sm leading-6 text-gray-500">{text}</p>
    </motion.div>
  );
}

function PositionCard({
  icon,
  title,
  type,
  seats,
  department,
  lastDate,
  onApply,
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600">
          {icon}
        </div>

        <div className="flex-1">
          <h4 className="font-extrabold text-black">{title}</h4>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-bold text-white">
              {type || "Full-Time"}
            </span>
            <span className="text-xs font-semibold text-gray-400">{seats}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {department || "General Department"}
          </p>

          <p className="mt-1 text-xs font-bold text-gray-400">
            Last Date:{" "}
            {lastDate ? new Date(lastDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
      >
        Apply Now
      </button>
    </motion.div>
  );
}

function StepIndicator({ number, label, active, done }) {
  return (
    <div className="relative flex min-w-[90px] flex-1 flex-col items-center gap-2">
      <div
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
          done
            ? "border-yellow-500 bg-yellow-500 text-black"
            : active
              ? "border-black bg-black text-white"
              : "border-gray-200 bg-white text-gray-400"
        }`}
      >
        {done ? <FaCheckCircle /> : number}
      </div>
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

function StepOne({ formData, updateField, onNext }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Personal Information
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Full Name *">
          <input
            className={inputClass()}
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            type="text"
            placeholder="Muhammad Ali Khan"
          />
        </FormInput>

        <FormInput label="Father's Name">
          <input
            className={inputClass()}
            value={formData.fatherName}
            onChange={(e) => updateField("fatherName", e.target.value)}
            type="text"
            placeholder="Muhammad Aslam Khan"
          />
        </FormInput>

        <FormInput label="CNIC">
          <input
            className={inputClass()}
            value={formData.cnic}
            onChange={(e) => updateField("cnic", e.target.value)}
            type="text"
            placeholder="XXXXX-XXXXXXX-X"
          />
        </FormInput>

        <FormInput label="Phone *">
          <input
            className={inputClass()}
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            type="tel"
            placeholder="0312-1234567"
          />
        </FormInput>

        <FormInput label="Email Address *">
          <input
            className={inputClass()}
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            type="email"
            placeholder="example@email.com"
          />
        </FormInput>
      </div>

      <div className="mt-5">
        <FormInput label="Residential Address">
          <textarea
            className={inputClass()}
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            rows="2"
            placeholder="Address"
          />
        </FormInput>
      </div>

      <div className="mt-8 text-right">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white"
        >
          Next: Education <FaArrowRight />
        </button>
      </div>
    </StepWrapper>
  );
}

function StepTwo({ formData, updateField, onNext, onBack }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Educational Background
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Highest Qualification">
          <select
            className={inputClass()}
            value={formData.qualification}
            onChange={(e) => updateField("qualification", e.target.value)}
          >
            <option value="">Select Qualification</option>
            {qualifications.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </FormInput>
      </div>

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-black px-6 py-3"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Next
        </button>
      </div>
    </StepWrapper>
  );
}

function StepThree({ formData, updateField, onNext, onBack }) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Work Experience
      </h3>

      <FormInput label="Experience">
        <input
          className={inputClass()}
          value={formData.experience}
          onChange={(e) => updateField("experience", e.target.value)}
          type="text"
          placeholder="e.g. 3 Years / Fresh"
        />
      </FormInput>

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-black px-6 py-3"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Next
        </button>
      </div>
    </StepWrapper>
  );
}

function StepFour({
  formData,
  updateField,
  vacancies,
  selectedVacancy,
  selectVacancy,
  cvFile,
  setCvFile,
  onNext,
  onBack,
}) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Position & Documents
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Applied Position *">
          <select
            className={inputClass()}
            value={selectedVacancy?._id || ""}
            onChange={(e) => {
              const job = vacancies.find((item) => item._id === e.target.value);
              selectVacancy(job || null);
            }}
          >
            <option value="">Select Position</option>
            {vacancies.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </FormInput>

        <FormInput label="Job Type">
          <input
            className={inputClass()}
            value={selectedVacancy?.jobType || ""}
            readOnly
            placeholder="Auto-filled after selecting vacancy"
          />
        </FormInput>

        <FormInput label="Expected Salary">
          <input
            className={inputClass()}
            value={formData.expectedSalary}
            onChange={(e) => updateField("expectedSalary", e.target.value)}
            type="text"
            placeholder="50,000"
          />
        </FormInput>
      </div>

      <div className="mt-5">
        <FormInput label="Cover Letter">
          <textarea
            className={inputClass()}
            value={formData.coverLetter}
            onChange={(e) => updateField("coverLetter", e.target.value)}
            rows="4"
            placeholder="Why should we hire you?"
          />
        </FormInput>
      </div>

      <div className="my-8 h-px bg-gray-200" />

      <FormInput label="CV / Resume">
        <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setCvFile(file || null);
              if (file) toast.success(`${file.name} selected`);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600">
            <FaFileAlt />
          </div>

          <p className="text-sm font-semibold text-gray-600">
            {cvFile ? cvFile.name : "Upload your CV or resume"}
          </p>

          <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <FaUpload /> PDF only
          </p>
        </label>
      </FormInput>

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-black px-6 py-3"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded bg-black px-6 py-3 text-white"
        >
          Review
        </button>
      </div>
    </StepWrapper>
  );
}

function StepFive({
  formData,
  selectedVacancy,
  onBack,
  onSubmit,
  agreed,
  setAgreed,
  submitting,
}) {
  return (
    <StepWrapper>
      <h3 className="mb-6 text-xl font-extrabold text-black">
        Review & Submit
      </h3>

      <div className="mb-6 rounded-xl bg-gray-100 p-6">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <SummaryItem label="Applicant" value={formData.fullName || "N/A"} />
          <SummaryItem
            label="Applied For"
            value={selectedVacancy?.title || formData.position || "N/A"}
          />
          <SummaryItem
            label="Qualification"
            value={formData.qualification || "N/A"}
          />
          <SummaryItem
            label="Experience"
            value={formData.experience || "N/A"}
          />
          <SummaryItem label="Phone" value={formData.phone || "N/A"} />
          <SummaryItem label="Email" value={formData.email || "N/A"} />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm leading-6 text-gray-600">
          I declare that all information provided is true and correct.
        </span>
      </label>

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-black px-6 py-3"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded bg-yellow-500 px-6 py-3 font-bold disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Application"}
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

function SuccessBox({ selectedVacancy }) {
  return (
    <motion.div className="text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
        <FaCheckCircle />
      </div>

      <h3 className="mb-3 text-2xl font-extrabold text-black">
        Application Submitted!
      </h3>

      <p className="mx-auto mb-6 max-w-xl leading-7 text-gray-600">
        Your application for{" "}
        <strong>{selectedVacancy?.title || "the selected position"}</strong> has
        been received.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded bg-black px-6 py-3 font-semibold text-white"
      >
        <FaHome /> Return to Home
      </Link>
    </motion.div>
  );
}

function ContactChip({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300">
      <span className="text-yellow-500">{icon}</span>
      {text}
    </div>
  );
}
