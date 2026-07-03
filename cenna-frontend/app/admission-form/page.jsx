"use client";

export default function AdmissionFormPage() {
  const handlePrint = () => {
    const logoUrl = `${window.location.origin}/images/logo.jpg`;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Admission Form</title>

<style>
  body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: white;
    color: #111;
  }

  .form {
    width: 1050px;
    margin: auto;
    border: 2px solid #1f5f9f;
    padding: 10px;
  }

  .top {
    display: grid;
    grid-template-columns: 160px 1fr 120px;
    align-items: center;
    border-bottom: 3px solid #1f5f9f;
    padding-bottom: 8px;
  }

  .logo {
    width: 85px;
    height: 85px;
    object-fit: contain;
  }

  h1 {
    margin: 0;
    text-align: center;
    background: #1f5f9f;
    color: white;
    padding: 8px;
    font-size: 28px;
    letter-spacing: 2px;
  }

  .photo {
    height: 105px;
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .main-grid {
    display: grid;
    grid-template-columns: 270px 1fr;
    gap: 8px;
    margin-top: 8px;
  }

  .section {
    border: 1.5px solid #333;
    margin-bottom: 8px;
  }

  .section-title {
    background: #1f5f9f;
    color: white;
    font-weight: 800;
    padding: 5px 8px;
    text-transform: uppercase;
    font-size: 13px;
  }

  .fields {
    padding: 6px;
  }

  .row {
    display: grid;
    grid-template-columns: 135px 1fr;
    align-items: center;
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: 700;
  }

  .box {
    height: 24px;
    border: 1px solid #555;
  }

  .wide-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 6px;
  }

  .small-field label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    margin-bottom: 2px;
  }

  .small-box {
    height: 23px;
    border: 1px solid #555;
  }

  .address .row {
    grid-template-columns: 130px 1fr;
  }

  .footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    margin-top: 45px;
    padding: 0 40px;
  }

  .sign {
    border-top: 2px solid #111;
    text-align: center;
    padding-top: 8px;
    font-weight: 800;
  }

  @media print {
    @page {
      size: A4 landscape;
      margin: 8mm;
    }

    body {
      padding: 0;
    }

    .form {
      width: 100%;
    }
  }
</style>
</head>

<body>
<div class="form">

  <div class="top">
    <img src="${logoUrl}" class="logo" />

    <div>
      <h1>STUDENT ADMISSION FORM</h1>
      <p style="text-align:center;font-weight:bold;margin:6px 0 0">
        CENNA School & College Pabbi, Nowshera
      </p>
    </div>

    <div class="photo">Photo</div>
  </div>

  <div class="main-grid">

    <div>
      <div class="section">
        <div class="section-title">Student Personal Info</div>
        <div class="fields">
          ${leftField("Student ID")}
          ${leftField("Adm. No")}
          ${leftField("Student Type")}
          ${leftField("Student Name")}
          ${leftField("Father Name")}
          ${leftField("Father CNIC No")}
          ${leftField("DOB")}
          ${leftField("Gender")}
          ${leftField("Student CNIC")}
          ${leftField("Domicile")}
          ${leftField("Blood Group")}
          ${leftField("Nationality")}
          ${leftField("Religion")}
          ${leftField("Mother Tongue")}
          ${leftField("House")}
          ${leftField("Remarks")}
        </div>
      </div>
    </div>

    <div>
      <div class="section">
        <div class="section-title">Parents Information</div>
        <div class="wide-grid">
          ${field("Contact No")}
          ${field("Father Occupation")}
          ${field("Father Office Address")}
          ${field("Mother Name")}
          ${field("Mother Occupation")}
          ${field("Mother Education")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Guardian Information</div>
        <div class="wide-grid">
          ${field("Guardian CNIC")}
          ${field("Guardian Name")}
          ${field("Guardian Occupation")}
          ${field("Guardian Relation")}
          ${field("Guardian Contact No")}
          ${field("Reference")}
        </div>
      </div>

      <div class="section address">
        <div class="section-title">Address Information</div>
        <div class="fields">
          ${leftField("Present Address")}
          ${leftField("Permanent Address")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Program Admission Info</div>
        <div class="wide-grid">
          ${field("Program")}
          ${field("Batch No")}
          ${field("Board / Univ")}
          ${field("Quota")}
          ${field("Adm. Class")}
          ${field("D.O.A")}
          ${field("Reg No")}
          ${field("Previous Adm No")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Current Class Info</div>
        <div class="wide-grid">
          ${field("Current Session")}
          ${field("Shift")}
          ${field("Current Class / Section")}
          ${field("Current Status")}
          ${field("Class Number")}
          ${field("Group")}
          ${field("Subjects Comb")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Fee Information</div>
        <div class="wide-grid">
          ${field("Fee Type")}
          ${field("Opening Balance")}
          ${field("Discount Type")}
          ${field("Monthly Discount")}
          ${field("Fee Reg No")}
          ${field("Reason If Any")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Previous Academic Record</div>
        <div class="wide-grid">
          ${field("Last Degree")}
          ${field("Passing Year")}
          ${field("Major Subject")}
          ${field("Roll No")}
          ${field("Total Marks")}
          ${field("Obtained Marks")}
          ${field("Board / Univ")}
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="sign">Parent / Guardian Signature</div>
    <div class="sign">Principal Signature</div>
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

    printWindow.document.close();
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-28">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-extrabold text-black">
          Student Admission Form
        </h1>

        <p className="mt-3 text-gray-500">
          Click the button below. Then choose <b>Save as PDF</b> from the print
          window.
        </p>

        <button
          type="button"
          onClick={handlePrint}
          className="mt-8 cursor-pointer rounded-xl bg-black px-8 py-4 font-bold text-white hover:bg-gray-800"
        >
          Print / Save as PDF
        </button>
      </div>
    </main>
  );
}

function leftField(label) {
  return `
    <div class="row">
      <span>${label}</span>
      <div class="box"></div>
    </div>
  `;
}

function field(label) {
  return `
    <div class="small-field">
      <label>${label}</label>
      <div class="small-box"></div>
    </div>
  `;
}
