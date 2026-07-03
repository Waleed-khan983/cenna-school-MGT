
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  FaWhatsapp,
  FaSchool,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaTrophy,
  FaBullseye,
  FaStar,
  FaBookOpen,
  FaBalanceScale,
  FaLightbulb,
  FaHandsHelping,
  FaMale,
  FaFemale,
  FaMicroscope,
  FaLaptopCode,
  FaFutbol,
  FaTheaterMasks,
  FaUtensils,
  FaBus,
  FaBroadcastTower,
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
    transition: { duration: 0.5, ease: "easeOut" },
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

export default function AboutPage() {
  const timeline = [
    {
      year: "2005",
      title: "Foundation Year",
      text: "CENNA School established with Nursery to Grade 5. 50 students, 5 teachers.",
    },
    {
      year: "2009",
      title: "Middle School Added",
      text: "Expanded to Grade 8. New science lab and computer lab opened.",
    },
    {
      year: "2013",
      title: "Matric Section Launched",
      text: "First Matric batch appeared in BISE exams. 100% pass rate.",
    },
    {
      year: "2018",
      title: "College Section Added",
      text: "F.Sc Pre-Medical & Pre-Engineering offered. New building constructed.",
    },
    {
      year: "2024",
      title: "Digital Transformation",
      text: "LMS launched. Smart classrooms, digital library, and online portals introduced.",
    },
  ];

  const values = [
    {
      icon: <FaBookOpen />,
      title: "Academic Excellence",
      text: "Maintaining the highest standards in every subject, preparing students thoroughly for board exams and beyond.",
    },
    {
      icon: <FaBalanceScale />,
      title: "Moral & Ethical Values",
      text: "Instilling Islamic values, honesty, respect, and responsibility in every student.",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation & Creativity",
      text: "Encouraging critical thinking, problem-solving, and creative expression across all disciplines.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Inclusivity",
      text: "Ensuring every student, regardless of background, has access to quality education and opportunities.",
    },
  ];

  const faculty = [
    {
      icon: <FaMale />,
      name: "Mr. Ahmad Nawaz",
      subject: "Principal",
      qualification: "M.Ed – 20 Years Experience",
    },
    {
      icon: <FaFemale />,
      name: "Ms. Fatima Bibi",
      subject: "Mathematics",
      qualification: "M.Sc Maths – 15 Years",
    },
    {
      icon: <FaMale />,
      name: "Mr. Zubair Khan",
      subject: "Physics",
      qualification: "M.Sc Physics – 12 Years",
    },
    {
      icon: <FaFemale />,
      name: "Ms. Sana Akhtar",
      subject: "English",
      qualification: "MA English – 10 Years",
    },
    {
      icon: <FaMale />,
      name: "Mr. Tariq Mahmood",
      subject: "Chemistry",
      qualification: "M.Sc Chemistry – 14 Years",
    },
    {
      icon: <FaFemale />,
      name: "Ms. Nadia Gul",
      subject: "Biology",
      qualification: "M.Sc Biology – 8 Years",
    },
    {
      icon: <FaMale />,
      name: "Mr. Imran Shah",
      subject: "Computer Science",
      qualification: "MCS – 9 Years",
    },
    {
      icon: <FaFemale />,
      name: "Ms. Rabia Noreen",
      subject: "Urdu & Islamiat",
      qualification: "M.A Urdu – 11 Years",
    },
  ];

  const facilities = [
    {
      icon: <FaMicroscope />,
      title: "Science Laboratory",
      text: "Fully equipped Physics, Chemistry & Biology labs",
    },
    {
      icon: <FaLaptopCode />,
      title: "Computer Lab",
      text: "30 workstations with high-speed internet",
    },
    {
      icon: <FaBookOpen />,
      title: "Library",
      text: "5,000+ books, periodicals, and digital resources",
    },
    {
      icon: <FaFutbol />,
      title: "Sports Ground",
      text: "Cricket, football, and athletics facilities",
    },
    {
      icon: <FaTheaterMasks />,
      title: "Assembly Hall",
      text: "500-capacity hall for events and functions",
    },
    {
      icon: <FaUtensils />,
      title: "Canteen",
      text: "Hygienic food facility for students and staff",
    },
    {
      icon: <FaBus />,
      title: "Transport",
      text: "School van service for various areas",
    },
    {
      icon: <FaBroadcastTower />,
      title: "Smart Classrooms",
      text: "Projectors, smartboards in all senior classes",
    },
  ];

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
        whileHover={{ scale: 1.1, rotate: 8 }}
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
          <FaBookOpen />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-10 text-7xl text-yellow-500/10"
          variants={floating}
          animate="animate"
        >
          <FaGraduationCapIcon />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-3 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-300">About Us</span>
          </nav>

          <motion.h1
            className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            About CENNA School
            <br />& College Pabbi
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-8 text-gray-300"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            Our story, mission, and the people who make it happen.
          </motion.p>
        </div>
      </motion.section>

      {/* HISTORY */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
              Our Journey
            </p>

            <h2 className="mb-6 text-3xl font-extrabold text-black md:text-5xl">
              School History
            </h2>

            <p className="mb-5 leading-8 text-gray-600">
              Founded in 2005, CENNA School & College Pabbi began with a vision
              to provide quality education to the children of Pabbi and
              surrounding areas. What started as a small primary school has grown
              into a full-fledged institution offering education from Nursery to
              F.Sc level.
            </p>

            <p className="mb-8 leading-8 text-gray-600">
              Over nearly two decades, we have grown from 50 students and 5
              teachers to over 650 students and 45+ qualified faculty members.
              Our alumni are now serving in government, medical, engineering,
              and other professional fields across Pakistan and abroad.
            </p>

            <motion.div
              className="space-y-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {timeline.map((item) => (
                <TimelineItem
                  key={item.year}
                  year={item.year}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="rounded-xl bg-black p-8 text-center text-white shadow-xl md:p-12"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
          >
            <motion.div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl text-yellow-500"
              variants={floating}
              animate="animate"
            >
              <FaSchool />
            </motion.div>

            <h3 className="mb-2 text-3xl font-extrabold">CENNA School</h3>

            <p className="mb-10 text-sm font-bold uppercase tracking-widest text-yellow-500">
              & College Pabbi
            </p>

            <div className="grid grid-cols-2 gap-5">
              <DarkStat icon={<FaUsers />} number="650+" label="Students" />
              <DarkStat
                icon={<FaChalkboardTeacher />}
                number="45+"
                label="Faculty"
              />
              <DarkStat icon={<FaCalendarAlt />} number="19" label="Years" />
              <DarkStat icon={<FaTrophy />} number="95%" label="Pass Rate" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Our Purpose" title="Mission & Vision" />

          <motion.div
            className="mb-8 grid gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="rounded-xl bg-black p-8 text-white shadow-sm"
              variants={scaleIn}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl text-yellow-500"
                variants={floating}
                animate="animate"
              >
                <FaBullseye />
              </motion.div>

              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-500">
                Our Mission
              </p>

              <h3 className="mb-4 text-2xl font-extrabold">
                To Educate,
                <br />
                Empower & Inspire
              </h3>

              <p className="leading-8 text-gray-300">
                Our mission is to provide a comprehensive, inclusive, and
                high-quality education that equips every student with the
                knowledge, skills, and values necessary to succeed in an
                ever-changing world — academically, socially, and ethically.
              </p>
            </motion.div>

            <motion.div
              className="rounded-xl border-2 border-black bg-white p-8 shadow-sm"
              variants={scaleIn}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl text-yellow-600"
                variants={floating}
                animate="animate"
              >
                <FaStar />
              </motion.div>

              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-600">
                Our Vision
              </p>

              <h3 className="mb-4 text-2xl font-extrabold text-black">
                A Centre of
                <br />
                Academic Excellence
              </h3>

              <p className="leading-8 text-gray-600">
                To be the leading educational institution in KPK — recognized
                for outstanding academic results, character-building,
                innovation, and producing graduates who contribute positively to
                society and the nation.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((item) => (
              <ValueItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FACULTY */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Team"
            title="Faculty & Staff"
            subtitle="Our dedicated educators bring passion, expertise, and commitment to every classroom."
          />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {faculty.map((person) => (
              <FacultyCard
                key={person.name}
                icon={person.icon}
                name={person.name}
                subject={person.subject}
                qualification={person.qualification}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Campus"
            title="Infrastructure & Facilities"
          />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {facilities.map((facility) => (
              <FacilityCard
                key={facility.title}
                icon={facility.icon}
                title={facility.title}
                text={facility.text}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FaGraduationCapIcon() {
  return <FaSchool />;
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

function TimelineItem({ year, title, text }) {
  return (
    <motion.div
      className="relative border-l-4 border-yellow-500 pl-6"
      variants={fadeUp}
      whileHover={{ x: 6 }}
    >
      <div className="mb-1 text-sm font-extrabold uppercase tracking-widest text-yellow-600">
        {year}
      </div>
      <h4 className="mb-1 font-bold text-black">{title}</h4>
      <p className="text-sm leading-6 text-gray-600">{text}</p>
    </motion.div>
  );
}

function DarkStat({ icon, number, label }) {
  return (
    <motion.div
      className="rounded-lg border border-white/10 p-5"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-yellow-500">
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-yellow-500">{number}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

function ValueItem({ icon, title, text }) {
  return (
    <motion.div
      className="group flex gap-5 rounded-xl border border-gray-200 bg-white p-6 transition hover:border-black hover:bg-black hover:shadow-md"
      variants={fadeUp}
      whileHover={{ y: -6 }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl text-yellow-600 transition group-hover:bg-white/10">
        {icon}
      </div>

      <div>
        <h4 className="mb-2 text-lg font-bold text-black transition group-hover:text-white">
          {title}
        </h4>
        <p className="leading-7 text-gray-600 transition group-hover:text-gray-300">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function FacultyCard({ icon, name, subject, qualification }) {
  return (
    <motion.div
      className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-black hover:shadow-md"
      variants={scaleIn}
      whileHover={{ y: -8 }}
    >
      <motion.div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-3xl text-yellow-600"
        whileHover={{ rotate: 8, scale: 1.08 }}
      >
        {icon}
      </motion.div>

      <h3 className="mb-1 text-lg font-extrabold text-black">{name}</h3>
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-yellow-600">
        {subject}
      </p>
      <p className="text-sm text-gray-500">{qualification}</p>
    </motion.div>
  );
}

function FacilityCard({ icon, title, text }) {
  return (
    <motion.div
      className="rounded-xl border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:border-black hover:shadow-md"
      variants={scaleIn}
      whileHover={{ y: -8 }}
    >
      <motion.div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl text-yellow-600"
        whileHover={{ rotate: 8, scale: 1.08 }}
      >
        {icon}
      </motion.div>

      <h4 className="mb-2 text-lg font-extrabold text-black">{title}</h4>
      <p className="text-sm leading-6 text-gray-500">{text}</p>
    </motion.div>
  );
}