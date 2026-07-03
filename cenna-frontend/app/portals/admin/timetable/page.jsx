"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchClasses } from "@/store/classSlice";
import { fetchSubjects } from "@/store/subjectSlice";
import { fetchTeachers } from "@/store/teacherSlice";

import {
  fetchTimetables,
  createTimetable,
  removeTimetable,
} from "@/store/timetableSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminTimetablePage() {
  const dispatch = useDispatch();

  const { timetables, loading } = useSelector((state) => state.timetables);

  const { classes } = useSelector((state) => state.classes);

  const { subjects } = useSelector((state) => state.subjects);

  const { teachers } = useSelector((state) => state.teachers);

  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
  });

  useEffect(() => {
    dispatch(fetchTimetables());

    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [dispatch]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createTimetable(form)).unwrap();

      toast.success("Timetable Added");

      setForm({
        classId: "",
        subjectId: "",
        teacherId: "",
        day: "Monday",
        startTime: "",
        endTime: "",
        room: "",
      });

      dispatch(fetchTimetables());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete timetable?")) return;

    try {
      await dispatch(removeTimetable(id)).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) {
    return <PageLoader text="Loading Timetable..." />;
  }

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Timetable Management</h1>

        <p className="text-gray-500">Create and manage class timetables.</p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
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

          <div>
            <label className="mb-2 block font-bold">Teacher</label>

            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">Select Teacher</option>

              {teachers?.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.user?.name || teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">Day</label>

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>
          </div>

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
            label="Room"
            name="room"
            value={form.room}
            onChange={handleChange}
          />

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 font-bold text-white"
            >
              Save Timetable
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold">Timetable Records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Day</th>
                <th className="p-4 text-left">Start</th>
                <th className="p-4 text-left">End</th>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {timetables?.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">{item.day}</td>

                  <td className="p-4">{item.startTime}</td>

                  <td className="p-4">{item.endTime}</td>

                  <td className="p-4">{item.room}</td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {timetables?.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No timetable records found.
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
      <label className="mb-2 block font-bold">{label}</label>

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
