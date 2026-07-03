"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch, FaUserGraduate } from "react-icons/fa";

import { fetchStudents } from "@/store/studentSlice";
import { fetchFees, generateFee } from "@/store/feeSlice";
import PageLoader from "@/components/ui/PageLoader";

const months = [
  { name: "January", num: 1 },
  { name: "February", num: 2 },
  { name: "March", num: 3 },
  { name: "April", num: 4 },
  { name: "May", num: 5 },
  { name: "June", num: 6 },
  { name: "July", num: 7 },
  { name: "August", num: 8 },
  { name: "September", num: 9 },
  { name: "October", num: 10 },
  { name: "November", num: 11 },
  { name: "December", num: 12 },
];

const initialForm = {
  studentId: "",
  month: "June",
  year: new Date().getFullYear(),
  monthNum: 6,
  monthlyFee: "",
  admissionFee: 0,
  examFee: 0,
  lateFine: 0,
  discount: 0,
  dueDate: "",
  notes: "",
};

export default function AccountantFeeChallansPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const studentIdFromUrl = searchParams.get("studentId") || "";

  const [form, setForm] = useState({
    ...initialForm,
    studentId: studentIdFromUrl,
  });

  const [search, setSearch] = useState("");

  const { students = [], loading: studentsLoading } = useSelector(
    (state) => state.students || {}
  );

  const { fees = [], loading, error } = useSelector(
    (state) => state.fees || {}
  );

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchFees());
  }, [dispatch]);

  const selectedStudent = students.find(
    (student) => student._id === form.studentId
  );

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return students;

    return students.filter((student) => {
      const name = student.user?.name?.toLowerCase() || "";
      const admissionNo = student.admissionNo?.toLowerCase() || "";
      const className = student.class?.displayName?.toLowerCase() || "";

      return (
        name.includes(value) ||
        admissionNo.includes(value) ||
        className.includes(value)
      );
    });
  }, [students, search]);

  const totalAmount =
    Number(form.monthlyFee || 0) +
    Number(form.admissionFee || 0) +
    Number(form.examFee || 0) +
    Number(form.lateFine || 0) -
    Number(form.discount || 0);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "month") {
      const selectedMonth = months.find((item) => item.name === value);

      setForm((prev) => ({
        ...prev,
        month: value,
        monthNum: selectedMonth?.num || 1,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectStudent = (student) => {
    setForm((prev) => ({
      ...prev,
      studentId: student._id,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.studentId) {
      toast.error("Please select student");
      return;
    }

    if (!form.monthlyFee || Number(form.monthlyFee) <= 0) {
      toast.error("Monthly fee is required");
      return;
    }

    if (!form.dueDate) {
      toast.error("Due date is required");
      return;
    }

    try {
      const result = await dispatch(
        generateFee({
          ...form,
          year: Number(form.year),
          monthNum: Number(form.monthNum),
          monthlyFee: Number(form.monthlyFee),
          admissionFee: Number(form.admissionFee || 0),
          examFee: Number(form.examFee || 0),
          lateFine: Number(form.lateFine || 0),
          discount: Number(form.discount || 0),
        })
      ).unwrap();

      toast.success("Fee challan generated successfully");

      if (result?.fee) {
        printChallan(result.fee);
      }

      setForm({
        ...initialForm,
        studentId: "",
      });

      dispatch(fetchFees());
    } catch (error) {
      toast.error(error || "Failed to generate challan");
    }
  };

  if (studentsLoading) {
    return <PageLoader text="Loading students..." />;
  }

  return (
    <section className="space-y-6 p-3 sm:p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
          Fee Challans
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Generate and print student fee challans.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-extrabold text-black">
            Select Student
          </h2>

          <div className="relative mt-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student..."
              className="w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="mt-5 max-h-[550px] space-y-3 overflow-y-auto pr-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student._id}
                  type="button"
                  onClick={() => handleSelectStudent(student)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${form.studentId === student._id
                      ? "border-black bg-yellow-50"
                      : "bg-gray-50 hover:bg-white hover:shadow-sm"
                    }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                      <FaUserGraduate />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-extrabold text-black">
                        {student.user?.name || "N/A"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {student.admissionNo || "N/A"} •{" "}
                        {student.class?.displayName || "Class N/A"}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
                No students found.
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-5 shadow-sm xl:col-span-2"
        >
          <h2 className="text-xl font-extrabold text-black">
            Generate Challan
          </h2>

          {selectedStudent ? (
            <div className="mt-4 rounded-2xl bg-yellow-50 p-4">
              <p className="font-extrabold text-black">
                {selectedStudent.user?.name || "Student"}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {selectedStudent.admissionNo || "N/A"} •{" "}
                {selectedStudent.class?.displayName || "Class N/A"}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-500">
              Select student from the left side.
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select
              label="Month"
              name="month"
              value={form.month}
              onChange={handleChange}
            >
              {months.map((month) => (
                <option key={month.name} value={month.name}>
                  {month.name}
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
              label="Monthly Fee"
              name="monthlyFee"
              type="number"
              value={form.monthlyFee}
              onChange={handleChange}
              placeholder="5000"
            />

            <Input
              label="Admission Fee"
              name="admissionFee"
              type="number"
              value={form.admissionFee}
              onChange={handleChange}
            />

            <Input
              label="Exam Fee"
              name="examFee"
              type="number"
              value={form.examFee}
              onChange={handleChange}
            />

            <Input
              label="Late Fine"
              name="lateFine"
              type="number"
              value={form.lateFine}
              onChange={handleChange}
            />

            <Input
              label="Discount"
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleChange}
            />

            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="mt-4 w-full rounded-2xl border px-4 py-3 outline-none focus:border-black"
            rows={3}
          />

          <div className="mt-5 rounded-2xl bg-black p-5 text-white">
            <p className="text-sm font-bold text-yellow-400">
              Total Challan Amount
            </p>
            <h3 className="mt-1 text-3xl font-extrabold">
              Rs. {totalAmount > 0 ? totalAmount : 0}
            </h3>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-yellow-500 py-3 font-extrabold text-black hover:bg-yellow-400 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate & Print Challan"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-black">
          Recent Challans
        </h2>

        {fees.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fees.slice(0, 9).map((fee) => (
              <div key={fee._id} className="rounded-2xl border bg-gray-50 p-5">
                <p className="text-sm font-bold text-gray-500">
                  {fee.challanNo || "No Challan No"}
                </p>

                <h3 className="mt-2 font-extrabold text-black">
                  {fee.student?.user?.name || "Student"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {fee.month} {fee.year}
                </p>

                <p className="mt-3 text-lg font-extrabold text-black">
                  Rs. {fee.totalAmount}
                </p>

                <button
                  type="button"
                  onClick={() => printChallan(fee)}
                  className="mt-4 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
                >
                  Print
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            No challans generated yet.
          </div>
        )}
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-black"
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
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-black"
      >
        {children}
      </select>
    </div>
  );
}

function printChallan(fee) {
  const balance = Math.max(
    Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
    0
  );

  const w = window.open("", "_blank");

  w.document.write(`
    <html>
      <head>
        <title>Fee Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 25px;
            color: #111;
          }

          .slip {
            max-width: 850px;
            margin: auto;
            padding: 25px;
            border: 1px solid #111;
          }

          .center {
            text-align: center;
          }

          h2 {
            font-size: 20px;
            margin: 0;
            text-decoration: underline;
          }

          p {
            margin: 4px 0;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 25px;
            font-weight: bold;
            font-size: 13px;
          }

          .box {
            border: 1px solid #ddd;
            padding: 8px;
            background: #f8fafc;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            font-size: 13px;
          }

          th, td {
            border: 1px solid #111;
            padding: 8px;
          }

          th {
            background: #f1f5f9;
          }

          .right {
            text-align: right;
          }

          .bold {
            font-weight: bold;
          }

          .green {
            color: #15803d;
          }

          .red {
            color: #dc2626;
          }

          .note {
            margin-top: 15px;
            font-size: 12px;
            font-weight: bold;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 80px;
            margin-top: 60px;
            font-weight: bold;
          }

          .signatures div {
            border-top: 1px solid #111;
            text-align: center;
            padding-top: 8px;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="slip">
          <div class="center">
            <h2>CENNA SCHOOL & COLLEGE PABBI NSR</h2>
            <p><u>0923-529166/466</u></p>
            <p><u>Pabbi Nowshera</u></p>
          </div>

          <div class="grid">
            <div class="box">Receipt No: ${fee.receiptNo || "N/A"}</div>
            <div class="box">Challan No: ${fee.challanNo || "N/A"}</div>
            <div class="box">Admc No: ${fee.student?.admissionNo || "N/A"}</div>
            <div class="box">Student Name: ${fee.student?.user?.name || "N/A"}</div>
            <div class="box">Father Name: ${fee.student?.fatherName || "N/A"}</div>
            <div class="box">Class-Sec: ${
              fee.student?.class?.displayName ||
              fee.class?.displayName ||
              "N/A"
            }</div>
            <div class="box">Month: ${fee.month} ${fee.year}</div>
            <div class="box">Paid Date: ${
              fee.paidDate
                ? new Date(fee.paidDate).toLocaleDateString()
                : "N/A"
            }</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Head</th>
                <th class="right">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr><td>Monthly Fee</td><td class="right">Rs. ${fee.monthlyFee || 0}</td></tr>
              <tr><td>Admission Fee</td><td class="right">Rs. ${fee.admissionFee || 0}</td></tr>
              <tr><td>Exam Fee</td><td class="right">Rs. ${fee.examFee || 0}</td></tr>
              <tr><td>Late Fine</td><td class="right">Rs. ${fee.lateFine || 0}</td></tr>
              <tr><td>Discount</td><td class="right">Rs. ${fee.discount || 0}</td></tr>
              <tr class="bold"><td>Total Amount</td><td class="right">Rs. ${fee.totalAmount || 0}</td></tr>
              <tr class="bold green"><td>Paid Amount</td><td class="right">Rs. ${fee.paidAmount || 0}</td></tr>
              <tr class="bold red"><td>Remaining Balance</td><td class="right">Rs. ${balance}</td></tr>
            </tbody>
          </table>

          <p class="note">
            NOTE: FOR ANY QUERY IN THE SLIP PLEASE CONTACT WITH SCHOOL
            ADMINISTRATION IN WORKING HOURS. THANKS
          </p>

          <div class="signatures">
            <div>Accountant</div>
            <div>Principal</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

  w.document.close();
}