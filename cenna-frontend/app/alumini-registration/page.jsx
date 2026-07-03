"use client";

import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerAlumniApi } from "@/services/alumniService";

const initialForm = {
  fullName: "",
  fatherName: "",
  admissionNo: "",
  batch: "",
  passingYear: "",
  email: "",
  phone: "",
  cnic: "",
  profession: "",
  organization: "",
  designation: "",
  address: "",
  city: "",
  country: "",
  linkedIn: "",
};

const alumniSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .required("Full name is required."),

  fatherName: Yup.string()
    .trim()
    .min(3, "Father name must be at least 3 characters.")
    .required("Father name is required."),

  admissionNo: Yup.string().trim().required("Admission number is required."),

  batch: Yup.string().trim().required("Batch is required."),

  passingYear: Yup.number()
    .typeError("Passing year must be a number.")
    .min(1950, "Passing year is too old.")
    .max(new Date().getFullYear(), "Passing year cannot be in the future.")
    .required("Passing year is required."),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address.")
    .required("Email is required."),

  phone: Yup.string().trim().required("Phone number is required."),

  cnic: Yup.string().trim().required("CNIC is required."),

  profession: Yup.string().trim().required("Profession is required."),

  organization: Yup.string().trim().required("Organization is required."),

  designation: Yup.string().trim().required("Designation is required."),

  city: Yup.string().trim().required("City is required."),

  country: Yup.string().trim().required("Country is required."),

  address: Yup.string().trim().required("Address is required."),

  linkedIn: Yup.string()
    .trim()
    .url("LinkedIn must be a valid URL.")
    .notRequired()
    .nullable(),
});

export default function AlumniRegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await alumniSchema.validate(form, {
        abortEarly: false,
      });

      setErrors({});

      const payload = {
        fullName: form.fullName,
        fatherName: form.fatherName,
        admissionNo: form.admissionNo,
        batch: form.batch,
        passingYear: Number(form.passingYear),
        email: form.email,
        phone: form.phone,
        cnic: form.cnic,
        profession: form.profession,
        organization: form.organization,
        designation: form.designation,
        address: form.address,
        city: form.city,
        country: form.country,
        linkedIn: form.linkedIn,
      };

      const response = await registerAlumniApi(payload);

      if (response.success) {
        toast.success(
          response.message || "Alumni registration submitted successfully!",
        );

        setForm(initialForm);
      }
    } catch (error) {
      const validationErrors = {};

      // Yup Validation Errors
      if (error.inner) {
        error.inner.forEach((item) => {
          if (item.path) {
            validationErrors[item.path] = item.message;
          }
        });

        setErrors(validationErrors);

        toast.error(error.inner?.[0]?.message || "Please check the form.");

        return;
      }

      // API Errors
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit alumni registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg md:p-10">
        <h1 className="mb-3 text-center text-4xl font-extrabold text-black">
          Alumni Registration Form
        </h1>

        <p className="mb-10 text-center text-gray-500">
          Join the CENNA School & College Alumni Network
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 md:grid-cols-2"
        >
          <Input
            label="Full Name *"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Father Name *"
            name="fatherName"
            value={form.fatherName}
            onChange={handleChange}
            error={errors.fatherName}
          />

          <Input
            label="Admission No *"
            name="admissionNo"
            value={form.admissionNo}
            onChange={handleChange}
            error={errors.admissionNo}
          />

          <Input
            label="Batch *"
            name="batch"
            value={form.batch}
            onChange={handleChange}
            placeholder="2019"
            error={errors.batch}
          />

          <Input
            label="Passing Year *"
            name="passingYear"
            value={form.passingYear}
            onChange={handleChange}
            placeholder="2023"
            error={errors.passingYear}
          />

          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Phone Number *"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="03XX-XXXXXXX"
            error={errors.phone}
          />

          <Input
            label="CNIC *"
            name="cnic"
            value={form.cnic}
            onChange={handleChange}
            placeholder="12345-1234567-1"
            error={errors.cnic}
          />

          <Input
            label="Profession *"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            placeholder="Engineer"
            error={errors.profession}
          />

          <Input
            label="Organization *"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Company Name"
            error={errors.organization}
          />

          <Input
            label="Designation *"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Software Engineer"
            error={errors.designation}
          />

          <Input
            label="City *"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
          />

          <Input
            label="Country *"
            name="country"
            value={form.country}
            onChange={handleChange}
            error={errors.country}
          />

          <Input
            label="LinkedIn Profile"
            name="linkedIn"
            value={form.linkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            error={errors.linkedIn}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Address *
            </label>

            <textarea
              rows={4}
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 outline-none ${
                errors.address
                  ? "border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
              placeholder="Current Address"
            />

            {errors.address && <ErrorText text={errors.address} />}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-4 font-bold text-white transition cursor-pointer hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {loading ? "Submitting..." : "Register as Alumni"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label.replace("*", "")}
        className={`w-full rounded-xl border px-4 py-3 outline-none ${
          error ? "border-red-500" : "border-gray-300 focus:border-black"
        }`}
      />

      {error && <ErrorText text={error} />}
    </div>
  );
}

function ErrorText({ text }) {
  return <p className="mt-2 text-sm font-semibold text-red-500">{text}</p>;
}
