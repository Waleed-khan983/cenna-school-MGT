// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import logo from "@/public/images/logo.jpg";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import * as Yup from "yup";

// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaCheckCircle,
//   FaEye,
//   FaEyeSlash,
//   FaGraduationCap,
//   FaUsers,
// } from "react-icons/fa";

// const roles = {
//   student: {
//     label: "Student Registration",
//     icon: <FaGraduationCap />,
//     userLabel: "Student Name",
//     desc: "Create a student account request",
//   },
//   parent: {
//     label: "Parent Registration",
//     icon: <FaUsers />,
//     userLabel: "Parent / Guardian Name",
//     desc: "Create a parent account request",
//   },
// };

// const registerSchema = Yup.object({
//   role: Yup.string()
//     .oneOf(["student", "parent"])
//     .required("Account type is required."),

//   fullName: Yup.string()
//     .trim()
//     .min(3, "Full name must be at least 3 characters.")
//     .required("Full name is required."),

//   phone: Yup.string()
//     .trim()
//     .matches(
//       /^03\d{2}-?\d{7}$/,
//       "Phone must be a valid Pakistani number like 03XX-XXXXXXX."
//     )
//     .required("Phone number is required."),

//   email: Yup.string()
//     .trim()
//     .email("Please enter a valid email address.")
//     .notRequired(),

//   username: Yup.string()
//     .trim()
//     .min(3, "Username must be at least 3 characters.")
//     .required("Username is required."),

//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters.")
//     .required("Password is required."),

//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords do not match.")
//     .required("Confirm password is required."),

//   className: Yup.string().when("role", {
//     is: "student",
//     then: (schema) => schema.required("Please select student class."),
//     otherwise: (schema) => schema.notRequired(),
//   }),

//   childName: Yup.string().when("role", {
//     is: "parent",
//     then: (schema) =>
//       schema
//         .trim()
//         .min(3, "Child name must be at least 3 characters.")
//         .required("Child name is required."),
//     otherwise: (schema) => schema.notRequired(),
//   }),
// });

// export default function RegisterForm() {
//   const [role, setRole] = useState("student");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     className: "",
//     childName: "",
//   });

//   const selectedRole = roles[role];

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);

//     setForm({
//       fullName: "",
//       email: "",
//       phone: "",
//       username: "",
//       password: "",
//       confirmPassword: "",
//       className: "",
//       childName: "",
//     });

//     setErrors({});
//     toast.info(`${roles[newRole].label} selected`);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const handleRegister = async (event) => {
//     event.preventDefault();

//     try {
//       await registerSchema.validate(
//         {
//           ...form,
//           role,
//         },
//         { abortEarly: false }
//       );

//       setErrors({});
//       toast.success("Registration request submitted successfully!");

//       setForm({
//         fullName: "",
//         email: "",
//         phone: "",
//         username: "",
//         password: "",
//         confirmPassword: "",
//         className: "",
//         childName: "",
//       });
//     } catch (error) {
//       const validationErrors = {};

//       if (error.inner) {
//         error.inner.forEach((item) => {
//           if (item.path) {
//             validationErrors[item.path] = item.message;
//           }
//         });
//       }

//       setErrors(validationErrors);

//       const firstError = error.inner?.[0]?.message || "Please check the form.";
//       toast.error(firstError);
//     }
//   };

//   return (
//     <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
//       <section className="relative hidden overflow-hidden bg-black px-10 py-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
//         <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_50px,rgba(255,255,255,.04)_50px,rgba(255,255,255,.04)_51px)]" />

//         <motion.div
//           className="relative z-10 w-full max-w-sm text-center"
//           initial={{ opacity: 0, x: -35 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <motion.div
//             className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full border-4 border-yellow-500/40 bg-white p-4 shadow-lg"
//             animate={{ y: [0, -8, 0] }}
//             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//           >
//             <Image
//               src={logo}
//               alt="CENNA School Logo"
//               width={120}
//               height={120}
//               priority
//               className="h-full w-full rounded-full object-contain"
//             />
//           </motion.div>

//           <h1 className="mb-2 text-2xl font-extrabold">
//             CENNA School & College
//           </h1>

//           <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
//             Account Registration
//           </p>

//           <div className="my-8 h-px w-full bg-white/10" />

//           <p className="mb-4 text-left text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
//             Select Account Type
//           </p>

//           <div className="flex flex-col gap-3">
//             {Object.entries(roles).map(([key, item]) => (
//               <button
//                 key={key}
//                 type="button"
//                 onClick={() => handleRoleChange(key)}
//                 className={`flex cursor-pointer items-center gap-4 rounded-lg border px-5 py-4 text-left transition ${
//                   role === key
//                     ? "border-yellow-500 bg-yellow-500/10 text-white"
//                     : "border-white/10 text-gray-400 hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-white"
//                 }`}
//               >
//                 <span className="text-xl text-yellow-500">{item.icon}</span>

//                 <span className="flex-1">
//                   <span className="block text-sm font-bold">{item.label}</span>
//                   <span className="text-xs text-gray-500">{item.desc}</span>
//                 </span>

//                 <FaArrowRight
//                   className={`text-yellow-500 transition ${
//                     role === key ? "opacity-100" : "opacity-0"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>

//           <p className="mt-8 text-xs leading-6 text-gray-500">
//             Admin and teacher accounts should be created by the school
//             administration.
//           </p>
//         </motion.div>
//       </section>

//       <section className="flex items-center justify-center px-6 py-12 lg:px-12">
//         <motion.div
//           className="w-full max-w-md"
//           initial={{ opacity: 0, x: 35 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <Link
//             href="/"
//             className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-black"
//           >
//             <FaArrowLeft />
//             Back to Website
//           </Link>

//           <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
//             <span className="text-yellow-600">{selectedRole.icon}</span>
//             {selectedRole.label}
//           </div>

//           <h2 className="mb-2 text-3xl font-extrabold text-black">
//             Create Account
//           </h2>

//           <p className="mb-8 text-sm text-gray-500">
//             Submit your account request. School admin will review and approve it.
//           </p>

//           <form onSubmit={handleRegister} noValidate>
//             <div className="mb-5">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 {selectedRole.userLabel} *
//               </label>

//               <input
//                 type="text"
//                 name="fullName"
//                 value={form.fullName}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className={`${inputClass} ${
//                   errors.fullName ? "border-red-500" : ""
//                 }`}
//               />

//               {errors.fullName && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.fullName}
//                 </p>
//               )}
//             </div>

//             {role === "student" && (
//               <div className="mb-5">
//                 <label className="mb-2 block text-sm font-bold text-gray-700">
//                   Class Applying / Current Class *
//                 </label>

//                 <select
//                   name="className"
//                   value={form.className}
//                   onChange={handleChange}
//                   className={`${inputClass} ${
//                     errors.className ? "border-red-500" : ""
//                   }`}
//                 >
//                   <option value="">Select Class</option>
//                   <option>Nursery</option>
//                   <option>KG</option>
//                   <option>Grade 1</option>
//                   <option>Grade 2</option>
//                   <option>Grade 3</option>
//                   <option>Grade 4</option>
//                   <option>Grade 5</option>
//                   <option>Grade 6</option>
//                   <option>Grade 7</option>
//                   <option>Grade 8</option>
//                   <option>Grade 9</option>
//                   <option>Grade 10</option>
//                   <option>F.Sc Part 1</option>
//                   <option>F.Sc Part 2</option>
//                 </select>

//                 {errors.className && (
//                   <p className="mt-2 text-sm font-semibold text-red-500">
//                     {errors.className}
//                   </p>
//                 )}
//               </div>
//             )}

//             {role === "parent" && (
//               <div className="mb-5">
//                 <label className="mb-2 block text-sm font-bold text-gray-700">
//                   Child Name *
//                 </label>

//                 <input
//                   type="text"
//                   name="childName"
//                   value={form.childName}
//                   onChange={handleChange}
//                   placeholder="Student / Child Name"
//                   className={`${inputClass} ${
//                     errors.childName ? "border-red-500" : ""
//                   }`}
//                 />

//                 {errors.childName && (
//                   <p className="mt-2 text-sm font-semibold text-red-500">
//                     {errors.childName}
//                   </p>
//                 )}
//               </div>
//             )}

//             <div className="mb-5">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 Phone / WhatsApp *
//               </label>

//               <input
//                 type="tel"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="03XX-XXXXXXX"
//                 className={`${inputClass} ${
//                   errors.phone ? "border-red-500" : ""
//                 }`}
//               />

//               {errors.phone && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.phone}
//                 </p>
//               )}
//             </div>

//             <div className="mb-5">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="your@email.com"
//                 className={`${inputClass} ${
//                   errors.email ? "border-red-500" : ""
//                 }`}
//               />

//               {errors.email && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             <div className="mb-5">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 Username *
//               </label>

//               <input
//                 type="text"
//                 name="username"
//                 value={form.username}
//                 onChange={handleChange}
//                 placeholder="Choose username"
//                 className={`${inputClass} ${
//                   errors.username ? "border-red-500" : ""
//                 }`}
//               />

//               {errors.username && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.username}
//                 </p>
//               )}
//             </div>

//             <div className="mb-5">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 Password *
//               </label>

//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Create password"
//                   className={`${inputClass} pr-12 ${
//                     errors.password ? "border-red-500" : ""
//                   }`}
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-black"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               {errors.password && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             <div className="mb-6">
//               <label className="mb-2 block text-sm font-bold text-gray-700">
//                 Confirm Password *
//               </label>

//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm password"
//                 className={`${inputClass} ${
//                   errors.confirmPassword ? "border-red-500" : ""
//                 }`}
//               />

//               {errors.confirmPassword && (
//                 <p className="mt-2 text-sm font-semibold text-red-500">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800"
//             >
//               Submit Request <FaCheckCircle />
//             </button>
//           </form>

//           <p className="mt-8 text-center text-sm text-gray-500">
//             Already have an account?{" "}
//             <Link href="/login" className="font-bold text-black">
//               Login here
//             </Link>
//           </p>
//         </motion.div>
//       </section>
//     </main>
//   );
// }

// const inputClass =
//   "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black";