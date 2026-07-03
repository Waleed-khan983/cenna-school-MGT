"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaSpinner, FaUserGraduate } from "react-icons/fa";
import { toast } from "react-toastify";

import { searchStudentsForFeesApi } from "@/services/studentService";
import { getStudentFeesApi } from "@/services/feeService";

export default function StudentSearch({ onStudentSelected }) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingStudentId, setLoadingStudentId] = useState("");

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setStudents([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const res = await searchStudentsForFeesApi(query.trim());

        setStudents(res.students || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to search students"
        );
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectStudent = async (student) => {
    try {
      setLoadingStudentId(student._id);

      const res = await getStudentFeesApi(student._id);

      onStudentSelected({
        student,
        fees: res.fees || [],
        summary: res.summary || null,
      });

      setQuery("");
      setStudents([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load student fees"
      );
    } finally {
      setLoadingStudentId("");
    }
  };

  return (
    <div className="rounded-[2rem] border bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-black">
            Search Student
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by admission no, student name, father name, or phone.
          </p>
        </div>

        <div className="relative w-full lg:w-[520px]">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type at least 2 characters..."
            className="w-full rounded-2xl border bg-gray-50 py-4 pl-12 pr-12 text-sm font-semibold outline-none transition focus:border-black focus:bg-white"
          />

          {searching && (
            <FaSpinner className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {query.trim().length > 0 && query.trim().length < 2 && (
        <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm font-bold text-yellow-700">
          Type at least 2 characters to search.
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => (
            <button
              key={student._id}
              type="button"
              onClick={() => handleSelectStudent(student)}
              disabled={loadingStudentId === student._id}
              className="rounded-2xl border bg-gray-50 p-4 text-left transition hover:border-yellow-400 hover:bg-white hover:shadow-sm disabled:opacity-60"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                  <FaUserGraduate />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-extrabold text-black">
                    {student.user?.name || "N/A"}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {student.admissionNo || "N/A"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {student.class?.displayName || "Class N/A"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Father: {student.fatherName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-black px-4 py-2 text-center text-xs font-extrabold text-white">
                {loadingStudentId === student._id
                  ? "Loading..."
                  : "Select Student"}
              </div>
            </button>
          ))}
        </div>
      )}

      {!searching &&
        query.trim().length >= 2 &&
        students.length === 0 && (
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center font-semibold text-gray-500">
            No matching student found.
          </div>
        )}
    </div>
  );
}