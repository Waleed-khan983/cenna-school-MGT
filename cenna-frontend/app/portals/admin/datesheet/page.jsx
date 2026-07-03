"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchClasses } from "@/store/classSlice";
import { fetchSubjects } from "@/store/subjectSlice";

import {
  fetchDatesheets,
  createDatesheet,
  removeDatesheet,
} from "@/store/datesheetSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminDatesheetPage() {
  const dispatch = useDispatch();

  const { datesheets, loading } = useSelector(
    (state) => state.datesheets || {},
  );

  const { classes } = useSelector((state) => state.classes);

  const { subjects } = useSelector((state) => state.subjects);

  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    examDate: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  useEffect(() => {
    dispatch(fetchDatesheets());

    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classId || !form.subjectId || !form.examDate) {
      toast.error("Class, Subject and Exam Date are required");
      return;
    }

    try {
      await dispatch(createDatesheet(form)).unwrap();

      toast.success("Datesheet added successfully");

      setForm({
        classId: "",
        subjectId: "",
        examDate: "",
        startTime: "",
        endTime: "",
        room: "",
      });

      dispatch(fetchDatesheets());
    } catch (error) {
      toast.error(error || "Failed to add datesheet");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this datesheet record?")) return;

    try {
      await dispatch(removeDatesheet(id)).unwrap();
      toast.success("Datesheet deleted");
    } catch (error) {
      toast.error(error || "Failed to delete datesheet");
    }
  };

  if (loading) return <PageLoader text="Loading datesheet..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          Exam Datesheet Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage exam schedules for classes.
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-extrabold text-black">
          Add Exam Schedule
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="mb-2 block font-bold">Class</label>

            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select Class</option>

              {classes?.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.displayName || cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">Subject</label>

            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select Subject</option>

              {subjects?.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Exam Date"
            name="examDate"
            type="date"
            value={form.examDate}
            onChange={handleChange}
          />

          <Input
            label="Start Time"
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
          />

          <Input
            label="End Time"
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleChange}
          />

          <Input
            label="Room / Hall"
            name="room"
            value={form.room}
            onChange={handleChange}
          />

          <div className="flex items-end lg:col-span-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Save Datesheet
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold text-black">
            Exam Datesheet Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-center">Exam Date</th>
                <th className="p-4 text-center">Start</th>
                <th className="p-4 text-center">End</th>
                <th className="p-4 text-center">Room</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {datesheets?.length > 0 ? (
                datesheets.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">
                      {item.classId?.displayName || item.classId?.name || "N/A"}
                    </td>

                    <td className="p-4">{item.subjectId?.name || "N/A"}</td>

                    <td className="p-4 text-center">
                      {item.examDate
                        ? new Date(item.examDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4 text-center">{item.startTime}</td>

                    <td className="p-4 text-center">{item.endTime}</td>

                    <td className="p-4 text-center">{item.room || "N/A"}</td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    No datesheet records found.
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

function Input({ label, name, value, onChange, type = "text" }) {
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
