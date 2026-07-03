"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchJobApplications,
  updateJobApplicationStatus,
  removeJobApplication,
} from "@/store/jobApplicationSlice";

import PageLoader from "@/components/ui/PageLoader";

const statuses = [
  "pending",
  "reviewed",
  "shortlisted",
  "interview",
  "selected",
  "rejected",
];

const API_URL = process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

const getFileUrl = (filePath) => {
  if (!filePath) return "#";
  if (filePath.startsWith("http")) return filePath;

  const cleanPath = filePath.replace(/\\/g, "/");

  return cleanPath.startsWith("/")
    ? `${API_URL}${cleanPath}`
    : `${API_URL}/${cleanPath}`;
};

export default function AdminJobApplicationsPage() {
  const dispatch = useDispatch();

  const { applications = [], loading } = useSelector(
    (state) => state.jobApplications || {}
  );

  useEffect(() => {
    dispatch(fetchJobApplications());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateJobApplicationStatus({ id, status })).unwrap();
      toast.success("Application status updated");
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await dispatch(removeJobApplication(id)).unwrap();
      toast.success("Application deleted");
    } catch (error) {
      toast.error(error || "Failed to delete application");
    }
  };

  if (loading) return <PageLoader text="Loading job applications..." />;

  return (
    <section className="space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
            Job Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, shortlist, interview, select, or reject applicants.
          </p>
        </div>

        <div className="rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white">
          Total: {applications.length}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border bg-white shadow-sm xl:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Applicant</th>
                <th className="p-4 text-left">Position</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Qualification</th>
                <th className="p-4 text-left">Experience</th>
                <th className="p-4 text-center">CV</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-black">
                      {app.fullName || "N/A"}
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        CNIC: {app.cnic || "N/A"}
                      </p>
                    </td>

                    <td className="p-4">
                      {app.vacancy?.title || app.position || "N/A"}
                    </td>

                    <td className="p-4">{app.phone || "N/A"}</td>
                    <td className="p-4">{app.email || "N/A"}</td>
                    <td className="p-4">{app.qualification || "N/A"}</td>
                    <td className="p-4">{app.experience || "N/A"}</td>

                    <td className="p-4 text-center">
                      <CvButton cv={app.cv} />
                    </td>

                    <td className="p-4 text-center">
                      <StatusSelect
                        value={app.status}
                        onChange={(status) => handleStatusChange(app._id, status)}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <DeleteButton onClick={() => handleDelete(app._id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyTable />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet / Mobile Cards */}
      <div className="grid gap-4 xl:hidden sm:grid-cols-2 lg:grid-cols-3">
        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationCard
              key={app._id}
              app={app}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center font-semibold text-gray-500 shadow-sm sm:col-span-2 lg:col-span-3">
            No job applications found.
          </div>
        )}
      </div>
    </section>
  );
}

function ApplicationCard({ app, onStatusChange, onDelete }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 border-b pb-4">
        <h3 className="break-words text-lg font-extrabold text-black">
          {app.fullName || "N/A"}
        </h3>

        <p className="mt-1 break-words text-sm font-semibold text-gray-500">
          {app.vacancy?.title || app.position || "N/A"}
        </p>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <MobileInfo label="Phone" value={app.phone} />
        <MobileInfo label="Email" value={app.email} />
        <MobileInfo label="CNIC" value={app.cnic} />
        <MobileInfo label="Qualification" value={app.qualification} />
        <MobileInfo label="Experience" value={app.experience} />
      </div>

      <div className="mt-4 grid gap-2">
        <StatusSelect
          value={app.status}
          onChange={(status) => onStatusChange(app._id, status)}
          full
        />

        <CvButton cv={app.cv} full />

        <DeleteButton onClick={() => onDelete(app._id)} full />
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange, full = false }) {
  return (
    <select
      value={value || "pending"}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-xl border px-3 py-3 text-sm font-bold capitalize outline-none focus:border-black ${
        full ? "w-full" : ""
      }`}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function CvButton({ cv, full = false }) {
  if (!cv) {
    return (
      <p className="text-center text-sm font-semibold text-gray-500">
        No CV Uploaded
      </p>
    );
  }

  return (
    <a
      href={getFileUrl(cv)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-blue-500 ${
        full ? "w-full" : ""
      }`}
    >
      View CV
    </a>
  );
}

function DeleteButton({ onClick, full = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 ${
        full ? "w-full" : ""
      }`}
    >
      Delete
    </button>
  );
}

function EmptyTable() {
  return (
    <tr>
      <td colSpan={9} className="p-10 text-center font-semibold text-gray-500">
        No job applications found.
      </td>
    </tr>
  );
}

function MobileInfo({ label, value }) {
  return (
    <p className="break-words">
      <span className="font-bold text-black">{label}:</span> {value || "N/A"}
    </p>
  );
}