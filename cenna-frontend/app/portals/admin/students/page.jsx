"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchStudents,
  editStudent,
  removeStudent,
} from "@/store/studentSlice";

import PageLoader from "@/components/ui/PageLoader";
import api from "@/services/api";

export default function StudentsPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [classes, setClasses] = useState([]);

  const { students = [], loading, error } = useSelector(
    (state) => state.students || {}
  );

  useEffect(() => {
    dispatch(fetchStudents());
    loadClasses();
  }, [dispatch]);

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data?.classes || res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return students;

    return students.filter((student) => {
      const name = student.user?.name?.toLowerCase() || "";
      const email = student.user?.email?.toLowerCase() || "";
      const father = student.fatherName?.toLowerCase() || "";
      const admissionNo = student.admissionNo?.toLowerCase() || "";
      const className =
        student.class?.displayName?.toLowerCase() ||
        student.class?.name?.toLowerCase() ||
        "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        father.includes(value) ||
        admissionNo.includes(value) ||
        className.includes(value)
      );
    });
  }, [students, search]);

  const getClassName = (student) => {
    return (
      student.class?.displayName ||
      `${student.class?.name || "N/A"} ${
        student.class?.section ? `- ${student.class.section}` : ""
      }`
    );
  };

  const handleDelete = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.user?.name || "this student"}?`
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeStudent(student._id)).unwrap();
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete student");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        admissionNo: formData.get("admissionNo"),
        fatherName: formData.get("fatherName"),
        classId: formData.get("classId"),
        section: formData.get("section"),
        address: formData.get("address"),
      };

      await dispatch(
        editStudent({
          id: selectedStudent._id,
          data,
        })
      ).unwrap();

      toast.success("Student updated successfully");
      setSelectedStudent(null);
      setEditMode(false);
      dispatch(fetchStudents());
    } catch (error) {
      toast.error(error || "Failed to update student");
    }
  };

  if (loading) return <PageLoader text="Loading students..." />;

  if (error) {
    return (
      <div className="m-3 rounded-2xl bg-red-50 p-6 font-semibold text-red-600 sm:m-4 md:m-6">
        {error}
      </div>
    );
  }

  return (
    <section className="p-3 sm:p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
            Students
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage, view, update, and delete registered students.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, admission no, email, father, class..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black md:w-96"
        />
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="w-20 px-5 py-4 text-center">S.No</th>
                <th className="w-52 px-5 py-4">Name</th>
                <th className="w-64 px-5 py-4">Email</th>
                <th className="w-40 px-5 py-4">Admission No</th>
                <th className="w-40 px-5 py-4">Class</th>
                <th className="w-48 px-5 py-4">Father</th>
                <th className="w-56 px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="px-5 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {student.user?.name || "N/A"}
                    </td>

                    <td className="truncate px-5 py-4 text-gray-600">
                      {student.user?.email || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {student.admissionNo || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {getClassName(student)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {student.fatherName || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          label="View"
                          color="blue"
                          onClick={() => {
                            setSelectedStudent(student);
                            setEditMode(false);
                          }}
                        />

                        <ActionButton
                          label="Edit"
                          color="yellow"
                          onClick={() => {
                            setSelectedStudent(student);
                            setEditMode(true);
                          }}
                        />

                        <ActionButton
                          label="Delete"
                          color="red"
                          onClick={() => handleDelete(student)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center font-semibold text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <div
              key={student._id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-black">
                    {student.user?.name || "N/A"}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    {student.user?.email || "No email"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  #{index + 1}
                </span>
              </div>

              <div className="grid gap-2 text-sm text-gray-600">
                <MobileInfo label="Admission No" value={student.admissionNo} />
                <MobileInfo label="Class" value={getClassName(student)} />
                <MobileInfo label="Father" value={student.fatherName} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <ActionButton
                  label="View"
                  color="blue"
                  full
                  onClick={() => {
                    setSelectedStudent(student);
                    setEditMode(false);
                  }}
                />

                <ActionButton
                  label="Edit"
                  color="yellow"
                  full
                  onClick={() => {
                    setSelectedStudent(student);
                    setEditMode(true);
                  }}
                />

                <ActionButton
                  label="Delete"
                  color="red"
                  full
                  onClick={() => handleDelete(student)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center font-semibold text-gray-500 shadow-sm">
            No students found.
          </div>
        )}
      </div>

      {selectedStudent && !editMode && (
        <Modal title="Student Details" onClose={() => setSelectedStudent(null)}>
          <Info label="Name" value={selectedStudent.user?.name} />
          <Info label="Email" value={selectedStudent.user?.email} />
          <Info label="Phone" value={selectedStudent.user?.phone} />
          <Info label="Admission No" value={selectedStudent.admissionNo} />
          <Info label="Father Name" value={selectedStudent.fatherName} />
          <Info label="Class" value={getClassName(selectedStudent)} />
          <Info label="Section" value={selectedStudent.section} />
          <Info label="Address" value={selectedStudent.address} />
        </Modal>
      )}

      {selectedStudent && editMode && (
        <Modal title="Edit Student" onClose={() => setSelectedStudent(null)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="name"
              label="Name"
              defaultValue={selectedStudent.user?.name}
            />

            <Input
              name="email"
              label="Email"
              defaultValue={selectedStudent.user?.email}
            />

            <Input
              name="phone"
              label="Phone"
              defaultValue={selectedStudent.user?.phone}
            />

            <Input
              name="admissionNo"
              label="Admission No"
              defaultValue={selectedStudent.admissionNo}
            />

            <Input
              name="fatherName"
              label="Father Name"
              defaultValue={selectedStudent.fatherName}
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Class
              </label>

              <select
                name="classId"
                defaultValue={selectedStudent.class?._id || ""}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.displayName || `${cls.name} - ${cls.section || ""}`}
                  </option>
                ))}
              </select>
            </div>

            <Input
              name="section"
              label="Section"
              defaultValue={selectedStudent.section}
            />

            <Input
              name="address"
              label="Address"
              defaultValue={selectedStudent.address}
            />

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Update Student
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function MobileInfo({ label, value }) {
  return (
    <p>
      <span className="font-bold text-black">{label}:</span>{" "}
      {value || "N/A"}
    </p>
  );
}

function ActionButton({ label, color, onClick, full = false }) {
  const styles = {
    blue: "bg-blue-600 text-white hover:bg-blue-500",
    yellow: "bg-yellow-500 text-black hover:bg-yellow-400",
    red: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} cursor-pointer rounded-lg px-3 py-2 text-xs font-bold transition ${
        styles[color]
      }`}
    >
      {label}
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-black sm:text-2xl">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black"
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
      <p className="mt-1 break-words font-semibold text-black">
        {value || "N/A"}
      </p>
    </div>
  );
}

function Input({ label, name, defaultValue }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue || ""}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}