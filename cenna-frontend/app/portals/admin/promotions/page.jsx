"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaExchangeAlt,
  FaSearch,
  FaUserGraduate,
  FaSchool,
  FaCheckCircle,
  FaUsers,
  FaHistory,
  FaSyncAlt,
} from "react-icons/fa";

import { getClasses } from "@/services/classService";
import {
  getStudents,
  promoteStudentApi,
  promoteStudentsBulkApi,
} from "@/services/studentService";

// The shared Axios instance (services/api.js) already attaches the
// Authorization header via its request interceptor — no manual token
// lookup needed here.
function getErrorMessage(error, fallback) {
  if (error.response) {
    if (error.response.status === 401) {
      return "Session expired. Please log in again.";
    }
    if (error.response.status === 403) {
      return "You are not authorized to perform this action.";
    }
    return error.response.data?.message || fallback;
  }

  if (error.request) {
    return "Network error. Please check your connection and try again.";
  }

  return error.message || fallback;
}

export default function AdminPromotionsPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [promoting, setPromoting] = useState(false);

  const [mode, setMode] = useState("single");

  const [filters, setFilters] = useState({
    search: "",
    classId: "",
    section: "",
  });

  const [singlePromotion, setSinglePromotion] = useState({
    studentId: "",
    toClassId: "",
    toSection: "A",
    academicYear: "2026-2027",
    remarks: "",
  });

  const [bulkPromotion, setBulkPromotion] = useState({
    fromClassId: "",
    fromSection: "",
    toClassId: "",
    toSection: "A",
    academicYear: "2026-2027",
    remarks: "",
  });

  const selectedStudent = useMemo(() => {
    return students.find(
      (student) => student._id === singlePromotion.studentId,
    );
  }, [students, singlePromotion.studentId]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);

      const data = await getClasses();
      setClasses(data.classes || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load classes"));
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const params = {};
      if (filters.classId) params.class = filters.classId;
      if (filters.section) params.section = filters.section;
      if (filters.search) params.search = filters.search;

      const data = await getStudents(params);
      setStudents(data.students || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load students"));
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters.classId, filters.section]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchStudents();
  };

  const handleSinglePromotion = async (event) => {
    event.preventDefault();

    // Guards against a duplicate submit firing before React re-renders the
    // disabled button (the disabled attribute alone can't catch a second
    // click/Enter that lands in the same tick).
    if (promoting) return;

    if (!singlePromotion.studentId) {
      toast.error("Select a student before promoting.");
      return;
    }

    if (!singlePromotion.toClassId || !singlePromotion.academicYear) {
      toast.error("Target class and academic year are required.");
      return;
    }

    try {
      setPromoting(true);

      await promoteStudentApi({
        id: singlePromotion.studentId,
        data: {
          toClassId: singlePromotion.toClassId,
          toSection: singlePromotion.toSection,
          academicYear: singlePromotion.academicYear,
          remarks: singlePromotion.remarks,
        },
      });

      toast.success("Student promoted successfully");

      setSinglePromotion({
        studentId: "",
        toClassId: "",
        toSection: "A",
        academicYear: "2026-2027",
        remarks: "",
      });

      fetchStudents();
    } catch (error) {
      toast.error(getErrorMessage(error, "Promotion failed"));
    } finally {
      setPromoting(false);
    }
  };

  const handleBulkPromotion = async (event) => {
    event.preventDefault();

    if (promoting) return;

    if (
      !bulkPromotion.fromClassId ||
      !bulkPromotion.toClassId ||
      !bulkPromotion.academicYear
    ) {
      toast.error("From class, target class, and academic year are required.");
      return;
    }

    if (bulkPromotion.fromClassId === bulkPromotion.toClassId) {
      toast.error("From class and target class cannot be the same.");
      return;
    }

    try {
      setPromoting(true);

      // studentIds is intentionally omitted — this form promotes every
      // active student in fromClass(+fromSection), which the backend
      // treats as "no ids supplied = whole class/section" by design. An
      // explicitly empty array is a different, rejected case (see
      // promoteStudentsBulk in studentController.js) that this form never
      // triggers.
      const data = await promoteStudentsBulkApi({
        fromClassId: bulkPromotion.fromClassId,
        fromSection: bulkPromotion.fromSection,
        toClassId: bulkPromotion.toClassId,
        toSection: bulkPromotion.toSection,
        academicYear: bulkPromotion.academicYear,
        remarks: bulkPromotion.remarks,
      });

      toast.success(
        `Bulk promotion completed. Promoted: ${data.promotedCount || 0}, Skipped: ${
          data.skippedCount || 0
        }`,
      );

      setBulkPromotion({
        fromClassId: "",
        fromSection: "",
        toClassId: "",
        toSection: "A",
        academicYear: "2026-2027",
        remarks: "",
      });

      fetchStudents();
    } catch (error) {
      toast.error(getErrorMessage(error, "Bulk promotion failed"));
    } finally {
      setPromoting(false);
    }
  };

  return (
    <section className="space-y-8 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-extrabold text-black sm:text-3xl">
            <FaExchangeAlt className="text-yellow-500" />
            Student Promotions
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            Promote students without creating new accounts. Their login remains
            the same, but their class, section, and academic year are updated
            automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchClasses();
            fetchStudents();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-extrabold text-white transition hover:bg-gray-800"
        >
          <FaSyncAlt />
          Refresh Data
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <InfoBox
          icon={<FaUserGraduate />}
          title="One Account"
          text="Student registers one time only."
        />

        <InfoBox
          icon={<FaSchool />}
          title="Class Updates"
          text="Admin changes current class after promotion."
        />

        <InfoBox
          icon={<FaHistory />}
          title="History Saved"
          text="Previous class and promotion record are saved."
        />
      </div>

      <div className="rounded-3xl border bg-white p-2 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`rounded-2xl px-5 py-4 text-sm font-extrabold transition ${
              mode === "single"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Promote One Student
          </button>

          <button
            type="button"
            onClick={() => setMode("bulk")}
            className={`rounded-2xl px-5 py-4 text-sm font-extrabold transition ${
              mode === "bulk"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Promote Full Class
          </button>
        </div>
      </div>

      {mode === "single" ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-black">
                Select Student
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search or filter students, then choose one student for
                promotion.
              </p>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_120px_auto]"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters({ ...filters, search: event.target.value })
                  }
                  placeholder="Search by name, admission no, roll no..."
                  className="w-full rounded-2xl border px-11 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              <select
                value={filters.classId}
                onChange={(event) =>
                  setFilters({ ...filters, classId: event.target.value })
                }
                className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-black"
              >
                <option value="">All Classes</option>
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.displayName || `${item.name} - ${item.section}`}
                  </option>
                ))}
              </select>

              <select
                value={filters.section}
                onChange={(event) =>
                  setFilters({ ...filters, section: event.target.value })
                }
                className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-black"
              >
                <option value="">Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>

              <button
                type="submit"
                className="rounded-2xl bg-black px-5 py-3 text-sm font-extrabold text-white transition hover:bg-gray-800"
              >
                Search
              </button>
            </form>

            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-3">Student</th>
                    <th>Admission No</th>
                    <th>Current Class</th>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Select</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingStudents ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center font-semibold text-gray-500"
                      >
                        Loading students...
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student._id} className="border-b last:border-0">
                        <td className="px-4 py-4">
                          <p className="font-extrabold text-black">
                            {student.user?.name || "Unnamed Student"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {student.user?.email || "No email"}
                          </p>
                        </td>

                        <td className="font-semibold text-gray-600">
                          {student.admissionNo || "N/A"}
                        </td>

                        <td className="font-semibold text-gray-600">
                          {student.class?.displayName ||
                            student.class?.name ||
                            "Not assigned"}
                        </td>

                        <td className="font-semibold text-gray-600">
                          {student.section || "A"}
                        </td>

                        <td>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              student.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              setSinglePromotion({
                                ...singlePromotion,
                                studentId: student._id,
                              })
                            }
                            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                              singlePromotion.studentId === student._id
                                ? "bg-yellow-500 text-black"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                          >
                            {singlePromotion.studentId === student._id
                              ? "Selected"
                              : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center font-semibold text-gray-500"
                      >
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-black">
                Promotion Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose target class and academic year.
              </p>
            </div>

            {selectedStudent && (
              <div className="mb-5 rounded-2xl bg-yellow-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                  Selected Student
                </p>

                <h3 className="mt-2 font-extrabold text-black">
                  {selectedStudent.user?.name || "Unnamed Student"}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Current Class:{" "}
                  <strong>
                    {selectedStudent.class?.displayName ||
                      selectedStudent.class?.name ||
                      "Not assigned"}
                  </strong>
                </p>
              </div>
            )}

            <form onSubmit={handleSinglePromotion} className="space-y-4">
              <FormGroup label="Promote To Class *">
                <select
                  value={singlePromotion.toClassId}
                  onChange={(event) =>
                    setSinglePromotion({
                      ...singlePromotion,
                      toClassId: event.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={loadingClasses}
                >
                  <option value="">Select Target Class</option>
                  {classes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.displayName || `${item.name} - ${item.section}`}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Target Section">
                <select
                  value={singlePromotion.toSection}
                  onChange={(event) =>
                    setSinglePromotion({
                      ...singlePromotion,
                      toSection: event.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </FormGroup>

              <FormGroup label="Academic Year *">
                <input
                  type="text"
                  value={singlePromotion.academicYear}
                  onChange={(event) =>
                    setSinglePromotion({
                      ...singlePromotion,
                      academicYear: event.target.value,
                    })
                  }
                  placeholder="2026-2027"
                  className={inputClass}
                />
              </FormGroup>

              <FormGroup label="Remarks">
                <textarea
                  rows="3"
                  value={singlePromotion.remarks}
                  onChange={(event) =>
                    setSinglePromotion({
                      ...singlePromotion,
                      remarks: event.target.value,
                    })
                  }
                  placeholder="Promoted after annual exam"
                  className={inputClass}
                />
              </FormGroup>

              <button
                type="submit"
                disabled={promoting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-extrabold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaCheckCircle />
                {promoting ? "Promoting..." : "Promote Student"}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="flex items-center gap-3 text-xl font-extrabold text-black">
              <FaUsers className="text-yellow-500" />
              Bulk Class Promotion
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Promote all active students from one class to another class.
            </p>
          </div>

          <form
            onSubmit={handleBulkPromotion}
            className="grid gap-5 lg:grid-cols-2"
          >
            <FormGroup label="From Class *">
              <select
                value={bulkPromotion.fromClassId}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    fromClassId: event.target.value,
                  })
                }
                className={inputClass}
                disabled={loadingClasses}
              >
                <option value="">Select Current Class</option>
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.displayName || `${item.name} - ${item.section}`}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="From Section">
              <select
                value={bulkPromotion.fromSection}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    fromSection: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </FormGroup>

            <FormGroup label="Promote To Class *">
              <select
                value={bulkPromotion.toClassId}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    toClassId: event.target.value,
                  })
                }
                className={inputClass}
                disabled={loadingClasses}
              >
                <option value="">Select Target Class</option>
                {classes.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.displayName || `${item.name} - ${item.section}`}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Target Section">
              <select
                value={bulkPromotion.toSection}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    toSection: event.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </FormGroup>

            <FormGroup label="Academic Year *">
              <input
                type="text"
                value={bulkPromotion.academicYear}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    academicYear: event.target.value,
                  })
                }
                placeholder="2026-2027"
                className={inputClass}
              />
            </FormGroup>

            <FormGroup label="Remarks">
              <textarea
                rows="3"
                value={bulkPromotion.remarks}
                onChange={(event) =>
                  setBulkPromotion({
                    ...bulkPromotion,
                    remarks: event.target.value,
                  })
                }
                placeholder="Annual class promotion"
                className={inputClass}
              />
            </FormGroup>

            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={promoting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-extrabold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaCheckCircle />
                {promoting ? "Promoting Class..." : "Promote Full Class"}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </section>
  );
}

function InfoBox({ icon, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-xl text-yellow-600">
        {icon}
      </div>

      <h3 className="font-extrabold text-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </motion.div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-black";
