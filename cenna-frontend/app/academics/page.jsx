"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaWhatsapp,
  FaGraduationCap,
  FaChild,
  FaSchool,
  FaUserGraduate,
  FaMicroscope,
  FaLaptopCode,
  FaFlask,
  FaLightbulb,
  FaClipboardList,
  FaChevronDown,
  FaCheckCircle,
  FaStar,
  FaTrophy,
  FaCalendarAlt,
  FaPenAlt,
  FaFileAlt,
  FaChalkboardTeacher,
  FaBookOpen,
  FaFutbol,
  FaShieldAlt,
  FaVideo,
  FaUsers,
  FaAward,
  FaComments,
  FaMosque,
  FaLanguage,
  FaChartLine,
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

export default function AcademicsPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const classPrograms = [
    {
      badge: "Early Years",
      title: "Nursery – KG",
      icon: <FaChild />,
      description:
        "Play-based learning to build early reading, writing, counting, speaking, and social development.",
      subjects: [
        "English Basics",
        "Urdu Basics",
        "Math Concepts",
        "Drawing & Art",
        "Islamiat Basics",
      ],
    },
    {
      badge: "Primary",
      title: "Grade 1 – 5",
      icon: <FaSchool />,
      description:
        "Strong academic foundation with activity-based teaching and regular class assessment.",
      subjects: [
        "English",
        "Urdu",
        "Mathematics",
        "General Science",
        "Islamiat",
        "Social Studies",
      ],
    },
    {
      badge: "Middle",
      title: "Grade 6 – 8",
      icon: <FaBookOpen />,
      description:
        "Concept-based learning in science, mathematics, languages, computer, and social studies.",
      subjects: [
        "English",
        "Urdu",
        "Mathematics",
        "Science",
        "Computer",
        "Pakistan Studies",
        "Islamiat",
      ],
    },
    {
      badge: "Matriculation",
      title: "Grade 9 – 10",
      icon: <FaUserGraduate />,
      description:
        "Board-focused Matric preparation with regular tests, practical work, and exam guidance.",
      subjects: [
        "English & Urdu",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology / Computer Science",
        "Pakistan Studies",
        "Islamiat",
      ],
    },
    {
      badge: "F.Sc Pre-Medical",
      title: "F.Sc Part 1 & 2",
      icon: <FaMicroscope />,
      description:
        "Pre-Medical program for students aiming for medical, pharmacy, and life science careers.",
      subjects: ["English", "Urdu", "Physics", "Chemistry", "Biology", "Islamiat"],
    },
    {
      badge: "F.Sc Pre-Engineering",
      title: "F.Sc Engineering",
      icon: <FaLaptopCode />,
      description:
        "Pre-Engineering program for students planning engineering, technology, and computer careers.",
      subjects: [
        "English",
        "Urdu",
        "Physics",
        "Chemistry",
        "Mathematics",
        "Islamiat",
      ],
    },
  ];

  const curriculumItems = [
    {
      icon: <FaBookOpen />,
      title: "National Curriculum & BISE Standards",
      text: "Our academic program follows national curriculum standards and board examination requirements. Students are prepared through regular lessons, tests, revision, and practical work.",
    },
    {
      icon: <FaLightbulb />,
      title: "Teaching Methodology",
      text: "Teachers use explanation, discussion, class activities, written practice, group work, presentations, and practical demonstrations to improve understanding.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Digital Learning & LMS",
      text: "The school management system supports recorded lectures, assignments, quizzes, results, attendance, and parent monitoring through student, parent, and teacher portals, plus admin monitoring and reporting.",
    },
    {
      icon: <FaVideo />,
      title: "Jitsi Meet Live Classes",
      text: "Jitsi Meet can be used for online classes, meetings, and academic support when needed. This helps students continue learning even outside the classroom.",
    },
    {
      icon: <FaFlask />,
      title: "Practical Labs",
      text: "Physics, Chemistry, Biology, and Computer practical work helps students understand concepts through hands-on learning and observation.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Exam Preparation & Extra Support",
      text: "Board classes receive special attention through revision tests, exam practice, teacher guidance, and extra support before major exams.",
    },
  ];

  const examRows = [
    {
      type: "Monthly Tests",
      when: "Every Month",
      weightage: "Practice / Assessment",
      icon: <FaPenAlt />,
    },
    {
      type: "Mid-Term Exam",
      when: "Mid Session",
      weightage: "Internal Result",
      icon: <FaClipboardList />,
    },
    {
      type: "Final Exam",
      when: "End Session",
      weightage: "Promotion Decision",
      icon: <FaFileAlt />,
    },
    {
      type: "BISE Board Exam",
      when: "Annual",
      weightage: "Board Marks",
      icon: <FaTrophy />,
    },
    {
      type: "Online Quizzes",
      when: "As Scheduled",
      weightage: "Practice / LMS",
      icon: <FaLaptopCode />,
    },
  ];

  const grades = [
    ["A+ (90–100%)", "Outstanding"],
    ["A (80–89%)", "Excellent"],
    ["B (70–79%)", "Very Good"],
    ["C (60–69%)", "Good"],
    ["D (50–59%)", "Pass"],
    ["F (Below 50%)", "Fail"],
  ];

  const departments = [
    {
      icon: <FaFlask />,
      title: "Science Department",
      text: "Physics, Chemistry, Biology, practical work, and board exam preparation.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Computer Science",
      text: "Computer basics, digital skills, programming concepts, and practical computer lab work.",
    },
    {
      icon: <FaLanguage />,
      title: "Languages",
      text: "English, Urdu, reading, writing, speaking, grammar, and communication skills.",
    },
    {
      icon: <FaMosque />,
      title: "Islamic Studies",
      text: "Islamiat, Quranic values, ethics, manners, and moral character building.",
    },
  ];

  const facilities = [
    { icon: <FaLaptopCode />, title: "Computer Lab" },
    { icon: <FaFlask />, title: "Science Lab" },
    { icon: <FaBookOpen />, title: "Library" },
    { icon: <FaFutbol />, title: "Sports Ground" },
    { icon: <FaChalkboardTeacher />, title: "Smart Learning" },
    { icon: <FaShieldAlt />, title: "Secure Campus" },
  ];

  const activities = [
    "Sports Competitions",
    "Debate Competitions",
    "Science Fair",
    "Qirat Competition",
    "Naat Competition",
    "Speech Competition",
    "Study Tours",
    "Annual Function",
  ];

  const lmsFeatures = [
    "Recorded Lectures",
    "Jitsi Live Classes",
    "Assignments",
    "Online Quizzes",
    "Attendance Tracking",
    "Subject-wise Results",
    "Fee Records",
    "Parent Monitoring",
  ];

  const calendar = [
    { title: "Academic Session Starts", time: "Start of Session" },
    { title: "Monthly Tests", time: "Every Month" },
    { title: "Mid-Term Exams", time: "Middle of Session" },
    { title: "Sports Week", time: "As Scheduled" },
    { title: "Final Exams", time: "End of Session" },
    { title: "Result, Promotion & Fail Status", time: "After Final Exams" },
  ];

  return (
    <>
      {/* WHATSAPP FLOAT */}
      <motion.a
        href="https://wa.me/923339038030"
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
          <FaBookOpen />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">Academics</span>
          </nav>

          <motion.h1
            className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Academic Programs
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-8 text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            Complete education from Nursery to F.Sc with strong academics,
            discipline, digital learning, practical labs, and board preparation.
          </motion.p>
        </div>
      </motion.section>

      {/* CLASSES */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Programs Offered"
            title="Classes Offered"
            subtitle="We provide a complete academic journey from early years to college level."
          />

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {classPrograms.map((program) => (
              <ClassCard
                key={program.title}
                badge={program.badge}
                title={program.title}
                icon={program.icon}
                description={program.description}
                subjects={program.subjects}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Departments"
            title="Academic Departments"
            subtitle="Each department focuses on subject knowledge, exam preparation, and student development."
          />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {departments.map((item) => (
              <IconCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CURRICULUM & EXAM SYSTEM */}
      <section id="curriculum" className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Methodology" title="Curriculum & Examination" />

          <div className="grid gap-10 lg:grid-cols-2">
            {/* ACCORDION */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="mb-6 text-2xl font-extrabold text-black">
                Curriculum Overview
              </h3>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {curriculumItems.map((item, index) => (
                  <AccordionItem
                    key={item.title}
                    item={item}
                    isOpen={openAccordion === index}
                    onClick={() =>
                      setOpenAccordion(openAccordion === index ? null : index)
                    }
                  />
                ))}
              </div>
            </motion.div>

            {/* EXAM SYSTEM */}
            <motion.div
              id="exams"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="mb-6 text-2xl font-extrabold text-black">
                Examination System
              </h3>

              <motion.div
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                variants={scaleIn}
                whileHover={{ y: -4 }}
              >
                <div className="grid grid-cols-3 bg-black px-5 py-4 text-xs font-bold uppercase tracking-widest text-white">
                  <div>Exam Type</div>
                  <div>When</div>
                  <div>Purpose</div>
                </div>

                <div>
                  {examRows.map((row) => (
                    <ExamRow
                      key={row.type}
                      icon={row.icon}
                      type={row.type}
                      when={row.when}
                      weightage={row.weightage}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-5 rounded-xl bg-black p-6 text-white shadow-sm"
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-500">
                  Grading System
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {grades.map(([grade, meaning]) => (
                    <div key={grade} className="contents">
                      <div className="text-gray-300">{grade}</div>
                      <div
                        className={
                          meaning === "Fail"
                            ? "font-semibold text-red-500"
                            : "font-semibold text-yellow-500"
                        }
                      >
                        {meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Facilities"
            title="Academic Facilities"
            subtitle="Facilities that support classroom learning, practical work, digital education, and student development."
          />

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {facilities.map((item) => (
              <FacilityCard key={item.title} icon={item.icon} title={item.title} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* LMS */}
      <section className="bg-black px-6 py-20 text-white lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Digital Learning"
            title="Learning Management System"
            subtitle="Our digital system supports students, parents, teachers, and administration with modern school management features."
            dark
          />

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {lmsFeatures.map((item) => (
              <motion.div
                key={item}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <FaCheckCircle className="text-yellow-500" />
                <span className="font-semibold text-gray-200">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CO-CURRICULAR ACTIVITIES */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Activities"
            title="Co-Curricular Activities"
            subtitle="We believe that confidence, discipline, teamwork, and creativity are also important parts of education."
          />

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {activities.map((item) => (
              <motion.div
                key={item}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <FaAward className="mb-4 text-3xl text-yellow-600" />
                <h3 className="font-bold text-black">{item}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FACULTY */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
                Faculty
              </p>
              <h2 className="mb-5 text-3xl font-extrabold text-black md:text-5xl">
                Experienced Teachers & Student Support
              </h2>
              <p className="leading-8 text-gray-600">
                Our teachers focus on concept clarity, discipline, regular
                assessment, exam preparation, and individual student guidance.
                Teacher remarks and student performance records are also part of
                the digital school management system.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-5 sm:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <MiniCard icon={<FaChalkboardTeacher />} title="Subject Specialists" />
              <MiniCard icon={<FaChartLine />} title="Student Performance Monitoring" />
              <MiniCard icon={<FaComments />} title="Student Remarks" />
              <MiniCard icon={<FaTrophy />} title="Board Exam Preparation" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ACADEMIC CALENDAR */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Schedule"
            title="Academic Calendar"
            subtitle="Important academic activities are planned throughout the school year."
          />

          <motion.div
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {calendar.map((item) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <FaCalendarAlt className="mb-4 text-3xl text-yellow-600" />
                <h3 className="text-lg font-bold text-black">{item.title}</h3>
                <p className="mt-2 text-gray-500">{item.time}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ label, title, subtitle, dark = false }) {
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

      <h2
        className={`mb-4 text-3xl font-extrabold md:text-5xl ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mx-auto max-w-2xl leading-7 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function ClassCard({ badge, title, icon, description, subjects }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-black hover:shadow-md"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full bg-black px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
          {badge}
        </span>

        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-xl text-yellow-600"
          variants={floating}
          animate="animate"
        >
          {icon}
        </motion.div>
      </div>

      <h3 className="mb-4 text-2xl font-extrabold text-black">{title}</h3>

      <p className="mb-5 text-sm leading-7 text-gray-600">{description}</p>

      <ul className="space-y-3">
        {subjects.map((subject) => (
          <motion.li
            key={subject}
            className="flex items-center gap-3 border-b border-gray-100 pb-2 text-sm text-gray-600"
            whileHover={{ x: 5 }}
          >
            <FaBookOpen className="text-yellow-500" />
            {subject}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function AccordionItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <span className="flex items-center gap-3 font-bold text-black">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            {item.icon}
          </span>
          {item.title}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-gray-500"
        >
          <FaChevronDown />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[4.5rem] text-sm leading-7 text-gray-600">
              {item.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExamRow({ icon, type, when, weightage }) {
  return (
    <motion.div
      className="grid grid-cols-3 items-center border-b border-gray-100 px-5 py-4 text-sm last:border-b-0"
      whileHover={{ backgroundColor: "#f9fafb" }}
    >
      <div className="flex items-center gap-3 font-semibold text-gray-800">
        <span className="text-yellow-600">{icon}</span>
        {type}
      </div>
      <div className="text-gray-600">{when}</div>
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <FaCheckCircle className="text-yellow-500" />
        {weightage}
      </div>
    </motion.div>
  );
}

function IconCard({ icon, title, text }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl text-yellow-600">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-black">{title}</h3>
      <p className="text-sm leading-7 text-gray-600">{text}</p>
    </motion.div>
  );
}

function FacilityCard({ icon, title }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black text-2xl text-yellow-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-black">{title}</h3>
    </motion.div>
  );
}

function MiniCard({ icon, title }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6 }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="mb-4 text-3xl text-yellow-600">{icon}</div>
      <h3 className="font-bold text-black">{title}</h3>
    </motion.div>
  );
}