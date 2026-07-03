"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/store/authSlice";
import api from "@/services/api";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaUsers,
  FaChalkboardTeacher,
  FaUserShield,
  FaUserTie,
  FaCalculator,
  FaDesktop,
} from "react-icons/fa";

const roles = {
  student: {
    label: "Student Registration",
    shortLabel: "Student",
    icon: <FaGraduationCap />,
    desc: "Create student account",
  },
  parent: {
    label: "Parent Registration",
    shortLabel: "Parent",
    icon: <FaUsers />,
    desc: "Create parent account",
  },
  teacher: {
    label: "Teacher Registration",
    shortLabel: "Teacher",
    icon: <FaChalkboardTeacher />,
    desc: "Create teacher account",
  },
  coordinator: {
    label: "Coordinator Registration",
    shortLabel: "Coordinator",
    icon: <FaUserTie />,
    desc: "Create coordinator account",
  },
  accountant: {
    label: "Accountant Registration",
    shortLabel: "Accountant",
    icon: <FaCalculator />,
    desc: "Create accountant account",
  },
  operator: {
    label: "Computer Operator Registration",
    shortLabel: "Operator",
    icon: <FaDesktop />,
    desc: "Create operator account",
  },
  admin: {
    label: "Admin Registration",
    shortLabel: "Admin",
    icon: <FaUserShield />,
    desc: "Create admin account",
  },
};

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  admissionNo: "",
  rollNumber: "",
  fatherName: "",
  classId: "",
  section: "",

  cnic: "",
  studentAdmissionNo: "",

  qualification: "",
  designation: "",
  department: "",
  salary: "",

  address: "",
  gender: "",
};

const registerSchema = Yup.object({
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

  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .required("Full name is required."),

  phone: Yup.string().trim().required("Phone number is required."),

  email: Yup.string().when("role", {
    is: (role) => role !== "student" && role !== "parent",
    then: (schema) =>
      schema
        .trim()
        .email("Please enter a valid email address.")
        .required("Email is required."),
    otherwise: (schema) =>
      schema.trim().email("Please enter a valid email address.").notRequired(),
  }),

  admissionNo: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.trim().required("Admission number is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  rollNumber: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.trim().required("Roll  number is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  fatherName: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.trim().required("Father name is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  gender: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.required("Gender is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  classId: Yup.string().when("role", {
    is: "student",
    then: (schema) => schema.required("Please select student class."),
    otherwise: (schema) => schema.notRequired(),
  }),

  cnic: Yup.string().when("role", {
    is: (role) =>
      ["parent", "teacher", "coordinator", "accountant", "operator"].includes(
        role
      ),
    then: (schema) => schema.trim().required("CNIC is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  studentAdmissionNo: Yup.string().when("role", {
    is: "parent",
    then: (schema) =>
      schema.trim().required("Student admission number is required."),
    otherwise: (schema) => schema.notRequired(),
  }),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm password is required."),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth || {});

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(false);

  const selectedRole = roles[role];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setClassLoading(true);

        const res = await api.get("/classes");

        const list =
          res.data?.classes ||
          res.data?.data ||
          res.data?.items ||
          res.data ||
          [];

        setClasses(Array.isArray(list) ? list : []);
      } catch (error) {
        console.log("Failed to load classes:", error);
        toast.error("Failed to load classes.");
      } finally {
        setClassLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm(initialForm);
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

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await registerSchema.validate(
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
            name: form.fullName,
            admissionNo: form.admissionNo,
            rollNumber: form.rollNumber,
            fatherName: form.fatherName,
            gender: form.gender,
            classId: form.classId,
            section: form.section,
            phone: form.phone,
            password: form.password,
            address: form.address,
            rollNumber: form.rollNumber
          }
          : role === "parent"
            ? {
              role,
              name: form.fullName,
              cnic: form.cnic,
              studentAdmissionNo: form.studentAdmissionNo,
              phone: form.phone,
              password: form.password,
              address: form.address,
            }
            : {
              role,
              name: form.fullName,
              email: form.email,
              phone: form.phone,
              cnic: form.cnic,
              qualification: form.qualification,
              designation: form.designation,
              department: form.department,
              salary: form.salary,
              password: form.password,
              address: form.address,
            };

      await dispatch(register(payload)).unwrap();

      toast.success(`${selectedRole.label} created successfully!`);
      setForm(initialForm);
    } catch (error) {
      if (error?.inner) {
        const validationErrors = {};

        error.inner.forEach((item) => {
          if (item.path) {
            validationErrors[item.path] = item.message;
          }
        });

        setErrors(validationErrors);

        const firstError =
          error.inner?.[0]?.message || "Please check the form.";
        toast.error(firstError);
        return;
      }

      toast.error(error || "Registration failed.");
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
            Account Registration
          </p>

          <div className="my-8 h-px w-full bg-white/10" />

          <p className="mb-4 text-left text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
            Select Account Type
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
              Select Role
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
            Create Account
          </h2>

          <p className="mb-8 text-sm text-gray-500">
            Create account for selected school portal role.
          </p>

          <form onSubmit={handleRegister} noValidate>
            <Input
              label="Full Name *"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            {role !== "student" && role !== "parent" && (
              <Input
                label="Email *"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            )}

            {role === "student" && (
              <>
                <Input
                  label="Admission Number *"
                  name="admissionNo"
                  value={form.admissionNo}
                  onChange={handleChange}
                  error={errors.admissionNo}
                />

                <Input
                  label="Roll Number *"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  error={errors.rollNumber}
                />


                <Input
                  label="Father Name *"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  error={errors.fatherName}
                />

                <Select
                  label="Gender *"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />

                <Select
                  label="Class *"
                  name="classId"
                  value={form.classId}
                  onChange={handleChange}
                  error={errors.classId}
                  options={[
                    {
                      value: "",
                      label: classLoading ? "Loading classes..." : "Select Class",
                    },
                    ...classes.map((cls) => ({
                      value: cls._id,
                      label:
                        cls.displayName ||
                        `${cls.name} - ${cls.section || ""}`,
                    })),
                  ]}
                />

                <Input
                  label="Section"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                />

              </>
            )}

            {role === "parent" && (
              <>
                <Input
                  label="CNIC *"
                  name="cnic"
                  value={form.cnic}
                  onChange={handleChange}
                  error={errors.cnic}
                />

                <Input
                  label="Student Admission Number *"
                  name="studentAdmissionNo"
                  value={form.studentAdmissionNo}
                  onChange={handleChange}
                  error={errors.studentAdmissionNo}
                />
              </>
            )}

            {["teacher", "coordinator", "accountant", "operator"].includes(
              role
            ) && (
                <>
                  <Input
                    label="CNIC *"
                    name="cnic"
                    value={form.cnic}
                    onChange={handleChange}
                    error={errors.cnic}
                  />

                  <Input
                    label="Qualification"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                  />

                  <Input
                    label="Designation"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                  />

                  <Input
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  />

                  <Input
                    label="Salary"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                  />
                </>
              )}

            <Input
              label="Phone / WhatsApp *"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Password *
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className={`${inputClass} pr-12 ${errors.password ? "border-red-500" : ""
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

            <Input
              label="Confirm Password *"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <FaCheckCircle />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-black">
              Login here
            </Link>
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
        className={`flex cursor-pointer items-center gap-4 rounded-lg border px-5 py-4 text-left transition ${active
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
          className={`shrink-0 text-yellow-500 transition ${active ? "opacity-100" : "opacity-0"
            }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-center transition ${active ? "border-yellow-500 bg-yellow-50" : "border-gray-200 bg-white"
        }`}
    >
      <div className="mb-2 flex justify-center text-xl text-yellow-600">
        {item.icon}
      </div>

      <p className="truncate text-xs font-bold">{item.shortLabel}</p>
    </button>
  );
}

function Input({ label, name, value, onChange, error, type = "text" }) {
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
        placeholder={label.replace("*", "")}
        className={`${inputClass} ${error ? "border-red-500" : ""}`}
      />

      {error && <ErrorText text={error} />}
    </div>
  );
}

function Select({ label, name, value, onChange, error, options }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} ${error ? "border-red-500" : ""}`}
      >
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <ErrorText text={error} />}
    </div>
  );
}

function ErrorText({ text }) {
  return <p className="mt-2 text-sm font-semibold text-red-500">{text}</p>;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black";