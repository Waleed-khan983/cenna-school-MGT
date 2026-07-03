"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { removeResult, fetchClassResults, editResult } from "@/store/resultSlice";
import { fetchClasses } from "@/store/classSlice";
import PageLoader from "@/components/ui/PageLoader";

const examTypes = ["Monthly", "Mid-Term", "Final", "Board"];

export default function AdminResultsPage() {
  const dispatch = useDispatch();

  const [classId, setClassId] = useState("");
  const [examType, setExamType] = useState("Monthly");
  const [session, setSession] = useState("2026");
  const [search, setSearch] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [editMarks, setEditMarks] = useState([]);
  const [editRemarks, setEditRemarks] = useState("");

  const { classes = [] } = useSelector((state) => state.classes || {});
  const { results = [], loading, error } = useSelector(
    (state) => state.results || {}
  );

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleLoadResults = async () => {
    try {
      await dispatch(fetchClassResults({ classId, examType, session })).unwrap();
      toast.success("Results loaded successfully");
    } catch (error) {
      toast.error(error || "Failed to load results");
    }
  };

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return results;

    return results.filter((result) => {
      const studentName = result.student?.user?.name?.toLowerCase() || "";
      const admissionNo = result.student?.admissionNo?.toLowerCase() || "";
      const grade = result.grade?.toLowerCase() || "";

      return (
        studentName.includes(value) ||
        admissionNo.includes(value) ||
        grade.includes(value)
      );
    });
  }, [results, search]);

  const handleEdit = (result) => {
    setEditingResult(result);
    setEditRemarks(result.remarks || "");

    setEditMarks(
      result.marks?.map((mark) => ({
        subject: mark.subject?._id || mark.subject,
        subjectName: mark.subject?.name || "N/A",
        maxMarks: mark.maxMarks || 100,
        obtained: mark.obtained || 0,
      })) || []
    );
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        editResult({
          id: editingResult._id,
          data: {
            remarks: editRemarks,
            marks: editMarks.map((mark) => ({
              subject: mark.subject,
              maxMarks: Number(mark.maxMarks),
              obtained: Number(mark.obtained),
            })),
          },
        })
      ).unwrap();

      toast.success("Result updated successfully");
      setEditingResult(null);
      handleLoadResults();
    } catch (error) {
      toast.error(error || "Failed to update result");
    }
  };

  const handleDelete = async (result) => {
    const confirmed = window.confirm(
      `Delete result of ${result.student?.user?.name}?`
    );

    if (!confirmed) return;

    try {
      await dispatch(removeResult(result._id)).unwrap();
      toast.success("Result deleted successfully");
    } catch (error) {
      toast.error(error);
    }
  };

 const handlePrint = (result) => {
  const printWindow = window.open("", "_blank");
  const logoUrl = `${window.location.origin}/images/logo.jpg`;

  const className =
    result.class?.displayName ||
    `${result.class?.name || ""} - ${result.class?.section || ""}` ||
    "N/A";

  const marksRows =
    result.marks
      ?.map(
        (mark, index) => `
          <tr>
            <td>${index + 1}</td>
            <td class="subject">${mark.subject?.name || "N/A"}</td>
            <td>${mark.maxMarks || 0}</td>
            <td>${mark.obtained || 0}</td>
            <td>${mark.grade || "N/A"}</td>
            <td>${mark.isPassed ? "Pass" : "Fail"}</td>
          </tr>
        `
      )
      .join("") || "";

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Result Card</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, Helvetica, sans-serif;
      background: #f3f4f6;
      color: #111;
    }

    .card {
      width: 820px;
      margin: auto;
      background: #fff;
      border: 2px solid #111;
      padding: 22px 28px;
    }

    .header {
      display: grid;
      grid-template-columns: 90px 1fr 90px;
      align-items: center;
      border-bottom: 2px solid #111;
      padding-bottom: 14px;
    }

    .logo {
      width: 78px;
      height: 78px;
      object-fit: contain;
    }

    .school {
      text-align: center;
    }

    .school h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .school p {
      margin: 4px 0;
      font-size: 13px;
      font-weight: 700;
    }

    .title {
      margin: 16px auto;
      width: fit-content;
      border: 2px solid #111;
      padding: 7px 35px;
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      text-transform: uppercase;
    }

    .info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 25px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .info-row {
      display: flex;
      border-bottom: 1px solid #777;
      padding: 5px 0;
    }

    .label {
      width: 120px;
      font-weight: 900;
    }

    .value {
      flex: 1;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 14px;
    }

    th,
    td {
      border: 1.5px solid #111;
      padding: 8px;
      text-align: center;
    }

    th {
      background: #e5e7eb;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 12px;
    }

    .subject {
      text-align: left;
      font-weight: 800;
    }

    .summary {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1.5px solid #111;
    }

    .summary div {
      border-right: 1.5px solid #111;
      padding: 10px 6px;
      text-align: center;
      font-weight: 900;
      font-size: 13px;
    }

    .summary div:last-child {
      border-right: none;
    }

    .summary span {
      display: block;
      margin-top: 5px;
      font-size: 18px;
    }

    .result-status {
      margin-top: 15px;
      text-align: center;
      font-size: 20px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .pass {
      color: #15803d;
    }

    .fail {
      color: #dc2626;
    }

    .remarks {
      margin-top: 14px;
      border: 1.5px solid #111;
      min-height: 55px;
      padding: 10px;
      font-size: 14px;
    }

    .remarks strong {
      display: block;
      margin-bottom: 5px;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      font-size: 14px;
      font-weight: 900;
    }

    .signatures div {
      width: 210px;
      border-top: 1.5px solid #111;
      text-align: center;
      padding-top: 8px;
    }

    .footer {
      margin-top: 18px;
      text-align: center;
      font-size: 12px;
      color: #555;
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }

      .card {
        width: 100%;
        border: 2px solid #111;
        margin: 0;
      }

      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  </style>
</head>

<body>
  <div class="card">
    <div class="header">
      <img src="${logoUrl}" class="logo" />

      <div class="school">
        <h1>CENNA School & College Pabbi</h1>
        <p>Pabbi, Nowshera</p>
        <p>Official Academic Result Card</p>
      </div>

      <div></div>
    </div>

    <div class="title">Student Result Card</div>

    <div class="info">
      <div class="info-row">
        <span class="label">Name:</span>
        <span class="value">${result.student?.user?.name || "N/A"}</span>
      </div>

      <div class="info-row">
        <span class="label">Adm No:</span>
        <span class="value">${result.student?.admissionNo || "N/A"}</span>
      </div>

      <div class="info-row">
        <span class="label">Father:</span>
        <span class="value">${result.student?.fatherName || "N/A"}</span>
      </div>

      <div class="info-row">
        <span class="label">Class:</span>
        <span class="value">${className}</span>
      </div>

      <div class="info-row">
        <span class="label">Exam:</span>
        <span class="value">${result.examType || "N/A"}</span>
      </div>

      <div class="info-row">
        <span class="label">Session:</span>
        <span class="value">${result.session || "N/A"}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Subject</th>
          <th>Total</th>
          <th>Obtained</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        ${marksRows}
      </tbody>
    </table>

    <div class="summary">
      <div>Total Marks <span>${result.totalMarks || 0}</span></div>
      <div>Obtained <span>${result.totalObtained || 0}</span></div>
      <div>Percentage <span>${result.percentage || 0}%</span></div>
      <div>Grade <span>${result.grade || "N/A"}</span></div>
    </div>

    <div class="result-status ${result.isPassed ? "pass" : "fail"}">
      ${result.isPassed ? "Passed" : "Failed"}
    </div>

    <div class="remarks">
      <strong>Teacher Remarks:</strong>
      ${result.remarks || "Good performance. Keep working hard."}
    </div>

    <div class="signatures">
      <div>Class Teacher</div>
      <div>Principal</div>
    </div>

    <div class="footer">
      Generated by CENNA School Management System — ${new Date().toLocaleDateString()}
    </div>
  </div>

  <script>
    window.onload = function () {
      window.print();
    };
  </script>
</body>
</html>
  `);

  printWindow.document.close();
};

  if (loading) return <PageLoader text="Loading results..." />;

  return (
    <section className="p-3 sm:p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
          Results Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View, filter, and manage student results.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.displayName || `${cls.name} - ${cls.section}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Exam Type
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          >
            {examTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <Input label="Session" value={session} onChange={setSession} />

        <Input
          label="Search"
          value={search}
          onChange={setSearch}
          placeholder="Student, admission no, grade..."
        />

        <button
          type="button"
          onClick={handleLoadResults}
          className="cursor-pointer self-end rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
        >
          Load Results
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-4 text-center">Position</th>
                  <th className="px-4 py-4 text-left">Student</th>
                  <th className="px-4 py-4 text-left">Class</th>
                  <th className="px-4 py-4 text-center">Obtained</th>
                  <th className="px-4 py-4 text-center">Total</th>
                  <th className="px-4 py-4 text-center">Percentage</th>
                  <th className="px-4 py-4 text-center">Grade</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-center font-bold">
                      {result.position || "-"}
                    </td>

                    <td className="px-4 py-4 font-semibold text-black">
                      {result.student?.user?.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {result.class?.displayName || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {result.totalObtained}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {result.totalMarks}
                    </td>

                    <td className="px-4 py-4 text-center font-bold">
                      {result.percentage}%
                    </td>

                    <td className="px-4 py-4 text-center font-bold">
                      {result.grade}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {result.isPassed ? "Pass" : "Fail"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedResult(result)}
                          className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(result)}
                          className="cursor-pointer rounded-lg bg-yellow-500 px-3 py-2 text-xs font-bold text-black hover:bg-yellow-400"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(result)}
                          className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrint(result)}
                          className="cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-500"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center font-semibold text-gray-500">
            No results found. Select filters and click Load Results.
          </div>
        )}
      </div>

      {selectedResult && (
        <Modal title="Result Details" onClose={() => setSelectedResult(null)}>
          <Info label="Student" value={selectedResult.student?.user?.name} />
          <Info label="Class" value={selectedResult.class?.displayName} />
          <Info label="Exam Type" value={selectedResult.examType} />
          <Info label="Session" value={selectedResult.session} />
          <Info label="Percentage" value={`${selectedResult.percentage}%`} />
          <Info label="Grade" value={selectedResult.grade} />
          <Info
            label="Status"
            value={selectedResult.isPassed ? "Pass" : "Fail"}
          />

          <div className="mt-5 overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-center">Obtained</th>
                  <th className="px-4 py-3 text-center">Max</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                </tr>
              </thead>

              <tbody>
                {selectedResult.marks?.map((mark) => (
                  <tr key={mark._id} className="border-b">
                    <td className="px-4 py-3 font-semibold">
                      {mark.subject?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">{mark.obtained}</td>
                    <td className="px-4 py-3 text-center">{mark.maxMarks}</td>
                    <td className="px-4 py-3 text-center font-bold">
                      {mark.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {editingResult && (
        <Modal title="Edit Result" onClose={() => setEditingResult(null)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Info label="Student" value={editingResult.student?.user?.name} />
            <Info label="Class" value={editingResult.class?.displayName} />
            <Info label="Exam Type" value={editingResult.examType} />
            <Info label="Session" value={editingResult.session} />

            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-center">Max Marks</th>
                    <th className="px-4 py-3 text-center">Obtained</th>
                  </tr>
                </thead>

                <tbody>
                  {editMarks.map((mark, index) => (
                    <tr key={mark.subject} className="border-b">
                      <td className="px-4 py-3 font-semibold">
                        {mark.subjectName}
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={mark.maxMarks}
                          onChange={(e) => {
                            const updated = [...editMarks];
                            updated[index].maxMarks = e.target.value;
                            setEditMarks(updated);
                          }}
                          className="w-full rounded-lg border px-3 py-2 text-center"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={mark.obtained}
                          onChange={(e) => {
                            const updated = [...editMarks];
                            updated[index].obtained = e.target.value;
                            setEditMarks(updated);
                          }}
                          className="w-full rounded-lg border px-3 py-2 text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Remarks
              </label>

              <textarea
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                rows={3}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black py-3 font-bold text-white hover:bg-gray-800"
            >
              Update Result
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function Input({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
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