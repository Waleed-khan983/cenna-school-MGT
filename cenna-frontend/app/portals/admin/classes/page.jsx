"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchClasses,
  addClass,
  editClass,
  removeClass,
} from "@/store/classSlice";

import { fetchTeachers } from "@/store/teacherSlice";
import PageLoader from "@/components/ui/PageLoader";

const initialForm = {
  name: "",
  section: "A",
  room: "",
  capacity: 50,
  classTeacher: "",
};

export default function AdminClassesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(initialForm);

  const {
    classes = [],
    loading,
    error,
  } = useSelector((state) => state.classes || {});

  const { teachers = [] } = useSelector((state) => state.teachers || {});

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredClasses = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return classes;

    return classes.filter((cls) => {
      const name = cls.name?.toLowerCase() || "";
      const section = cls.section?.toLowerCase() || "";
      const displayName = cls.displayName?.toLowerCase() || "";
      const teacher = cls.classTeacher?.user?.name?.toLowerCase() || "";
      const room = cls.room?.toLowerCase() || "";

      return (
        name.includes(value) ||
        section.includes(value) ||
        displayName.includes(value) ||
        teacher.includes(value) ||
        room.includes(value)
      );
    });
  }, [classes, search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreate = () => {
    setForm(initialForm);
    setShowCreate(true);
    setEditMode(false);
    setSelectedClass(null);
  };

  const openEdit = (cls) => {
    setSelectedClass(cls);
    setEditMode(true);
    setShowCreate(false);

    setForm({
      name: cls.name || "",
      section: cls.section || "A",
      room: cls.room || "",
      capacity: cls.capacity || 50,
      classTeacher: cls.classTeacher?._id || "",
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await dispatch(addClass(form)).unwrap();
      toast.success("Class created successfully");
      setShowCreate(false);
      setForm(initialForm);
    } catch (error) {
      toast.error(error || "Failed to create class");
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        editClass({
          id: selectedClass._id,
          data: form,
        }),
      ).unwrap();

      toast.success("Class updated successfully");
      setSelectedClass(null);
      setEditMode(false);
      setForm(initialForm);
    } catch (error) {
      toast.error(error || "Failed to update class");
    }
  };

  const handleDelete = async (cls) => {
    if (!window.confirm(`Delete ${cls.displayName || cls.name}?`)) return;

    try {
      await dispatch(removeClass(cls._id)).unwrap();
      toast.success("Class deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete class");
    }
  };

  if (loading) return <PageLoader text="Loading classes..." />;

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
          <h1 className="text-3xl font-extrabold text-black">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage class names, sections, rooms, capacity, and class teachers.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class, section, teacher..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black md:w-80"
          />

          <button
            type="button"
            onClick={openCreate}
            className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Add Class
          </button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-4 text-center">#</th>
              <th className="px-4 py-4 text-left">Class</th>
              <th className="px-4 py-4 text-left">Section</th>
              <th className="px-4 py-4 text-left">Class Teacher</th>
              <th className="px-4 py-4 text-left">Room</th>
              <th className="px-4 py-4 text-center">Capacity</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls, index) => (
                <tr key={cls._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-center font-bold">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {cls.displayName || `${cls.name} - ${cls.section}`}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {cls.section || "N/A"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {cls.classTeacher?.user?.name || "Not Assigned"}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {cls.room || "N/A"}
                  </td>

                  <td className="px-4 py-4 text-center font-bold">
                    {cls.capacity || 0}
                  </td>

                  <td className="px-4 py-4">
                    <Actions
                      onView={() => {
                        setSelectedClass(cls);
                        setEditMode(false);
                        setShowCreate(false);
                      }}
                      onEdit={() => openEdit(cls)}
                      onDelete={() => handleDelete(cls)}
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
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:hidden">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-black">
                {cls.displayName || `${cls.name} - ${cls.section}`}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                <b>Teacher:</b> {cls.classTeacher?.user?.name || "Not Assigned"}
              </p>

              <p className="text-sm text-gray-600">
                <b>Room:</b> {cls.room || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                <b>Capacity:</b> {cls.capacity || 0}
              </p>

              <div className="mt-4">
                <Actions
                  mobile
                  onView={() => {
                    setSelectedClass(cls);
                    setEditMode(false);
                    setShowCreate(false);
                  }}
                  onEdit={() => openEdit(cls)}
                  onDelete={() => handleDelete(cls)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-gray-500 shadow-sm">
            No classes found.
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Class" onClose={() => setShowCreate(false)}>
          <ClassForm
            form={form}
            teachers={teachers}
            onChange={handleChange}
            onSubmit={handleCreate}
            buttonText="Create Class"
          />
        </Modal>
      )}

      {selectedClass && !editMode && (
        <Modal title="Class Details" onClose={() => setSelectedClass(null)}>
          <Info
            label="Class"
            value={
              selectedClass.displayName ||
              `${selectedClass.name} - ${selectedClass.section}`
            }
          />
          <Info label="Section" value={selectedClass.section} />
          <Info
            label="Class Teacher"
            value={selectedClass.classTeacher?.user?.name || "Not Assigned"}
          />
          <Info label="Room" value={selectedClass.room} />
          <Info label="Capacity" value={selectedClass.capacity} />

          <div className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
            Subjects are assigned from Admin → Class Subjects page.
          </div>
        </Modal>
      )}

      {selectedClass && editMode && (
        <Modal title="Edit Class" onClose={() => setSelectedClass(null)}>
          <ClassForm
            form={form}
            teachers={teachers}
            onChange={handleChange}
            onSubmit={handleEdit}
            buttonText="Update Class"
          />
        </Modal>
      )}
    </section>
  );
}

function ClassForm({ form, teachers, onChange, onSubmit, buttonText }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Class Name"
        name="name"
        value={form.name}
        onChange={onChange}
      />
      <Input
        label="Section"
        name="section"
        value={form.section}
        onChange={onChange}
      />
      <Input label="Room" name="room" value={form.room} onChange={onChange} />
      <Input
        label="Capacity"
        name="capacity"
        type="number"
        value={form.capacity}
        onChange={onChange}
      />

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Class Teacher
        </label>

        <select
          name="classTeacher"
          value={form.classTeacher}
          onChange={onChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
        >
          <option value="">Select Teacher</option>

          {teachers?.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.user?.name || "Unnamed Teacher"}
            </option>
          ))}
        </select>
      </div>

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
