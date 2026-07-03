"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchSettings,
  saveSettings,
} from "@/store/settingSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminSettingsPage() {
  const dispatch = useDispatch();

  const { settings, loading } = useSelector(
    (state) => state.settings
  );

  const [logoFile, setLogoFile] = useState(null);

  const [form, setForm] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolPhone: "",
    schoolEmail: "",
    website: "",

    currentSession: "",
    passingMarks: 40,
    attendancePercentage: 75,

    lateFeeFine: 0,
    currency: "PKR",
    feeDueDay: 10,

    enableEvaluations: true,
    enableNews: true,
    enableGallery: true,
    enableOnlineClasses: true,

    schoolLogo: "",
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        schoolName: settings.schoolName || "",
        schoolAddress: settings.schoolAddress || "",
        schoolPhone: settings.schoolPhone || "",
        schoolEmail: settings.schoolEmail || "",
        website: settings.website || "",

        currentSession: settings.currentSession || "",

        passingMarks: settings.passingMarks || 40,

        attendancePercentage:
          settings.attendancePercentage || 75,

        lateFeeFine: settings.lateFeeFine || 0,

        currency: settings.currency || "PKR",

        feeDueDay: settings.feeDueDay || 10,

        enableEvaluations:
          settings.enableEvaluations ?? true,

        enableNews:
          settings.enableNews ?? true,

        enableGallery:
          settings.enableGallery ?? true,

        enableOnlineClasses:
          settings.enableOnlineClasses ?? true,

        schoolLogo: settings.schoolLogo || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (logoFile) {
        data.append("schoolLogo", logoFile);
      }

      await dispatch(saveSettings(data)).unwrap();

      toast.success(
        "Settings updated successfully"
      );

      dispatch(fetchSettings());
    } catch (error) {
      toast.error(
        error || "Failed to update settings"
      );
    }
  };

  if (loading && !settings) {
    return (
      <PageLoader text="Loading settings..." />
    );
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          School Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure school information and
          system preferences.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* SCHOOL INFO */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold">
            School Information
          </h2>

          <div className="mb-6 flex flex-col items-center">
            <div className="h-32 w-32 overflow-hidden rounded-full border bg-gray-100">
              {logoFile ? (
                <img
                  src={URL.createObjectURL(
                    logoFile
                  )}
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              ) : form.schoolLogo ? (
                <img
                  src={form.schoolLogo}
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Logo
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLogoFile(
                  e.target.files[0]
                )
              }
              className="mt-4"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="School Name"
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
            />

            <Input
              label="School Phone"
              name="schoolPhone"
              value={form.schoolPhone}
              onChange={handleChange}
            />

            <Input
              label="School Email"
              name="schoolEmail"
              value={form.schoolEmail}
              onChange={handleChange}
            />

            <Input
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                School Address
              </label>

              <textarea
                rows={3}
                name="schoolAddress"
                value={form.schoolAddress}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* ACADEMIC */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold">
            Academic Settings
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Current Session"
              name="currentSession"
              value={form.currentSession}
              onChange={handleChange}
            />

            <Input
              type="number"
              label="Passing Marks"
              name="passingMarks"
              value={form.passingMarks}
              onChange={handleChange}
            />

            <Input
              type="number"
              label="Attendance %"
              name="attendancePercentage"
              value={
                form.attendancePercentage
              }
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FEE */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold">
            Fee Settings
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="number"
              label="Late Fee Fine"
              name="lateFeeFine"
              value={form.lateFeeFine}
              onChange={handleChange}
            />

            <Input
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            />

            <Input
              type="number"
              label="Fee Due Day"
              name="feeDueDay"
              value={form.feeDueDay}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FEATURES */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold">
            Portal Features
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox
              label="Enable Evaluations"
              name="enableEvaluations"
              checked={
                form.enableEvaluations
              }
              onChange={handleChange}
            />

            <Checkbox
              label="Enable News"
              name="enableNews"
              checked={form.enableNews}
              onChange={handleChange}
            />

            <Checkbox
              label="Enable Gallery"
              name="enableGallery"
              checked={
                form.enableGallery
              }
              onChange={handleChange}
            />

            <Checkbox
              label="Enable Online Classes"
              name="enableOnlineClasses"
              checked={
                form.enableOnlineClasses
              }
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-black px-8 py-3 font-bold text-white hover:bg-gray-800 cursor-pointer transition duration-300 "
        >
          Save Settings
        </button>
      </form>
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
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
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border p-4 font-semibold">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}