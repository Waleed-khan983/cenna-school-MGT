"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchTeachers,
  editTeacher,
  removeTeacher,
} from "@/store/teacherSlice";

import PageLoader from "@/components/ui/PageLoader";

export default function AdminTeachersPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { teachers = [], loading, error } = useSelector(
    (state) => state.teachers || {}
  );

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredTeachers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return teachers;

    return teachers.filter((teacher) => {
      const name = teacher.user?.name?.toLowerCase() || "";
      const email = teacher.user?.email?.toLowerCase() || "";
      const phone = teacher.user?.phone?.toLowerCase() || "";
      const designation = teacher.designation?.toLowerCase() || "";
      const qualification = teacher.qualification?.toLowerCase() || "";
      const cnic = teacher.cnic?.toLowerCase() || "";

      const assignments =
        teacher.assignments
          ?.map(
            (item) =>
              `${item.class?.displayName || ""} ${item.subject?.name || ""}`
          )
          .join(" ")
          .toLowerCase() || "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        phone.includes(value) ||
        designation.includes(value) ||
        qualification.includes(value) ||
        cnic.includes(value) ||
        assignments.includes(value)
      );
    });
  }, [teachers, search]);

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Delete ${teacher.user?.name || "this teacher"}?`)) {
      return;
    }

    try {
      await dispatch(removeTeacher(teacher._id)).unwrap();
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete teacher");
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
        qualification: formData.get("qualification"),
        designation: formData.get("designation"),
        cnic: formData.get("cnic"),
        address: formData.get("address"),
        salary: formData.get("salary"),
      };

      await dispatch(
        editTeacher({
          id: selectedTeacher._id,
          data,
        })
      ).unwrap();

      toast.success("Teacher updated successfully");
      setSelectedTeacher(null);
      setEditMode(false);
    } catch (error) {
      toast.error(error || "Failed to update teacher");
    }
  };

  if (loading) return <PageLoader text="Loading teachers..." />;

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 font-semibold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Teachers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage teacher accounts. Class and subject assignments are handled
            from Class Subjects page.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, class, subject..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black md:w-96"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4 text-center">#</th>
                <th className="px-4 py-4 text-left">Name</th>
                <th className="px-4 py-4 text-left">Email</th>
                <th className="px-4 py-4 text-left">Phone</th>
                <th className="px-4 py-4 text-left">CNIC</th>
                <th className="px-4 py-4 text-left">Designation</th>
                <th className="px-4 py-4 text-center">Assignments</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr key={teacher._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {teacher.user?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {teacher.user?.email || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {teacher.user?.phone || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {teacher.cnic || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {teacher.designation || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center font-bold">
                      {teacher.assignments?.length || 0}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          text="View"
                          color="blue"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setEditMode(false);
                          }}
                        />

                        <ActionButton
                          text="Edit"
                          color="yellow"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setEditMode(true);
                          }}
                        />

                        <ActionButton
                          text="Delete"
                          color="red"
                          onClick={() => handleDelete(teacher)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center font-semibold text-gray-500"
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:hidden">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-black">
                {teacher.user?.name || "N/A"}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {teacher.user?.email || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                {teacher.user?.phone || "N/A"}
              </p>

              <p className="mt-3 text-sm">
                <span className="font-semibold">CNIC:</span>{" "}
                {teacher.cnic || "N/A"}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Designation:</span>{" "}
                {teacher.designation || "N/A"}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Assignments:</span>{" "}
                {teacher.assignments?.length || 0}
              </p>

              <div className="mt-4 flex gap-2">
                <ActionButton
                  text="View"
                  color="blue"
                  mobile
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setEditMode(false);
                  }}
                />

                <ActionButton
                  text="Edit"
                  color="yellow"
                  mobile
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setEditMode(true);
                  }}
                />

                <ActionButton
                  text="Delete"
                  color="red"
                  mobile
                  onClick={() => handleDelete(teacher)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center font-semibold text-gray-500 shadow-sm">
            No teachers found.
          </div>
        )}
      </div>

      {selectedTeacher && !editMode && (
        <Modal title="Teacher Details" onClose={() => setSelectedTeacher(null)}>
          <Info label="Name" value={selectedTeacher.user?.name} />
          <Info label="Email" value={selectedTeacher.user?.email} />
          <Info label="Phone" value={selectedTeacher.user?.phone} />
          <Info label="CNIC" value={selectedTeacher.cnic} />
          <Info label="Qualification" value={selectedTeacher.qualification} />
          <Info label="Designation" value={selectedTeacher.designation} />
          <Info label="Address" value={selectedTeacher.address} />
          <Info label="Salary" value={selectedTeacher.salary} />

          <div className="mb-3 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-400">
              Teaching Assignments
            </p>

            <div className="mt-2 space-y-2">
              {selectedTeacher.assignments?.length > 0 ? (
                selectedTeacher.assignments.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border bg-white p-3 text-sm"
                  >
                    <p className="font-bold text-black">
                      {item.class?.displayName ||
                        `${item.class?.name || ""} - ${
                          item.class?.section || ""
                        }`}
                    </p>
                    <p className="text-gray-600">
                      Subject: {item.subject?.name || "N/A"}
                      {item.subject?.code ? ` (${item.subject.code})` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-semibold text-gray-500">No assignments yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
            To assign classes and subjects, go to Admin → Class Subjects.
          </div>
        </Modal>
      )}

      {selectedTeacher && editMode && (
        <Modal title="Edit Teacher" onClose={() => setSelectedTeacher(null)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="name"
              label="Name"
              defaultValue={selectedTeacher.user?.name}
            />
            <Input
              name="email"
              label="Email"
              defaultValue={selectedTeacher.user?.email}
            />
            <Input
              name="phone"
              label="Phone"
              defaultValue={selectedTeacher.user?.phone}
            />
            <Input
              name="cnic"
              label="CNIC"
              defaultValue={selectedTeacher.cnic}
            />
            <Input
              name="qualification"
              label="Qualification"
              defaultValue={selectedTeacher.qualification}
            />
            <Input
              name="designation"
              label="Designation"
              defaultValue={selectedTeacher.designation}
            />
            <Input
              name="address"
              label="Address"
              defaultValue={selectedTeacher.address}
            />
            <Input
              name="salary"
              label="Salary"
              defaultValue={selectedTeacher.salary}
            />

            <div className="rounded-xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
              Subjects and classes are not edited here. Use Admin → Class
              Subjects.
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Update Teacher
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function ActionButton({ text, color, onClick, mobile = false }) {
  const colors = {
    blue: "bg-blue-600 text-white hover:bg-blue-500",
    yellow: "bg-yellow-500 text-black hover:bg-yellow-400",
    red: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-bold transition ${
        colors[color]
      } ${mobile ? "flex-1" : ""}`}
    >
      {text}
    </button>
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
            className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black transition hover:bg-gray-200"
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