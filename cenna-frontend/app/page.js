"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaWhatsapp,
  FaBullhorn,
  FaCalendarAlt,
  FaClipboardList,
  FaTrophy,
  FaBookOpen,
  FaStar,
  FaMedal,
  FaFutbol,
  FaAward,
  FaGraduationCap,
  FaMicroscope,
  FaLaptopCode,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaBriefcase,
  FaVideo,
  FaMobileAlt,
  FaUsers,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
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

const heroSlides = [
  {
    image: "/images/school_image.jpeg",
    label: "CENNA School & College",
    title: "Quality Education for a Better Future",
    text: "CENNA School & College Pabbi provides academic excellence, character building, and modern learning facilities.",
  },
  {
    image: "/images/school_image.jpeg",
    label: "Digital Learning",
    title: "Modern LMS, Online Classes & Smart Portals",
    text: "Students, parents, teachers, and admins can manage learning, attendance, fees, results, and communication online.",
  },
  {
    image: "/images/principal_image.jpeg",
    label: "Leadership",
    title: "Building Discipline, Confidence & Success",
    text: "Our mission is to prepare students for academic success and responsible leadership.",
  },
];

const notices = [
  "New academic session information is available at the school office",
  "Student and parent portal access is managed by school administration",
  "Jitsi live classes and recorded lectures coming soon",
  "Mid-Term Exam Schedule will be announced soon",
  "Gallery, News, Events, and Announcements updated regularly",
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* WHATSAPP FLOAT */}
      <motion.a
        href="https://wa.me/923009290845"
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

      {/* ANNOUNCEMENT */}
      <section className="mt-20 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <motion.span
            className="z-10 flex shrink-0 items-center gap-2 rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-black"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaBullhorn />
            Notice
          </motion.span>

          <div className="relative flex-1 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee flex w-max items-center gap-8 text-sm text-gray-200">
              {[...notices, ...notices].map((text, index) => (
                <span key={index} className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HERO CAROUSEL */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={heroSlides[activeSlide].image}
              alt={heroSlides[activeSlide].title}
              fill
              priority
              className="object-cover opacity-45"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

        <motion.div
          className="absolute left-10 top-24 text-7xl text-yellow-500/20"
          variants={floating}
          animate="animate"
        >
          <FaGraduationCap />
        </motion.div>

        <motion.div
          className="absolute bottom-16 right-16 text-7xl text-white/10"
          variants={floating}
          animate="animate"
        >
          <FaBookOpen />
        </motion.div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400"
            >
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              {heroSlides[activeSlide].label}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl"
            >
              {heroSlides[activeSlide].title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-8 max-w-xl text-lg leading-8 text-gray-300"
            >
              {heroSlides[activeSlide].text}
            </motion.p>

            <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
              >
                Contact School <FaArrowRight />
              </Link>

              <Link
                href="/login"
                className="rounded border border-white px-6 py-3 font-bold text-white transition hover:bg-white hover:text-black"
              >
                Portal Login
              </Link>

              <Link
                href="/about"
                className="rounded border border-white/40 px-6 py-3 font-bold text-white transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
            >
              <Stat number="650+" label="Students" dark />
              <Stat number="45+" label="Faculty" dark />
              <Stat number="19yrs" label="Excellence" dark />
              <Stat number="95%" label="Pass Rate" dark />
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur md:block"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <h3 className="mb-4 text-2xl font-extrabold text-white">
              CENNA Digital Campus
            </h3>

            <div className="grid gap-4">
              <HeroFeature icon={<FaVideo />} title="Jitsi Live Classes" />
              <HeroFeature icon={<FaBookOpen />} title="Recorded Lectures" />
              <HeroFeature icon={<FaClipboardList />} title="Assignments & Quizzes" />
              <HeroFeature icon={<FaUsers />} title="Student, Parent & Teacher Portals" />
              <HeroFeature icon={<FaMobileAlt />} title="PWA Ready Experience" />
            </div>
          </motion.div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-yellow-500 hover:text-black md:flex"
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-yellow-500 hover:text-black md:flex"
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-3 rounded-full transition ${
                activeSlide === index ? "w-8 bg-yellow-500" : "w-3 bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="overflow-hidden border-y border-gray-200 bg-gray-50 py-5">
        <motion.div
          className="flex flex-wrap justify-center gap-6 px-6 text-sm font-semibold text-gray-700"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            "Quality Education",
            "Modern Curriculum",
            "Experienced Faculty",
            "Digital Learning",
            "Jitsi Online Classes",
            "Sports Facilities",
            "Science Labs",
            "Computer Labs",
            "Library",
            "Student Management System",
          ].map((item) => (
            <motion.span
              key={item}
              variants={fadeUp}
              whileHover={{ y: -3, scale: 1.04 }}
              className="flex items-center gap-2"
            >
              <FaStar className="text-yellow-500" />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Our Milestones"
            title="School Achievements"
            subtitle="Years of dedication reflected in numbers that speak for themselves."
          />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <AchievementCard
              icon={<FaTrophy />}
              number="95%"
              title="Board Pass Rate"
              text="Consistent excellence in board examinations"
            />
            <AchievementCard
              icon={<FaMedal />}
              number="32"
              title="District Positions"
              text="Top positions in district level competitions"
            />
            <AchievementCard
              icon={<FaFutbol />}
              number="18"
              title="Sports Trophies"
              text="Inter-school sports achievements"
            />
            <AchievementCard
              icon={<FaAward />}
              number="12"
              title="Awards Won"
              text="Academic and co-curricular recognition"
            />
          </motion.div>
        </div>
      </section>

      {/* PRINCIPAL MESSAGE */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
              Leadership
            </p>

            <h2 className="mb-6 text-3xl font-extrabold text-black md:text-5xl">
              Principal&apos;s Message
            </h2>

            <p className="mb-5 text-lg italic leading-8 text-gray-700">
              &quot;Education is not only about books and examinations. It is
              about discipline, confidence, character, and preparing students for
              a successful future.&quot;
            </p>

            <p className="mb-5 leading-8 text-gray-600">
              At CENNA School & College Pabbi, we focus on academic excellence,
              moral values, modern learning, and strong communication between
              school, students, parents, and teachers.
            </p>

            <p className="mb-8 leading-8 text-gray-600">
              Our vision is to provide quality education with modern digital
              tools, including online classes, recorded lectures, assignments,
              quizzes, attendance tracking, results, and parent communication.
            </p>

            <div className="border-l-4 border-yellow-500 pl-5">
              <h3 className="text-xl font-bold text-black">Principal</h3>
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600">
                CENNA School & College Pabbi
              </p>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg"
              variants={floating}
              animate="animate"
            >
              <Image
                src="/images/principal_image.jpeg"
                alt="Principal Image"
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                Quick Facts
              </p>

              <div className="grid grid-cols-2 gap-6">
                <Fact number="Nursery" label="To F.Sc" />
                <Fact number="Jitsi" label="Live Classes" />
                <Fact number="LMS" label="Learning System" />
                <Fact number="PWA" label="Mobile Ready" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DIGITAL SYSTEM */}
      <section className="bg-black px-6 py-20 text-white lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Digital Campus"
            title="School Management System"
            subtitle="A modern portal experience for students, parents, teachers, and school administration."
            dark
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SystemCard
              icon={<FaGraduationCap />}
              title="Student Portal"
              text="Attendance, results, assignments, quizzes, lectures, and fee records."
            />
            <SystemCard
              icon={<FaUsers />}
              title="Parent Portal"
              text="Track child attendance, results, fees, notifications, and meetings."
            />
            <SystemCard
              icon={<FaBookOpen />}
              title="Teacher Portal"
              text="Upload lectures, mark attendance, manage assignments, quizzes, and results."
            />
            <SystemCard
              icon={<FaShieldAlt />}
              title="Admin Portal"
              text="Manage users, fees, news, gallery, reports, and access control."
            />
          </div>
        </div>
      </section>

      {/* SCHOOL INFO BANNER */}
      <motion.section
        className="relative overflow-hidden bg-yellow-500 px-6 py-20 text-center text-black"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-6xl font-black text-black/5 md:text-9xl"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          CENNA SCHOOL
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest"
          >
            <FaClipboardList />
            School Information
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-3xl font-extrabold md:text-5xl"
          >
            Visit CENNA School & College Pabbi
          </motion.h2>

          <motion.p variants={fadeUp} className="mb-8 text-black/70">
            Students are mostly local, so registration and school information
            are handled directly through the school office.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Contact Office <FaArrowRight />
            </Link>

            <a
              href="https://wa.me/923339038030"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-black px-6 py-3 font-bold text-black transition hover:bg-black hover:text-white"
            >
              WhatsApp School
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* NEWS */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Stay Updated" title="Latest News & Events" />

          <motion.div
            className="mb-8 flex justify-end"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Link
              href="/news"
              className="flex w-fit items-center gap-2 rounded border border-black px-5 py-2 font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View All <FaArrowRight />
            </Link>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <NewsCard
              icon={<FaCalendarAlt />}
              tag="Announcement"
              title="School Office Updates"
              text="Parents and students can contact the school office for class details, fee information, and academic updates."
              date="Latest"
            />
            <NewsCard
              icon={<FaClipboardList />}
              tag="Academics"
              title="Digital Portal System"
              text="Student, parent, teacher, and admin portals are being introduced for better communication and management."
              date="Latest"
            />
            <NewsCard
              icon={<FaTrophy />}
              tag="Achievement"
              title="Academic Excellence"
              text="CENNA School & College continues to focus on strong results, discipline, and student development."
              date="Latest"
            />
          </motion.div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-gray-50 px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label="Moments" title="Photo & Video Gallery" />

          <motion.div
            className="mb-8 flex justify-end"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Link
              href="/gallery"
              className="flex w-fit items-center gap-2 rounded border border-black px-5 py-2 font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View All <FaArrowRight />
            </Link>
          </motion.div>

          <motion.div
            className="grid gap-5 md:grid-cols-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <GalleryItem icon={<FaAward />} title="Annual Function" />
            <GalleryItem icon={<FaMicroscope />} title="Science Lab" />
            <GalleryItem icon={<FaFutbol />} title="Sports Day" />
            <GalleryItem icon={<FaLaptopCode />} title="Computer Lab" />
            <GalleryItem icon={<FaVideo />} title="Video Events" />
          </motion.div>
        </div>
      </section>

      {/* JOB APPLICATION CTA */}
      <section className="bg-white px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-600">
                Careers
              </p>
              <h2 className="text-3xl font-extrabold text-black md:text-4xl">
                Job Application Form
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Interested teachers and staff can apply online. The school
                administration will review applications and contact shortlisted
                candidates.
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <Link
                href="/job-application"
                className="flex items-center gap-2 rounded bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
              >
                Apply for Job <FaBriefcase />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="bg-black px-6 py-20 text-white lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Get in Touch"
            title="Contact CENNA School"
            subtitle="Reach out through phone, email, WhatsApp, or visit the contact page for Google Maps location."
            dark
          />

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <ContactCard
              icon={<FaMapMarkerAlt />}
              title="Address"
              text={
                <>
                  Main Road, Pabbi,
                  <br />
                  Nowshera, KPK, Pakistan
                </>
              }
            />
            <ContactCard
              icon={<FaPhoneAlt />}
              title="Phone"
              text={
                <>
                  +92-923-XXXXXX
                  <br />
                  +92-3XX-XXXXXXX
                </>
              }
            />
            <ContactCard
              icon={<FaEnvelope />}
              title="Email"
              text={
                <>
                  info@cenna.edu.pk
                  <br />
                  admin@cenna.edu.pk
                </>
              }
            />
            <ContactCard
              icon={<FaWhatsapp />}
              title="WhatsApp"
              text={
                <>
                  +92-333-9038030
                  <br />
                  Available 8AM–4PM
                </>
              }
            />
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Link
              href="/contact"
              className="rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200"
            >
              Visit Contact Page
            </Link>

            <a
              href="https://wa.me/923339038030"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-white px-6 py-3 font-bold text-white transition hover:bg-white hover:text-black"
            >
              WhatsApp Now <FaWhatsapp />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label, dark = false }) {
  return (
    <motion.div variants={scaleIn} whileHover={{ y: -5 }}>
      <div className={`text-3xl font-extrabold ${dark ? "text-white" : "text-black"}`}>
        {number}
      </div>
      <div className={dark ? "text-sm text-gray-300" : "text-sm text-gray-500"}>
        {label}
      </div>
    </motion.div>
  );
}

function HeroFeature({ icon, title }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500 text-black">
        {icon}
      </div>
      <p className="font-semibold text-white">{title}</p>
    </div>
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
          className={`mx-auto max-w-2xl ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function AchievementCard({ icon, number, title, text }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md"
    >
      <motion.div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl text-yellow-600"
        whileHover={{ rotate: 8, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <div className="mb-2 text-4xl font-extrabold text-black">{number}</div>
      <h4 className="mb-2 text-lg font-bold">{title}</h4>
      <p className="text-sm text-gray-500">{text}</p>
    </motion.div>
  );
}

function Fact({ number, label }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <div className="text-2xl font-extrabold text-black">{number}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

function SystemCard({ icon, title, text }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-yellow-500/50"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500 text-2xl text-black">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="leading-7 text-gray-400">{text}</p>
    </motion.div>
  );
}

function NewsCard({ icon, tag, title, text, date }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <motion.div
        className="flex h-44 items-center justify-center bg-gray-100 text-6xl text-yellow-600"
        whileHover={{ scale: 1.04 }}
      >
        {icon}
      </motion.div>

      <div className="p-6">
        <div className="mb-3 text-sm font-semibold text-yellow-600">{tag}</div>
        <h3 className="mb-3 text-xl font-bold text-black">{title}</h3>
        <p className="mb-5 text-sm leading-6 text-gray-600">{text}</p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-400">{date}</span>
          <Link
            href="/news"
            className="flex items-center gap-2 text-sm font-bold text-black"
          >
            Read more <FaArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryItem({ icon, title }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.03 }}
      className="group flex h-48 items-center justify-center rounded-xl bg-gray-200 text-center shadow-sm transition hover:shadow-md"
    >
      <div>
        <motion.div
          className="mb-4 text-5xl text-yellow-600"
          whileHover={{ rotate: 8, scale: 1.1 }}
        >
          {icon}
        </motion.div>
        <p className="text-base font-bold text-black">{title}</p>
      </div>
    </motion.div>
  );
}

function ContactCard({ icon, title, text }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      className="rounded-xl border border-white/10 p-8 text-center transition hover:border-yellow-500/50"
    >
      <motion.div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl text-yellow-500"
        whileHover={{ rotate: 8, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <div className="mb-3 text-sm font-bold uppercase tracking-widest text-yellow-500">
        {title}
      </div>
      <div className="text-sm leading-6 text-gray-300">{text}</div>
    </motion.div>
  );
}