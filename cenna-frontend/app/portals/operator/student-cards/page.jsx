"use client";

import { useRef, useState } from "react";
import { FaPrint, FaUndo, FaUpload } from "react-icons/fa";

const initialForm = {
  studentName: "WALEED KHAN",
  fatherName: "SOHBAT",
  className: "12th",
  admissionNo: "2188",
  dob: "2004-07-10",
  contactNo: "03189259959",
  address: "MOHALLAH USMAN ABAD\nVILLAGE PABBI DISTRIC ",
  validity: "2022-04-30",
};

export default function OperatorStudentCardsPage() {
  const printRef = useRef(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(URL.createObjectURL(file));
  };

  const reset = () => {
    setForm(initialForm);
    setPhoto("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const printCard = () => {
    const html = printRef.current.innerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Student Card</title>
          <style>${cardStyles}</style>
        </head>
        <body>
          <div class="print-area">${html}</div>
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
      <style jsx global>{cardStyles}</style>

      <div>
        <h1 className="text-3xl font-extrabold text-black">Student Cards</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and print student ID cards.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold text-black">
            Student Card Details
          </h2>

          <div className="grid gap-4">
            <Input label="Student Name" name="studentName" value={form.studentName} onChange={handleChange} />
            <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
            <Input label="Class" name="className" value={form.className} onChange={handleChange} />
            <Input label="Admission No" name="admissionNo" value={form.admissionNo} onChange={handleChange} />
            <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
            <Input label="Contact No" name="contactNo" value={form.contactNo} onChange={handleChange} />
            <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
            <Input label="Validity" name="validity" type="date" value={form.validity} onChange={handleChange} />

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Student Photo
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
                  {photo ? (
                    <img src={photo} alt="Student" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-400">No Image</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 font-bold hover:bg-gray-50"
                >
                  <FaUpload className="text-2xl text-blue-700" />
                  Choose Image
                  <span className="text-xs font-medium text-gray-500">
                    JPG, PNG
                  </span>
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={reset}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold hover:bg-gray-50"
            >
              <FaUndo /> Reset
            </button>

            <button
              type="button"
              onClick={printCard}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-gray-800"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black">Card Preview</h2>

            <button
              type="button"
              onClick={printCard}
              className="cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800"
            >
              Print Card
            </button>
          </div>

          <div className="overflow-auto rounded-2xl bg-gray-100 p-6">
            <div ref={printRef} className="print-area">
              <StudentCardFront form={form} photo={photo} />
              <StudentCardBack form={form} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentCardFront({ form, photo }) {
  return (
    <div className="student-card front-card">
      <div className="card-title">CENNA</div>

      <div className="top-strip">
        <div className="yellow-box">SCHOOL FOR BOYS</div>
        <div className="black-box">COLLEGE FOR BOYS</div>
      </div>

      <div className="front-main">
        <div className="logo-area">
          <img src="/images/logo.jpg" alt="Logo" />
        </div>

        <div className="center-area">
          <div className="location">Pabbi Nowshera</div>
          <div className="student-label">Student Card</div>
          <h2>{form.studentName || "STUDENT NAME"}</h2>
        </div>

        <div className="photo-area">
          <div className="student-photo">
            {photo ? <img src={photo} alt="Student" /> : <span>Photo</span>}
          </div>

          <div className="principal">Principal</div>
          <div className="institute">The Institute</div>
          <div className="authority">Issuing Authority</div>
        </div>
      </div>

      <div className="slogan">Serve The Nation Through Educational</div>
    </div>
  );
}

function StudentCardBack({ form }) {
  return (
    <div className="student-card back-card">
      <div className="back-content">
        <div className="back-left">
          <Row label="Father Name:" value={form.fatherName} />
          <Row label="Class:" value={form.className} />
          <Row label="Date Of Birth:" value={formatDate(form.dob)} />
          <Row label="Contact No:" value={form.contactNo} />

          <div className="back-row address-row">
            <b>Address:</b>
            <span>{form.address || "N/A"}</span>
          </div>

          <Row label="Validity:" value={formatDate(form.validity, true)} />
        </div>

        <div className="adm-no">
          <b>Adm: No:</b>
          <span>{form.admissionNo || "N/A"}</span>
        </div>
      </div>

      <div className="phone-strip">0923-529166/466</div>
      <div className="email-strip">cennapublic@gmail.com</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="back-row">
      <b>{label}</b>
      <span>{value || "N/A"}</span>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
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

function Textarea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      <textarea
        rows={3}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function formatDate(date, short = false) {
  if (!date) return "N/A";

  const d = new Date(date);

  if (short) {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  }

  return d.toLocaleDateString("en-GB");
}

const cardStyles = `
  .print-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  .student-card {
    width: 640px;
    height: 370px;
    border: 2px solid #111;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    color: #111;
  }

  .front-card {
    background: linear-gradient(180deg, #fff4c7 0%, #fff8dc 72%, #ffd400 100%);
  }

  .card-title {
    height: 58px;
    text-align: center;
    font-family: Georgia, serif;
    font-size: 58px;
    line-height: 58px;
    font-weight: 900;
    letter-spacing: 5px;
  }

  .top-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 42px;
    line-height: 42px;
    text-align: center;
    font-size: 24px;
    font-weight: 900;
  }

  .yellow-box {
    background: #ffd400;
    color: #000;
  }

  .black-box {
    background: #111;
    color: #fff;
  }

  .front-main {
    height: 220px;
    display: grid;
    grid-template-columns: 155px 1fr 150px;
    align-items: center;
    padding: 0 16px 42px;
    box-sizing: border-box;
  }

  .logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-area img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    object-fit: cover;
  }

  .center-area {
    text-align: center;
    padding-top: 24px;
  }

  .location {
    display: inline-block;
    background: #e41212;
    color: white;
    padding: 2px 20px 5px;
    font-size: 25px;
    font-weight: 900;
    margin-bottom: 18px;
  }

  .student-label {
    display: inline-block;
    margin-bottom: 18px;
    font-size: 28px;
    font-weight: 900;
    text-decoration: underline;
  }

  .center-area h2 {
    margin: 0;
    font-size: 34px;
    line-height: 36px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .photo-area {
    text-align: center;
    align-self: start;
    padding-top: 8px;
  }

  .student-photo {
    width: 112px;
    height: 112px;
    margin: 0 auto;
    border: 1px solid #777;
    background: #8fd7dc;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
  }

  .student-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .principal {
    margin-top: 3px;
    color: #f01616;
    font-size: 16px;
    font-weight: 900;
    line-height: 16px;
  }

  .institute {
    color: #f01616;
    font-size: 16px;
    font-weight: 900;
    line-height: 16px;
  }

  .authority {
    margin-top: 3px;
    color: #111;
    font-size: 17px;
    font-weight: 900;
    line-height: 17px;
  }

  .slogan {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 42px;
    background: #111;
    color: #ffd400;
    text-align: center;
    font-family: Georgia, serif;
    font-size: 25px;
    line-height: 42px;
    font-weight: 900;
  }

  .back-card {
    background: linear-gradient(180deg, #fff4c7 0%, #fff8dc 75%, #ffd400 100%);
    padding: 22px 30px 0;
  }

  .back-content {
    position: relative;
    height: 268px;
  }

  .back-left {
    width: 435px;
  }

  .back-row {
    display: grid;
    grid-template-columns: 175px 1fr;
    align-items: start;
    margin-bottom: 8px;
    font-size: 22px;
    line-height: 1.15;
  }

  .back-row b {
    font-weight: 900;
    color: #111;
  }

  .back-row span {
    color: #0b3193;
    font-weight: 900;
    white-space: pre-line;
    word-break: break-word;
  }

  .address-row {
    margin-bottom: 12px;
  }

  .adm-no {
    position: absolute;
    top: 35px;
    right: 0;
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 22px;
    font-weight: 900;
  }

  .adm-no span {
    color: #555;
  }

  .phone-strip {
    position: absolute;
    left: 0;
    bottom: 38px;
    width: 100%;
    height: 40px;
    background: #111;
    color: white;
    text-align: center;
    font-size: 25px;
    line-height: 42px;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .email-strip {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 38px;
    background: #ffd400;
    color: green;
    text-align: center;
    font-size: 22px;
    line-height: 38px;
    font-weight: 900;
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .print-area {
      gap: 18px;
      padding: 0;
    }

    .student-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;