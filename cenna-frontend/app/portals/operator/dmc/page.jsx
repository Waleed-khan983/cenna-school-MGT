"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPrint, FaSearch, FaUserGraduate } from "react-icons/fa";

import { fetchStudents } from "@/store/studentSlice";
import { fetchStudentResults } from "@/store/resultSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function OperatorDMCPage() {
  const dispatch = useDispatch();
  const printRef = useRef(null);

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [promotedTo, setPromotedTo] = useState("");

  const { students = [], loading: studentsLoading } = useSelector(
    (state) => state.students || {}
  );

  const { results = [], loading: resultsLoading } = useSelector(
    (state) => state.results || {}
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) {
        dispatch(
          fetchStudents({
            search: search.trim(),
            limit: 20,
          })
        );
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, search]);

  useEffect(() => {
    if (selectedStudent?._id) {
      dispatch(fetchStudentResults(selectedStudent._id));
      setSelectedResultId("");
    }
  }, [dispatch, selectedStudent]);

  const selectedResult = results.find(
    (item) => item._id === selectedResultId
  );

  const studentForDMC =
    selectedResult?.student || selectedStudent;

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearch(student?.user?.name || "");
  };

  const printDMC = () => {
    if (!selectedResult) return;

    const html = printRef.current.innerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>DMC</title>
          <style>${dmcStyles}</style>
        </head>

        <body>
          ${html}

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    win.document.close();
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <style jsx global>{dmcStyles}</style>

      <div>
        <h1 className="text-3xl font-extrabold text-black">DMC</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search student, select result, and print Detail Marks Certificate.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold text-black">
            Generate DMC
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Search Student
              </label>

              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedStudent(null);
                    setSelectedResultId("");
                  }}
                  placeholder="Search by name, admission no, or roll no..."
                  className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
                />
              </div>

              {search.trim().length > 0 && !selectedStudent && (
                <div className="mt-3 max-h-72 overflow-auto rounded-2xl border bg-white">
                  {studentsLoading ? (
                    <p className="p-4 text-sm font-semibold text-gray-500">
                      Searching students...
                    </p>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className="flex w-full cursor-pointer items-start gap-3 border-b p-4 text-left hover:bg-yellow-50"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                          <FaUserGraduate />
                        </div>

                        <div>
                          <p className="font-extrabold text-black">
                            {student.user?.name || "Student"}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            Adm No: {student.admissionNo || "N/A"} | Roll No:{" "}
                            {student.rollNumber || "N/A"}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            Class:{" "}
                            {student.class?.displayName ||
                              `${student.class?.name || ""} ${
                                student.class?.section || ""
                              }` ||
                              "N/A"}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-sm font-semibold text-gray-500">
                      No students found.
                    </p>
                  )}
                </div>
              )}
            </div>

            {selectedStudent && (
              <div className="rounded-2xl border bg-yellow-50 p-4">
                <p className="text-xs font-bold uppercase text-yellow-700">
                  Selected Student
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-black">
                  {selectedStudent.user?.name || "Student"}
                </h3>

                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Adm No: {selectedStudent.admissionNo || "N/A"} | Father:{" "}
                  {selectedStudent.fatherName || "N/A"}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-600">
                  Class:{" "}
                  {selectedStudent.class?.displayName ||
                    `${selectedStudent.class?.name || ""} ${
                      selectedStudent.class?.section || ""
                    }` ||
                    "N/A"}
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Select Result
              </label>

              <select
                value={selectedResultId}
                onChange={(e) => setSelectedResultId(e.target.value)}
                disabled={!selectedStudent || resultsLoading}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">
                  {resultsLoading ? "Loading results..." : "Select result"}
                </option>

                {results.map((result) => (
                  <option key={result._id} value={result._id}>
                    {result.examType} - {result.session}
                    {result.examMonth ? ` - ${result.examMonth}` : ""} |{" "}
                    {result.totalObtained}/{result.totalMarks}
                  </option>
                ))}
              </select>

              {selectedStudent && !resultsLoading && results.length === 0 && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  No result found for this student.
                </p>
              )}
            </div>

            <Input
              label="Issued Date"
              type="date"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />

            <Input
              label="Promoted To"
              value={promotedTo}
              onChange={(e) => setPromotedTo(e.target.value)}
              placeholder="Example: 7th"
            />

            <button
              type="button"
              onClick={printDMC}
              disabled={!selectedResult}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              <FaPrint /> Print DMC
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black">DMC Preview</h2>

            <button
              type="button"
              onClick={printDMC}
              disabled={!selectedResult}
              className="cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              Print
            </button>
          </div>

          <div className="overflow-auto rounded-2xl bg-gray-100 p-6">
            <div ref={printRef}>
              {selectedResult ? (
                <DMCPrint
                  result={selectedResult}
                  student={studentForDMC}
                  issuedDate={issuedDate}
                  promotedTo={promotedTo}
                />
              ) : (
                <div className="rounded-2xl bg-white p-10 text-center font-semibold text-gray-500">
                  Search student and select result to preview DMC.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DMCPrint({ result, student, issuedDate, promotedTo }) {
  const marks = result?.marks || [];

  const studentName =
    student?.user?.name ||
    result?.student?.user?.name ||
    "________";

  const fatherName =
    student?.fatherName ||
    result?.student?.fatherName ||
    "________";

  const admissionNo =
    student?.admissionNo ||
    result?.student?.admissionNo ||
    "________";

  const rollNumber =
    student?.rollNumber ||
    result?.student?.rollNumber ||
    "________";

  const className =
    result?.class?.displayName ||
    student?.class?.displayName ||
    `${student?.class?.name || ""} ${student?.class?.section || ""}` ||
    "________";

  const section =
    student?.section ||
    result?.class?.section ||
    "________";

  return (
    <div className="dmc-page">
      <div className="dmc-header">
        <img src="/images/logo.jpg" alt="CENNA Logo" />

        <div>
          <h1>CENNA</h1>
          <p>School & College</p>
          <p>Khudrezai, Pabbi, Nowshera, Khyber Pakhtunkhwa, Pakistan</p>
        </div>
      </div>

      <h2>DETAIL MARKS CERTIFICATE (DMC)</h2>

      <h3>
        {result.examType?.toUpperCase()} EXAM: {result.session}
      </h3>

      <div className="student-info">
        <Info label="Adm. No" value={admissionNo} />
        <Info label="Roll No" value={rollNumber} />
        <Info label="Name" value={studentName} />
        <Info label="Father Name" value={fatherName} />
        <Info label="Class" value={className} />
        <Info label="Section" value={section} />
      </div>

      <table className="dmc-table">
        <thead>
          <tr>
            <th>Subjects</th>
            <th>Total Marks</th>
            <th>Obtained Marks</th>
            <th>Result</th>
            <th>AVG / Grade</th>
            <th>Class Position</th>
          </tr>
        </thead>

        <tbody>
          {marks.map((mark, index) => {
            const pct =
              mark.maxMarks > 0
                ? Math.round((mark.obtained / mark.maxMarks) * 100)
                : 0;

            return (
              <tr key={index}>
                <td>{mark.subject?.name || "Subject"}</td>
                <td>{mark.maxMarks}</td>
                <td>{mark.obtained}</td>
                <td>{mark.isPassed ? "PASS" : "FAIL"}</td>
                <td>{`${pct} / ${mark.grade || "N/A"}`}</td>
                <td>{result.position || "N/A"}</td>
              </tr>
            );
          })}

          <tr className="total-row">
            <td>Total</td>
            <td>{result.totalMarks || 0}</td>
            <td>{result.totalObtained || 0}</td>
            <td>{result.isPassed ? "PASSED" : "FAILED"}</td>
            <td>{result.grade || "N/A"}</td>
            <td>{result.position || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <div className="summary-row">
        <p>
          <b>Percentage:</b> {result.percentage || 0}%
        </p>
        <p>
          <b>Grade:</b> {result.grade || "N/A"}
        </p>
        <p>
          <b>Position:</b> {result.position || "N/A"}
        </p>
      </div>

      <div className="remarks">
        <p>
          <b>Remarks:</b>{" "}
          <span>
            {result.remarks ||
              (result.isPassed ? "Satisfactory" : "Needs Improvement")}
          </span>
        </p>

        <p>
          <b>Promoted to:</b> <span>{promotedTo || "________"}</span>
        </p>
      </div>

      <div className="signatures">
        <div>
          <span></span>
          <p>Class Teacher Signature</p>
        </div>

        <div>
          <span></span>
          <p>Controller of Examination</p>
        </div>
      </div>

      <div className="issue">
        <p>
          <b>Issued Date:</b>{" "}
          {issuedDate
            ? new Date(issuedDate).toLocaleDateString("en-GB")
            : "________"}
        </p>
      </div>

      <p className="note">
        <b>Note:</b> Cutting or overwriting in DMC is not allowed otherwise the
        DMC will not be acceptable.
      </p>

      <div className="footer-strip">
        <span>Complaint & Suggestion:</span>
        <span>+92-923-529166, 529266, 529366, 529466</span>
        <span>institute.cenna@gmail.com</span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <b>{label}:</b> <span>{value || "________"}</span>
    </p>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

const dmcStyles = `
  .dmc-page {
    width: 794px;
    min-height: 1123px;
    background: white;
    margin: 0 auto;
    padding: 55px 65px 45px;
    box-sizing: border-box;
    color: #111;
    font-family: "Times New Roman", serif;
    position: relative;
  }

  .dmc-header {
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 70px;
  }

  .dmc-header img {
    width: 150px;
    height: 115px;
    object-fit: contain;
  }

  .dmc-header h1 {
    margin: 0;
    font-size: 74px;
    line-height: 0.9;
    letter-spacing: 4px;
    font-weight: 900;
  }

  .dmc-header p {
    margin: 4px 0;
    font-size: 20px;
    font-weight: 700;
  }

  .dmc-page h2 {
    margin: 0;
    text-align: center;
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .dmc-page h3 {
    margin: 16px 0 20px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    text-decoration: underline;
  }

  .student-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px 18px;
    margin-bottom: 16px;
    font-size: 17px;
  }

  .student-info p {
    margin: 0;
  }

  .student-info span {
    display: inline-block;
    min-width: 135px;
    border-bottom: 1px solid #111;
    text-align: center;
    padding: 0 8px;
    font-weight: 700;
  }

  .dmc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
  }

  .dmc-table th,
  .dmc-table td {
    border: 1.5px solid #111;
    padding: 7px 8px;
    text-align: center;
  }

  .dmc-table th:first-child,
  .dmc-table td:first-child {
    text-align: left;
  }

  .dmc-table th {
    font-weight: 700;
    background: #f2f2f2;
  }

  .total-row td {
    font-weight: 900;
  }

  .summary-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 12px;
    font-size: 17px;
  }

  .summary-row p {
    margin: 0;
    border: 1px solid #111;
    padding: 7px 10px;
    text-align: center;
  }

  .remarks {
    margin-top: 12px;
    font-size: 18px;
  }

  .remarks p {
    margin: 9px 0;
  }

  .signatures {
    position: absolute;
    left: 65px;
    right: 65px;
    bottom: 150px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 700;
  }

  .signatures div {
    width: 250px;
    text-align: center;
  }

  .signatures span {
    display: block;
    border-bottom: 2px solid #111;
    height: 35px;
    margin-bottom: 8px;
  }

  .issue {
    position: absolute;
    left: 65px;
    bottom: 105px;
    font-size: 18px;
  }

  .note {
    position: absolute;
    left: 65px;
    right: 65px;
    bottom: 65px;
    font-size: 16px;
  }

  .footer-strip {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 34px;
    display: grid;
    grid-template-columns: 230px 1fr 250px;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
  }

  .footer-strip span:nth-child(1) {
    background: #222;
    color: white;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }

  .footer-strip span:nth-child(2) {
    background: #d39b16;
    color: #111;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }

  .footer-strip span:nth-child(3) {
    background: #6f3c7b;
    color: white;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }

    body {
      margin: 0;
      background: white;
    }

    .dmc-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      page-break-after: always;
    }
  }
`;