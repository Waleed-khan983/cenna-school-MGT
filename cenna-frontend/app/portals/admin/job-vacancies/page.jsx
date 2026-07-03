"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchJobVacancies,
  createJobVacancy,
  removeJobVacancy,
} from "@/store/jobVacancySlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminJobVacanciesPage() {
  const dispatch = useDispatch();

  const { vacancies, loading } = useSelector(
    (state) => state.jobVacancies
  );

  const [form, setForm] = useState({
    title: "",
    department: "",
    qualification: "",
    experience: "",
    salary: "",
    seats: 1,
    jobType: "Full-Time",
    lastDate: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchJobVacancies());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.lastDate) {
      return toast.error(
        "Job title and last date are required"
      );
    }

    try {
      await dispatch(createJobVacancy(form)).unwrap();

      toast.success(
        "Job vacancy created successfully"
      );

      setForm({
        title: "",
        department: "",
        qualification: "",
        experience: "",
        salary: "",
        seats: 1,
        jobType: "Full-Time",
        lastDate: "",
        description: "",
      });

      dispatch(fetchJobVacancies());
    } catch (error) {
      toast.error(
        error || "Failed to create vacancy"
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this vacancy?"
      )
    )
      return;

    try {
      await dispatch(removeJobVacancy(id)).unwrap();

      toast.success("Vacancy deleted");
    } catch (error) {
      toast.error(
        error || "Failed to delete vacancy"
      );
    }
  };

  if (loading)
    return (
      <PageLoader text="Loading vacancies..." />
    );

  return (
    <section className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-black">
          Job Vacancies
        </h1>

        <p className="mt-2 text-gray-500">
          Create and manage school job
          announcements.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-extrabold">
          Create New Vacancy
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <Input
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
          />

          <Input
            label="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          />

          <Input
            label="Experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          />

          <Input
            label="Salary"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />

          <Input
            label="Seats"
            name="seats"
            type="number"
            value={form.seats}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block font-bold">
              Job Type
            </label>

            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="Full-Time">
                Full-Time
              </option>
              <option value="Part-Time">
                Part-Time
              </option>
              <option value="Contract">
                Contract
              </option>
            </select>
          </div>

          <Input
            label="Last Date"
            name="lastDate"
            type="date"
            value={form.lastDate}
            onChange={handleChange}
          />

          <div className="lg:col-span-3">
            <label className="mb-2 block font-bold">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Publish Vacancy
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold">
            Published Vacancies
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">
                  Position
                </th>

                <th className="p-4 text-left">
                  Department
                </th>

                <th className="p-4 text-left">
                  Qualification
                </th>

                <th className="p-4 text-left">
                  Experience
                </th>

                <th className="p-4 text-left">
                  Salary
                </th>

                <th className="p-4 text-center">
                  Seats
                </th>

                <th className="p-4 text-center">
                  Last Date
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {vacancies?.length > 0 ? (
                vacancies.map((job) => (
                  <tr
                    key={job._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      {job.title}
                    </td>

                    <td className="p-4">
                      {job.department}
                    </td>

                    <td className="p-4">
                      {job.qualification}
                    </td>

                    <td className="p-4">
                      {job.experience}
                    </td>

                    <td className="p-4">
                      {job.salary}
                    </td>

                    <td className="p-4 text-center">
                      {job.seats}
                    </td>

                    <td className="p-4 text-center">
                      {new Date(
                        job.lastDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          handleDelete(job._id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-gray-500"
                  >
                    No vacancies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
      <label className="mb-2 block font-bold">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3"
      />
    </div>
  );
}