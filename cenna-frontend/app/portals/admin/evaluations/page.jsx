"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchTeachers } from "@/store/teacherSlice";
import {
  launchCampaign,
  fetchCampaigns,
  closeCampaign,
  fetchReports,
} from "@/store/evaluationSlice";

import PageLoader from "@/components/ui/PageLoader";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const initialForm = {
  teacher: "",
  month: months[new Date().getMonth()],
  year: new Date().getFullYear(),
  startDate: "",
  endDate: "",
};

export default function AdminEvaluationPage() {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const { teachers } = useSelector((state) => state.teachers);

  const { campaigns, reports, loading, error } = useSelector(
    (state) => state.evaluations
  );

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchCampaigns());
    dispatch(fetchReports());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLaunch = async (event) => {
    event.preventDefault();

    if (!form.teacher || !form.month || !form.year || !form.startDate || !form.endDate) {
      toast.error("All fields are required");
      return;
    }

    try {
      await dispatch(
        launchCampaign({
          ...form,
          year: Number(form.year),
        })
      ).unwrap();

      toast.success("Evaluation launched successfully");
      setForm(initialForm);
      dispatch(fetchCampaigns());
    } catch (error) {
      toast.error(error || "Failed to launch evaluation");
    }
  };

  const handleClose = async (campaign) => {
    if (!window.confirm("Close this evaluation campaign?")) return;

    try {
      await dispatch(closeCampaign(campaign._id)).unwrap();
      toast.success("Campaign closed");
    } catch (error) {
      toast.error(error || "Failed to close campaign");
    }
  };

  const filteredReports = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return reports;

    return reports.filter((item) => {
      const teacher = item.teacher?.user?.name?.toLowerCase() || "";
      const student = item.student?.user?.name?.toLowerCase() || "";
      const remarks = item.remarks?.toLowerCase() || "";

      return (
        teacher.includes(value) ||
        student.includes(value) ||
        remarks.includes(value)
      );
    });
  }, [reports, search]);

  const summary = useMemo(() => {
    const grouped = {};

    reports.forEach((item) => {
      const teacherId = item.teacher?._id;
      const teacherName = item.teacher?.user?.name || "Unknown";

      if (!teacherId) return;

      if (!grouped[teacherId]) {
        grouped[teacherId] = {
          teacherId,
          teacherName,
          total: 0,
        };
      }

      grouped[teacherId].total += 1;
    });

    return Object.values(grouped);
  }, [reports]);

  if (loading) return <PageLoader text="Loading evaluations..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          Teacher Evaluations
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Launch teacher evaluations and view student feedback.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLaunch}
        className="mb-8 rounded-3xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-extrabold">Launch Evaluation</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Teacher
            </label>

            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.user?.name || "Unnamed Teacher"}
                </option>
              ))}
            </select>
          </div>

          <Select
            label="Month"
            name="month"
            value={form.month}
            onChange={handleChange}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>

          <Input
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
          />

          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-5 !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          Launch Evaluation
        </button>
      </form>

      <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold">Evaluation Campaigns</h2>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4 text-left">Teacher</th>
                <th className="px-4 py-4">Month</th>
                <th className="px-4 py-4">Year</th>
                <th className="px-4 py-4">Start</th>
                <th className="px-4 py-4">End</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {campaigns.length > 0 ? (
                campaigns.map((campaign, index) => (
                  <tr key={campaign._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {campaign.teacher?.user?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">{campaign.month}</td>

                    <td className="px-4 py-4 text-center">{campaign.year}</td>

                    <td className="px-4 py-4 text-center">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-center font-bold">
                      {campaign.isActive ? "Active" : "Closed"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {campaign.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleClose(campaign)}
                          className="!cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          Close
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.teacherId}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-extrabold text-black">
              {item.teacherName}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Total Responses: {item.total}
            </p>
          </div>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search feedback by teacher, student, remarks..."
        className="mb-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4 text-left">Teacher</th>
                <th className="px-4 py-4 text-left">Student</th>
                <th className="px-4 py-4">Punctuality</th>
                <th className="px-4 py-4">Teaching</th>
                <th className="px-4 py-4">Assignments</th>
                <th className="px-4 py-4 text-left">Remarks</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-bold">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {report.teacher?.user?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      {report.student?.user?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {report.punctuality}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {report.teachingQuality}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {report.assignmentGiven}
                    </td>

                    <td className="px-4 py-4">{report.remarks || "N/A"}</td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="!cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center font-semibold text-gray-500"
                  >
                    No feedback reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <Modal
          title="Evaluation Details"
          onClose={() => setSelectedReport(null)}
        >
          <Info label="Teacher" value={selectedReport.teacher?.user?.name} />
          <Info label="Student" value={selectedReport.student?.user?.name} />
          <Info label="Punctuality" value={selectedReport.punctuality} />
          <Info label="Teaching Quality" value={selectedReport.teachingQuality} />
          <Info label="Gives Assignments" value={selectedReport.assignmentGiven} />
          <Info
            label="Checks Assignments"
            value={selectedReport.assignmentChecking}
          />
          <Info label="Communication" value={selectedReport.communication} />
          <Info label="Discipline" value={selectedReport.discipline} />
          <Info label="Remarks" value={selectedReport.remarks} />
        </Modal>
      )}
    </section>
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

function Info({ label, value }) {
  return (
    <div className="mb-3 rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-semibold text-black">{value || "N/A"}</p>
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
            className="!cursor-pointer rounded-lg bg-gray-100 px-3 py-2 font-bold text-black"
          >
            X
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}