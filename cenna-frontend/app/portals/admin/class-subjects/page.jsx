"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchClassSubjects,
  addClassSubject,
  removeClassSubject,
} from "@/store/classSubjectSlice";

import { fetchClasses } from "@/store/classSlice";
import { fetchSubjects } from "@/store/subjectSlice";
import { fetchTeachers } from "@/store/teacherSlice";

const initialForm = {
  classId: "",
  subjectId: "",
  teacherId: "",
};

export default function ClassSubjectPage() {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    assignments = [],
    loading: assignmentLoading,
    error: assignmentError,
  } = useSelector((state) => state.classSubjects || {});

  const { classes = [] } = useSelector((state) => state.classes || {});
  const { subjects = [] } = useSelector((state) => state.subjects || {});
  const { teachers = [] } = useSelector((state) => state.teachers || {});

  useEffect(() => {
    dispatch(fetchClassSubjects());
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredAssignments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return assignments;

    return assignments.filter((item) => {
      const className =
        item.class?.displayName?.toLowerCase() ||
        `${item.class?.name || ""} ${item.class?.section || ""}`.toLowerCase();

      const subjectName = item.subject?.name?.toLowerCase() || "";
      const subjectCode = item.subject?.code?.toLowerCase() || "";
      const teacherName = item.teacher?.user?.name?.toLowerCase() || "";

      return (
        className.includes(value) ||
        subjectName.includes(value) ||
        subjectCode.includes(value) ||
        teacherName.includes(value)
      );
    });
  }, [assignments, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!form.classId) {
      toast.error("Please select class");
      return;
    }

    if (!form.subjectId) {
      toast.error("Please select subject");
      return;
    }

    if (!form.teacherId) {
      toast.error("Please select teacher");
      return;
    }

    const alreadyExists = assignments.some((item) => {
      const itemClassId = item.class?._id || item.class;
      const itemSubjectId = item.subject?._id || item.subject;

      return (
        String(itemClassId) === String(form.classId) &&
        String(itemSubjectId) === String(form.subjectId)
      );
    });

    if (alreadyExists) {
      toast.error("This subject is already assigned to this class");
      return;
    }

    try {
      setSubmitting(true);

      await dispatch(addClassSubject(form)).unwrap();

      toast.success("Class subject assignment added successfully");

      setForm(initialForm);

      dispatch(fetchClassSubjects());
    } catch (error) {
      toast.error(error || "Failed to add assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHandler = async (item) => {
    const className =
      item.class?.displayName ||
      `${item.class?.name || ""} - ${item.class?.section || ""}`;

    const subjectName = item.subject?.name || "subject";

    const confirmDelete = window.confirm(
      `Remove ${subjectName} from ${className}?`
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeClassSubject(item._id)).unwrap();

      toast.success("Assignment deleted successfully");

      dispatch(fetchClassSubjects());
    } catch (error) {
      toast.error(error || "Failed to delete assignment");
    }
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Class Subject Assignment
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Assign one teacher to teach one subject in one class.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search class, subject, teacher..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black lg:w-96"
        />
      </div>

      {assignmentError && (
        <div className="rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {assignmentError}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="rounded-3xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Class"
            name="classId"
            value={form.classId}
            onChange={handleChange}
          >
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.displayName || `${cls.name} - ${cls.section}`}
              </option>
            ))}
          </Select>

          <Select
            label="Subject"
            name="subjectId"
            value={form.subjectId}
            onChange={handleChange}
          >
            <option value="">Select Subject</option>

            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
                {subject.code ? ` (${subject.code})` : ""}
              </option>
            ))}
          </Select>

          <Select
            label="Teacher"
            name="teacherId"
            value={form.teacherId}
            onChange={handleChange}
          >
            <option value="">Select Teacher</option>

            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.user?.name || "Unnamed Teacher"}
              </option>
            ))}
          </Select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Assigning..." : "Assign"}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Assignments" value={assignments.length} />
        <Card
          title="Classes"
          value={new Set(assignments.map((item) => item.class?._id)).size}
        />
        <Card
          title="Subjects"
          value={new Set(assignments.map((item) => item.subject?._id)).size}
        />
        <Card
          title="Teachers"
          value={new Set(assignments.map((item) => item.teacher?._id)).size}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-extrabold text-black">
            Assignment Records
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-center">#</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Teacher</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {assignmentLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    Loading assignments...
                  </td>
                </tr>
              ) : filteredAssignments.length > 0 ? (
                filteredAssignments.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-center font-bold">{index + 1}</td>

                    <td className="p-4 font-semibold text-black">
                      {item.class?.displayName ||
                        `${item.class?.name || ""} - ${item.class?.section || ""
                        }`}
                    </td>

                    <td className="p-4">
                      {item.subject?.name || "N/A"}
                      {item.subject?.code ? (
                        <span className="ml-2 text-xs font-bold text-gray-400">
                          {item.subject.code}
                        </span>
                      ) : null}
                    </td>

                    <td className="p-4">
                      {item.teacher?.user?.name || "N/A"}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => deleteHandler(item)}
                        className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center font-semibold text-gray-500"
                  >
                    No assignments found.
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

function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-black">{value || 0}</h2>
    </div>
  );
}