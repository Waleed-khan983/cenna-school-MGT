"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import PageLoader from "@/components/ui/PageLoader";

export default function AdminAlumniRegistrationsPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAlumni = async () => {
    try {
      const res = await api.get("/alumni");

      setAlumni(res.data.alumni || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load alumni registrations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/alumni/approve/${id}`);

      toast.success("Alumni approved");

      fetchAlumni();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve alumni");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this alumni registration?");

    if (!confirmed) return;

    try {
      await api.delete(`/alumni/${id}`);

      toast.success("Alumni deleted");

      fetchAlumni();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete alumni");
    }
  };

  if (loading) {
    return <PageLoader text="Loading Alumni..." />;
  }

  const filteredAlumni = alumni.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.fullName?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.admissionNo?.toLowerCase().includes(query) ||
      item.batch?.toLowerCase().includes(query) ||
      item.profession?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Alumni Registrations
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage alumni registrations.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search alumni..."
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black sm:w-80"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Admission No</th>
                <th className="p-4 text-left">Batch</th>
                <th className="p-4 text-left">Passing Year</th>
                <th className="p-4 text-left">Profession</th>
                <th className="p-4 text-left">Organization</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlumni.length > 0 ? (
                filteredAlumni.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold">{item.fullName}</div>

                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>

                    <td className="p-4">{item.admissionNo}</td>

                    <td className="p-4">{item.batch}</td>

                    <td className="p-4">{item.passingYear}</td>

                    <td className="p-4">{item.profession}</td>

                    <td className="p-4">{item.organization}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {item.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(item._id)}
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500 cursor-pointer "
                          >
                            Approve
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No alumni registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {filteredAlumni.length > 0 ? (
          filteredAlumni.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-extrabold">{item.fullName}</h3>

              <p className="text-sm text-gray-500">{item.email}</p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Admission No:</strong> {item.admissionNo}
                </p>

                <p>
                  <strong>Batch:</strong> {item.batch}
                </p>

                <p>
                  <strong>Passing Year:</strong> {item.passingYear}
                </p>

                <p>
                  <strong>Profession:</strong> {item.profession}
                </p>

                <p>
                  <strong>Organization:</strong> {item.organization}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      item.status === "approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {item.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="rounded-xl bg-green-600 py-3 font-bold text-white cursor-pointer"
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-xl bg-red-600 py-3 font-bold text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No alumni registrations found.
          </div>
        )}
      </div>
    </section>
  );
}
