"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice";

import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaUserShield,
  FaUsers,
  FaChalkboardTeacher,
  FaUserTie,
  FaCalculator,
  FaDesktop,
} from "react-icons/fa";

const roles = {
  student: {
    label: "Student Login",
    shortLabel: "Student",
    icon: <FaGraduationCap />,
    desc: "Login with admission number",
  },
  parent: {
    label: "Parent Login",
    shortLabel: "Parent",
    icon: <FaUsers />,
    desc: "Login with CNIC",
  },
  teacher: {
    label: "Teacher Login",
    shortLabel: "Teacher",
    icon: <FaChalkboardTeacher />,
    desc: "Login with email",
  },
  coordinator: {
    label: "Coordinator Login",
    shortLabel: "Coordinator",
    icon: <FaUserTie />,
    desc: "Login with email",
  },
  accountant: {
    label: "Accountant Login",
    shortLabel: "Accountant",
    icon: <FaCalculator />,
    desc: "Login with email",
  },
  operator: {
    label: "Computer Operator Login",
    shortLabel: "Operator",
    icon: <FaDesktop />,
    desc: "Login with email",
  },
  admin: {
    label: "Admin Login",
    shortLabel: "Admin",
    icon: <FaUserShield />,
    desc: "Login with email",
  },
};

const loginSchema = Yup.object({
  role: Yup.string()
    .oneOf([
      "student",
      "parent",
      "teacher",
      "coordinator",
      "accountant",
      "operator",
      "admin",
    ])
    .required("Role is required."),

  loginId: Yup.string().trim().required("This field is required."),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
});

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth || {});

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

  const selectedRole = roles[role];

  const loginFieldLabel =
    role === "student" ? "Admission Number" : role === "parent" ? "CNIC" : "Email";

  const loginPlaceholder =
    role === "student"
      ? "Enter admission number"
      : role === "parent"
        ? "Enter CNIC"
        : "Enter email address";

  const inputType = role === "student" || role === "parent" ? "text" : "email";

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm({
      loginId: "",
      password: "",
    });
    setErrors({});
    toast.info(`${roles[newRole].label} selected`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await loginSchema.validate(
        {
          ...form,
          role,
        },
        { abortEarly: false }
      );

      setErrors({});

      const payload =
        role === "student"
          ? {
              role,
              admissionNo: form.loginId,
              password: form.password,
            }
          : role === "parent"
            ? {
                role,
                cnic: form.loginId,
                password: form.password,
              }
            : {
                role,
                email: form.loginId,
                password: form.password,
              };

      const result = await dispatch(login(payload)).unwrap();

      toast.success(`${selectedRole.label} successful!`);

      const userRole = result?.user?.role || role;

      router.push(`/portals/${userRole}`);
    } catch (error) {
      if (error?.inner) {
        const validationErrors = {};

        error.inner.forEach((item) => {
          if (item.path) {
            validationErrors[item.path] = item.message;
          }
        });

        setErrors(validationErrors);

        const firstError = error.inner?.[0]?.message || "Please check the form.";
        toast.error(firstError);
        return;
      }

      toast.error(error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-black px-10 py-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_50px,rgba(255,255,255,.04)_50px,rgba(255,255,255,.04)_51px)]" />

        <motion.div
          className="relative z-10 w-full max-w-sm text-center"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full border-4 border-yellow-500/40 bg-white p-4 shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={logo}
              alt="CENNA School Logo"
              width={120}
              height={120}
              priority
              className="h-full w-full rounded-full object-contain"
            />
          </motion.div>

          <h1 className="mb-2 text-2xl font-extrabold">
            CENNA School & College
          </h1>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Portal Login
          </p>

          <div className="my-8 h-px w-full bg-white/10" />

          <p className="mb-4 text-left text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
            Select Login Type
          </p>

          <div className="max-h-[420px] overflow-y-auto pr-1">
            <div className="grid gap-3">
              {Object.entries(roles).map(([key, item]) => (
                <RoleButton
                  key={key}
                  active={role === key}
                  item={item}
                  onClick={() => handleRoleChange(key)}
                  desktop
                />
              ))}
            </div>
          </div>

          <p className="mt-8 text-xs leading-6 text-gray-500">
            Student uses admission number, parent uses CNIC, and all other roles
            use email.
          </p>
        </motion.div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <motion.div
          className="w-full max-w-md overflow-hidden"
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-black"
            >
              <FaArrowLeft />
              Back
            </Link>

            <Image
              src={logo}
              alt="CENNA School Logo"
              width={48}
              height={48}
              priority
              className="rounded-full object-contain"
            />
          </div>

          <Link
            href="/"
            className="mb-8 hidden items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-black lg:inline-flex"
          >
            <FaArrowLeft />
            Back to Website
          </Link>

          <div className="mb-6 lg:hidden">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
              Select Login Type
            </h3>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(roles).map(([key, item]) => (
                <RoleButton
                  key={key}
                  active={role === key}
                  item={item}
                  onClick={() => handleRoleChange(key)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            <span className="text-yellow-600">{selectedRole.icon}</span>
            <span className="truncate">{selectedRole.label}</span>
          </div>

          <h2 className="mb-2 text-2xl font-extrabold text-black sm:text-3xl">
            Welcome Back
          </h2>

          <p className="mb-8 text-sm text-gray-500">
            Login to continue to your school portal.
          </p>

          <form onSubmit={handleLogin} noValidate>
            <Input
              label={`${loginFieldLabel} *`}
              name="loginId"
              type={inputType}
              value={form.loginId}
              onChange={handleChange}
              placeholder={loginPlaceholder}
              error={errors.loginId}
            />

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Password *
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`${inputClass} pr-12 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-black"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && <ErrorText text={errors.password} />}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {loading ? "Logging in..." : "Login"} <FaArrowRight />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Need login access? Contact the school administration.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function RoleButton({ active, item, onClick, desktop = false }) {
  if (desktop) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border px-5 py-4 text-left transition ${
          active
            ? "border-yellow-500 bg-yellow-500/10 text-white"
            : "border-white/10 text-gray-400 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-white"
        }`}
      >
        <span className="text-xl text-yellow-500">{item.icon}</span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{item.label}</span>
          <span className="block truncate text-xs text-gray-500">
            {item.desc}
          </span>
        </span>

        <FaArrowRight
          className={`shrink-0 text-yellow-500 transition ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-center transition ${
        active ? "border-yellow-500 bg-yellow-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="mb-2 flex justify-center text-xl text-yellow-600">
        {item.icon}
      </div>

      <p className="truncate text-xs font-bold">{item.shortLabel}</p>
    </button>
  );
}

function Input({ label, name, value, onChange, error, type = "text", placeholder }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} ${error ? "border-red-500" : ""}`}
      />

      {error && <ErrorText text={error} />}
    </div>
  );
}

function ErrorText({ text }) {
  return <p className="mt-2 text-sm font-semibold text-red-500">{text}</p>;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black";