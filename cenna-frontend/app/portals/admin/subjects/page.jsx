"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchSubjects,
  addSubject,
  editSubject,
  removeSubject,
} from "@/store/subjectSlice";

import PageLoader from "@/components/ui/PageLoader";

const initialForm = {
  name: "",
  code: "",
  maxMarks: 100,
  passMark: 40,
  isElective: false,
};

export default function AdminSubjectsPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(initialForm);

  const {
    subjects = [],
    loading,
    error,
  } = useSelector((state) => state.subjects || {});

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const filteredSubjects = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return subjects;

    return subjects.filter((subject) => {
      const name = subject.name?.toLowerCase() || "";
      const code = subject.code?.toLowerCase() || "";

      return name.includes(value) || code.includes(value);
    });
  }, [subjects, search]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreate = () => {
    setForm(initialForm);
    setShowCreate(true);
    setEditMode(false);
    setSelectedSubject(null);
  };

  const openEdit = (subject) => {
    setSelectedSubject(subject);
    setEditMode(true);
    setShowCreate(false);

    setForm({
      name: subject.name || "",
      code: subject.code || "",
      maxMarks: subject.maxMarks || 100,
      passMark: subject.passMark || 40,
      isElective: subject.isElective || false,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await dispatch(addSubject(form)).unwrap();
      toast.success("Subject created successfully");
      setShowCreate(false);
      setForm(initialForm);
    } catch (error) {
      toast.error(error || "Failed to create subject");
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        editSubject({
          id: selectedSubject._id,
          data: form,
        }),
      ).unwrap();

      toast.success("Subject updated successfully");
      setSelectedSubject(null);
      setEditMode(false);
      setForm(initialForm);
    } catch (error) {
      toast.error(error || "Failed to update subject");
    }
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`Delete ${subject.name}?`)) return;

    try {
      await dispatch(removeSubject(subject._id)).unwrap();
      toast.success("Subject deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete subject");
    }
  };

  if (loading) return <PageLoader text="Loading subjects..." />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Subjects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subject names, codes, marks, and elective status.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or code..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black md:w-96"
          />

          <button
            type="button"
            onClick={openCreate}
            className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Add Subject
          </button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-4 text-center">#</th>
              <th className="px-4 py-4 text-left">Subject</th>
              <th className="px-4 py-4 text-left">Code</th>
              <th className="px-4 py-4 text-center">Max Marks</th>
              <th className="px-4 py-4 text-center">Pass Mark</th>
              <th className="px-4 py-4 text-center">Type</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => (
                <tr key={subject._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-center font-bold">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {subject.name || "N/A"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {subject.code || "N/A"}
                  </td>

                  <td className="px-4 py-4 text-center font-bold">
                    {subject.maxMarks || 0}
                  </td>

                  <td className="px-4 py-4 text-center font-bold">
                    {subject.passMark || 0}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                      {subject.isElective ? "Elective" : "Compulsory"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <Actions
                      onView={() => {
                        setSelectedSubject(subject);
                        setEditMode(false);
                        setShowCreate(false);
                      }}
                      onEdit={() => openEdit(subject)}
                      onDelete={() => handleDelete(subject)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center font-semibold text-gray-500"
                >
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div
              key={subject._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-black">
                {subject.name || "N/A"}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                <b>Code:</b> {subject.code || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                <b>Marks:</b> {subject.passMark || 0}/{subject.maxMarks || 0}
              </p>

              <p className="text-sm text-gray-600">
                <b>Type:</b> {subject.isElective ? "Elective" : "Compulsory"}
              </p>

              <div className="mt-4">
                <Actions
                  mobile
                  onView={() => {
                    setSelectedSubject(subject);
                    setEditMode(false);
                    setShowCreate(false);
                  }}
                  onEdit={() => openEdit(subject)}
                  onDelete={() => handleDelete(subject)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-gray-500 shadow-sm">
            No subjects found.
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Subject" onClose={() => setShowCreate(false)}>
          <SubjectForm
            form={form}
            onChange={handleChange}
            onSubmit={handleCreate}
            buttonText="Create Subject"
          />
        </Modal>
      )}

      {selectedSubject && !editMode && (
        <Modal title="Subject Details" onClose={() => setSelectedSubject(null)}>
          <Info label="Subject" value={selectedSubject.name} />
          <Info label="Code" value={selectedSubject.code} />
          <Info label="Max Marks" value={selectedSubject.maxMarks} />
          <Info label="Pass Mark" value={selectedSubject.passMark} />
          <Info
            label="Type"
            value={selectedSubject.isElective ? "Elective" : "Compulsory"}
          />

          <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
            Class and teacher assignment is handled from Admin → Class Subjects
            page.
          </div>
        </Modal>
      )}

      {selectedSubject && editMode && (
        <Modal title="Edit Subject" onClose={() => setSelectedSubject(null)}>
          <SubjectForm
            form={form}
            onChange={handleChange}
            onSubmit={handleEdit}
            buttonText="Update Subject"
          />
        </Modal>
      )}
    </section>
  );
}

function SubjectForm({ form, onChange, onSubmit, buttonText }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Subject Name"
        name="name"
        value={form.name}
        onChange={onChange}
      />

      <Input
        label="Subject Code"
        name="code"
        value={form.code}
        onChange={onChange}
      />

      <Input
        label="Max Marks"
        name="maxMarks"
        type="number"
        value={form.maxMarks}
        onChange={onChange}
      />

      <Input
        label="Pass Mark"
        name="passMark"
        type="number"
        value={form.passMark}
        onChange={onChange}
      />

      <label className="flex items-center gap-3 rounded-xl border p-4 text-sm font-bold text-gray-700">
        <input
          type="checkbox"
          name="isElective"
          checked={form.isElective}
          onChange={onChange}
        />
        Elective Subject
      </label>

      <button
        type="submit"
        className="cursor-pointer w-full rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800"
      >
        {buttonText}
      </button>
    </form>
  );
}

function Actions({ onView, onEdit, onDelete, mobile = false }) {
  return (
    <div className={`flex gap-2 ${mobile ? "" : "justify-center"}`}>
      <button
        type="button"
        onClick={onView}
        className="cursor-pointer flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
      >
        View
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="cursor-pointer flex-1 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-400"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="cursor-pointer flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black hover:bg-gray-200"
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-3 rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
    </div>
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
