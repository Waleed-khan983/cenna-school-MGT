"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyStudents } from "@/store/teacherDashboardSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function TeacherStudentsPage() {
  const dispatch = useDispatch();

  const { students = [], loading, error } = useSelector(
    (state) => state.teacherDashboard || {}
  );

  useEffect(() => {
    dispatch(fetchMyStudents());
  }, [dispatch]);

  if (loading) return <PageLoader text="Loading students..." />;

  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Students</h1>
      <p className="mb-6 text-gray-500">View students assigned to your classes.</p>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!error && students.length > 0 ? (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Admission No</th>
                <th className="p-4">Class</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="p-4 font-semibold">
                    {student.user?.name || "N/A"}
                  </td>
                  <td className="p-4">{student.admissionNo}</td>
                  <td className="p-4">
                    {student.class?.displayName ||
                      `${student.class?.name || "N/A"} - ${student.section || "A"}`}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        student.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div className="rounded-3xl bg-white p-10 text-center font-semibold text-gray-500 shadow-sm">
            No students found in your classes.
          </div>
        )
      )}
    </section>
  );
}
