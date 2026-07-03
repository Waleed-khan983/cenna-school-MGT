"use client";

import { useMemo, useState } from "react";
import { FaPrint, FaUndo, FaFileAlt } from "react-icons/fa";

const certificateTypes = [
  // { key: "concern", title: "To Whom It May Concern" },
  { key: "character", title: "Character Certificate" },
  { key: "service", title: "Service Certificate" },
  { key: "presence", title: "Presence Certificate" },
  { key: "provisional", title: "Provisional Certificate" },
  { key: "schoolLeaving", title: "School Leaving Certificate" },
  { key: "collegeLeaving", title: "College Leaving Certificate" },
  { key: "birth", title: "Birth Certificate" },
  { key: "appointment", title: "Appointment Letter" },
];

const initialForm = {
  admissionNo: "",
  serialNo: "01",
  rollNo: "",
  date: "",
  name: "",
  fatherName: "",
  relation: "S/O",
  genderTitle: "Mr.",
  village: "",
  tehsil: "Pabbi",
  district: "Nowshera",
  province: "KP",
  className: "",
  program: "",
  marks: "",
  totalMarks: "1200",
  percentage: "",
  grade: "",
  boardRollNo: "",
  boardName: "Board of Intermediate & Secondary Education Mardan",
  dob: "",
  dobWords: "",
  fromDate: "",
  toDate: "",
  position: "",
  joiningDate: "",
  joiningDateWords: "",
};

export default function OperatorCertificatesPage() {
  const [type, setType] = useState("concern");
  const [form, setForm] = useState(initialForm);

  const selected = certificateTypes.find((item) => item.key === type);

  const preview = useMemo(() => {
    return generateCertificate(type, form);
  }, [type, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (key) => {
    setType(key);
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>${selected?.title}</title>
          <style>${printStyles}</style>
        </head>

        <body>
          ${preview}
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
      <div>
        <h1 className="text-3xl font-extrabold text-black">Certificates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select certificate type, enter details, preview and print.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-5 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-black">
            Certificate Types
          </h2>

          <div className="grid gap-3">
            {certificateTypes.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleTypeChange(item.key)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                  type === item.key
                    ? "border-black bg-yellow-50 text-black"
                    : "bg-gray-50 text-gray-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                <FaFileAlt />
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <form className="rounded-3xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-extrabold text-black">
              Generate {selected?.title}
            </h2>

            <div className="grid gap-4">
              <Input label="Admission No" name="admissionNo" value={form.admissionNo} onChange={handleChange} />
              <Input label="Serial No" name="serialNo" value={form.serialNo} onChange={handleChange} />
              <Input label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} />
              <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />

              <Select label="Title" name="genderTitle" value={form.genderTitle} onChange={handleChange}>
                <option>Mr.</option>
                <option>Miss.</option>
                <option>Mrs.</option>
              </Select>

              <Select label="Relation" name="relation" value={form.relation} onChange={handleChange}>
                <option>S/O</option>
                <option>D/O</option>
              </Select>

              <Input label="Student / Person Name" name="name" value={form.name} onChange={handleChange} />
              <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} />

              <Input label="Village" name="village" value={form.village} onChange={handleChange} />
              <Input label="Tehsil" name="tehsil" value={form.tehsil} onChange={handleChange} />
              <Input label="District" name="district" value={form.district} onChange={handleChange} />
              <Input label="Province" name="province" value={form.province} onChange={handleChange} />

              {(type === "concern" || type === "provisional") && (
                <>
                  <Input label="Program / Exam" name="program" value={form.program} onChange={handleChange} />
                  <Input label="Expected Percentage" name="percentage" value={form.percentage} onChange={handleChange} />
                  <Input label="Marks Obtained" name="marks" value={form.marks} onChange={handleChange} />
                  <Input label="Total Marks" name="totalMarks" value={form.totalMarks} onChange={handleChange} />
                  <Input label="Grade" name="grade" value={form.grade} onChange={handleChange} />
                  <Input label="Board Roll No" name="boardRollNo" value={form.boardRollNo} onChange={handleChange} />
                </>
              )}

              {(type === "presence" || type === "schoolLeaving" || type === "collegeLeaving" || type === "birth" || type === "provisional") && (
                <>
                  <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
                  <Input label="Date of Birth in Words" name="dobWords" value={form.dobWords} onChange={handleChange} />
                </>
              )}

              {(type === "presence" || type === "schoolLeaving" || type === "collegeLeaving") && (
                <Input label="Class / Program" name="className" value={form.className} onChange={handleChange} />
              )}

              {(type === "schoolLeaving" || type === "collegeLeaving" || type === "service") && (
                <>
                  <Input label="From Date" name="fromDate" type="date" value={form.fromDate} onChange={handleChange} />
                  <Input label="To Date" name="toDate" type="date" value={form.toDate} onChange={handleChange} />
                </>
              )}

              {type === "service" && (
                <Input label="Position / Designation" name="position" value={form.position} onChange={handleChange} />
              )}

              {type === "appointment" && (
                <>
                  <Input label="Position / Designation" name="position" value={form.position} onChange={handleChange} />
                  <Input label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
                  <Input label="Joining Date in Words" name="joiningDateWords" value={form.joiningDateWords} onChange={handleChange} />
                </>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold hover:bg-gray-50"
              >
                <FaUndo /> Reset
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-gray-800"
              >
                <FaPrint /> Print
              </button>
            </div>
          </form>

          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-black">
                Certificate Preview
              </h2>

              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800"
              >
                Print Certificate
              </button>
            </div>

            <div className="max-h-[850px] overflow-auto rounded-2xl border bg-gray-100 p-4">
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>
        </div>
      </div>
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

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
}

function u(value) {
  return `<span class="under">${value || "________"}</span>`;
}

function generateCertificate(type, f) {
  if (type === "character") return characterCertificate(f);
  if (type === "service") return serviceCertificate(f);
  if (type === "presence") return presenceCertificate(f);
  if (type === "provisional") return provisionalCertificate(f);
  if (type === "schoolLeaving") return leavingCertificate(f, "SCHOOL LEAVING CERTIFICATE");
  if (type === "collegeLeaving") return leavingCertificate(f, "COLLEGE LEAVING CERTIFICATE");
  if (type === "birth") return birthCertificate(f);
  if (type === "appointment") return appointmentLetter(f);

  return concernCertificate(f);
}

function base(title, body, topInfo = "") {
  return `
    <div class="certificate">
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>

      <h1>${title}</h1>

      ${topInfo}

      <div class="content">
        ${body}
      </div>

      <div class="signature">
        <p>Certification & Signature</p>
        <p>PRINCIPAL</p>
        <p>CENNA PUBLIC SCHOOL & COLLEGE</p>
      </div>
    </div>
  `;
}

function concernCertificate(f) {
  const top = `
    <div class="top-line">
      <span>Adm No. ${f.admissionNo || "____"}</span>
      <span>Date: ${formatDate(f.date) || "____"}</span>
    </div>
  `;

  const body = `
    <p>
      <span class="indent">1</span>
      This is certify that ${u(`${f.genderTitle} ${f.name}`)} ${f.relation}
      ${u(`Mr. ${f.fatherName}`)} resident of village <b>${f.village || "____"}</b>,
      Tehsil <b>${f.tehsil || "____"}</b>, District <b>${f.district || "____"}</b>
      was a regular student of <b>CENNA PUBLIC & COLLEGE</b> Pabbi Nowshera.
    </p>

    <p>
      On the basis of ${f.genderTitle === "Miss." ? "her" : "his"} academic performance,
      it is expected that ${f.genderTitle === "Miss." ? "she" : "he"} will be able to score
      at least ${u(`${f.percentage || "85"}%`)} marks out of ${u(f.totalMarks || "1200")}
      marks in ${f.program || "HSSC Part-II"} Examination from ${f.boardName}
      under Board Roll No ${u(f.boardRollNo)}.
    </p>
  `;

  return base("TO WHOM IT MAY CONCERN", body, top);
}

function characterCertificate(f) {
  const top = `
    <div class="top-line italic">
      <span>ADMISSION NO: ${f.admissionNo || "____"}</span>
      <span>Roll No: ${f.rollNo || "____"}</span>
      <span>DATE: ${formatDate(f.date) || "____"}</span>
    </div>
  `;

  const body = `
    <p>
      This document is to certify that ${u(`${f.genderTitle}${f.name}`)}
      ${f.relation} ${u(`Mr.${f.fatherName}`)} resident of village
      ${u(f.village)}, tehsil ${u(f.tehsil)} district ${u(f.district)}, ${u(f.province)},
      has remained a regular student of this Institute.
    </p>

    <p>
      The Institute accepts and confirms that ${f.genderTitle === "Miss." ? "she" : "he"}
      had good and high moral character during ${f.genderTitle === "Miss." ? "her" : "his"} stay here.
    </p>
  `;

  return base("CHARACTER CERTIFICATE", body, top);
}

function serviceCertificate(f) {
  const top = `
    <div class="date-right italic">DATE: ${formatDate(f.date) || "____"}</div>
  `;

  const body = `
    <p>
      This is to certify that ${u(`${f.genderTitle}${f.name}`)}
      ${f.relation} ${u(`Mr. ${f.fatherName}`)}, resident of ${u(f.village)},
      tehsil ${u(f.tehsil)}, district ${u(f.district)}, was playing the role of a
      ${u(f.position || "Teacher")} in this institute since ${u(formatDate(f.fromDate))}
      till ${u(formatDate(f.toDate) || "date")}.
    </p>

    <p>
      According to our record ${f.genderTitle === "Miss." ? "she" : "he"} is found
      <b>Punctual, Dutiful, and Responsible.</b> The institute is hopeful for
      ${f.genderTitle === "Miss." ? "her" : "his"} bright and successful future.
    </p>
  `;

  return base("SERVICE CERTIFICATE", body, top);
}

function presenceCertificate(f) {
  const top = `
    <div class="top-line italic">
      <span>ADMISSION NO:${f.admissionNo || "____"}</span>
      <span>DATE: ${formatDate(f.date) || "____"}</span>
    </div>
  `;

  const body = `
    <p>
      This is to certify that ${u(`${f.genderTitle}${f.name}`)}
      ${f.relation} ${u(`Mr.${f.fatherName}`)}, resident of village
      ${u(f.village)} ${f.tehsil} (${f.district}), is a regular student of this
      Institute. ${f.genderTitle === "Miss." ? "She" : "He"} is reading in
      ${f.className || "____"}.
    </p>

    <p>
      According to our record, ${f.genderTitle === "Miss." ? "her" : "his"}
      <b>Date Of Birth</b> is ${u(f.dobWords || formatDate(f.dob))}.
      The Institute wish ${f.genderTitle === "Miss." ? "her" : "him"} best of Luck.
    </p>
  `;

  return base("PRESENCE CERTIFICATE", body, top);
}

function provisionalCertificate(f) {
  const top = `
    <div class="top-line italic">
      <span>ADMISSION NO: ${f.admissionNo || "____"}</span>
      <span>Roll No: ${f.rollNo || "____"}</span>
      <span>DATE: ${formatDate(f.date) || "____"}</span>
    </div>
  `;

  const body = `
    <p>
      This document is to certify that ${u(`${f.genderTitle} ${f.name}`)}
      ${f.relation} ${u(`Mr. ${f.fatherName}`)} appeared in the SSC Examination,
      conducted by the Board of Intermediate and Secondary Education Mardan,
      held in ${f.program || "April/May"}. According to the preliminary result
      statement supplied by the board, ${f.genderTitle === "Miss." ? "she" : "he"}
      has passed the said examination.
    </p>

    <p class="subhead">His particulars are as under:</p>

    <table class="particulars">
      <tr><td>Date of Birth</td><td>:</td><td>${u(f.dobWords || formatDate(f.dob))}</td></tr>
      <tr><td>Marks Obtained</td><td>:</td><td>${u(`${f.marks || "___"} out of ${f.totalMarks || "1200"}`)}</td></tr>
      <tr><td>Grade</td><td>:</td><td>${f.grade || "___"}</td></tr>
    </table>

    <p class="subhead under">Subjects Passed:-</p>

    <div class="subjects">
      <span>1. English</span><span>2. Urdu</span><span>3. Islamiyat</span>
      <span>4. Pak. Studies</span><span>5. Physics</span><span>6. Chemistry</span>
      <span>7. Biology</span><span>8. Mathematics</span><span>9. Mutaliae Quran-E-Hakeem</span>
    </div>
  `;

  return base("PROVISIONAL CERTIFICATE", body, top);
}

function leavingCertificate(f, title) {
  const top = `
    <div class="top-line italic">
      <span>ADMISSION NO: ${f.admissionNo || "____"}</span>
      <span>S.NO: ${f.serialNo || "01"}</span>
      <span>DATE: ${formatDate(f.date) || "____"}</span>
    </div>
  `;

  const body = `
    <p>
      This document is to certify that ${u(`${f.genderTitle} ${f.name}`)}
      ${f.relation} ${u(`${f.genderTitle === "Miss." ? "Mr." : "Mr."} ${f.fatherName}`)}
      resident of village ${u(f.village)}, district ${u(`${f.district}, ${f.province}`)},
      attended this institute from ${u(formatDate(f.fromDate))} till
      ${u(formatDate(f.toDate))}. His date of birth, according to our record,
      is ${u(f.dobWords || formatDate(f.dob))}. He has cleared all his dues.
      Furthermore, he has Passed his ${f.className || "____"} Examination.
    </p>

    <p>
      He is allowed on the above date to withdraw his name on his own wish.
    </p>
  `;

  return base(title, body, top);
}

function birthCertificate(f) {
  const body = `
    <table class="birth-table">
      <tr><td>Admission No.</td><td>${f.admissionNo || "____"}</td><td>S. No.</td><td>${f.serialNo || "____"}</td></tr>
    </table>

    <p>This is to certify that ${u(f.name)}</p>
    <p>Son of ${u(f.fatherName)}</p>
    <p>Resident of village ${u(f.village)}</p>
    <p>is a regular Student of ${u("CENNA SCHOOL & COLLEGE PABBI NSR")}</p>
    <p>His/Her Date of Birth is ${u(formatDate(f.dob))} (${u(f.dobWords)})</p>
    <p>according to the record of this School/College.</p>

    <div class="birth-bottom">
      <span>Dated: ${formatDate(f.date) || "____"}</span>
      <span>(Office Seal)</span>
      <span>Signed: __________ Principal</span>
    </div>
  `;

  return base("BIRTH CERTIFICATE", body);
}

function appointmentLetter(f) {
  const top = `
    <div class="date-right">
      ${formatDate(f.date) || "____"}<br/>
      The Institute Cenna<br/>
      Pabbi, Nowshera, KP,<br/>
      Pakistan.
    </div>
  `;

  const body = `
    <h2 class="appointment-title">Appointment</h2>

    <p><b>Respected ${f.genderTitle} ${f.name}!</b></p>

    <p>
      The institute wants to inform you that you are being selected by the
      Executive Body with a lot of Congratulations and appreciations.
    </p>

    <p>
      You may join the institute from ${f.joiningDateWords || formatDate(f.joiningDate)}
      on permanent Base.
    </p>

    <p>
      You are requested to read out the Institutes Oath as well as all rules
      regulation and submit all your documents.
    </p>

    <p class="thanks">Thanks</p>
  `;

  return base("", body, top).replace("<h1></h1>", "");
}

const printStyles = `
  body {
    margin: 0;
    background: white;
    font-family: Arial, sans-serif;
  }

  .certificate {
    position: relative;
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    background: white;
    padding: 190px 70px 80px;
    box-sizing: border-box;
    color: #111;
    font-family: Arial, sans-serif;
  }

  h1 {
    margin: 0 0 70px;
    text-align: center;
    font-size: 31px;
    text-decoration: underline;
    font-weight: 700;
    text-transform: uppercase;
  }

  .top-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 55px;
    font-size: 17px;
  }

  .date-right {
    text-align: right;
    margin-bottom: 70px;
    font-size: 17px;
    line-height: 1.6;
  }

  .italic {
    font-style: italic;
    font-weight: 600;
  }

  .content {
    font-size: 19px;
    line-height: 1.8;
    text-align: justify;
  }

  .content p {
    margin: 0 0 22px;
  }

  .indent {
    display: inline-block;
    width: 42px;
    text-align: center;
  }

  .under {
    text-decoration: underline;
    font-weight: 700;
  }

  .subhead {
    margin-top: 40px !important;
    font-weight: 700;
  }

  .subjects {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px 30px;
    margin-top: 35px;
    font-size: 17px;
  }

  .particulars {
    margin: 20px 0 35px 50px;
    font-size: 18px;
    border-collapse: collapse;
  }

  .particulars td {
    padding: 8px 18px;
  }

  .birth-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 55px;
    font-size: 16px;
  }

  .birth-table td {
    border: 1px solid #111;
    padding: 8px;
  }

  .birth-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 160px;
    font-size: 14px;
  }

  .appointment-title {
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    margin: 0 0 70px;
  }

  .thanks {
    text-align: center;
    margin-top: 60px !important;
  }

  .signature {
    position: absolute;
    right: 95px;
    bottom: 135px;
    width: 260px;
    text-align: center;
    font-size: 16px;
    line-height: 1.25;
  }

  .signature p {
    margin: 3px 0;
  }

  .corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: #bbb;
  }

  .tl {
    top: 55px;
    left: 55px;
    border-left: 1px solid #bbb;
    border-top: 1px solid #bbb;
  }

  .tr {
    top: 55px;
    right: 55px;
    border-right: 1px solid #bbb;
    border-top: 1px solid #bbb;
  }

  .bl {
    bottom: 55px;
    left: 55px;
    border-left: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
  }

  .br {
    bottom: 55px;
    right: 55px;
    border-right: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }

    body {
      margin: 0;
    }

    .certificate {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
    }
  }
`;