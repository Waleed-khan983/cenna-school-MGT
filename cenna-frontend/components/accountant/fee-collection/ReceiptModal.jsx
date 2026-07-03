"use client";

import {
  FaDownload,
  FaPrint,
  FaTimes,
} from "react-icons/fa";

export default function ReceiptModal({ fee, onClose }) {
  if (!fee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-xl md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-black">
              Payment Receipt
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Receipt No: {fee.receiptNo || "N/A"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 p-3 text-black hover:bg-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <ReceiptView fee={fee} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => printReceipt(fee)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black py-4 font-extrabold text-white hover:bg-gray-800"
          >
            <FaPrint />
            Print Receipt
          </button>

          <button
            type="button"
            onClick={() => printReceipt(fee)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-4 font-extrabold text-black hover:bg-yellow-300"
          >
            <FaDownload />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptView({ fee }) {
  const balance = Math.max(
    Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
    0
  );

  return (
    <div className="rounded-2xl border bg-white p-5 text-black">
      <div className="text-center">
        <h1 className="text-xl font-extrabold underline">
          CENNA SCHOOL & COLLEGE PABBI NSR
        </h1>
        <p className="mt-1 text-sm underline">0923-529166/466</p>
        <p className="text-sm underline">Pabbi Nowshera</p>
      </div>

      <div className="mt-6 grid gap-3 text-sm font-bold md:grid-cols-2">
        <Info label="Receipt No" value={fee.receiptNo || "N/A"} />
        <Info label="Challan No" value={fee.challanNo || "N/A"} />
        <Info label="Admission No" value={fee.student?.admissionNo || "N/A"} />
        <Info label="Student Name" value={fee.student?.user?.name || "N/A"} />
        <Info label="Father Name" value={fee.student?.fatherName || "N/A"} />
        <Info
          label="Class-Sec"
          value={
            fee.student?.class?.displayName ||
            fee.class?.displayName ||
            "N/A"
          }
        />
        <Info label="Month" value={`${fee.month} ${fee.year}`} />
        <Info
          label="Paid Date"
          value={
            fee.paidDate
              ? new Date(fee.paidDate).toLocaleDateString()
              : "N/A"
          }
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Head</th>
              <th className="border p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-3">Monthly Fee</td>
              <td className="border p-3 text-right">
                Rs. {fee.monthlyFee || 0}
              </td>
            </tr>

            <tr>
              <td className="border p-3">Admission Fee</td>
              <td className="border p-3 text-right">
                Rs. {fee.admissionFee || 0}
              </td>
            </tr>

            <tr>
              <td className="border p-3">Exam Fee</td>
              <td className="border p-3 text-right">
                Rs. {fee.examFee || 0}
              </td>
            </tr>

            <tr>
              <td className="border p-3">Late Fine</td>
              <td className="border p-3 text-right">
                Rs. {fee.lateFine || 0}
              </td>
            </tr>

            <tr>
              <td className="border p-3">Discount</td>
              <td className="border p-3 text-right">
                Rs. {fee.discount || 0}
              </td>
            </tr>

            <tr className="bg-gray-50 font-extrabold">
              <td className="border p-3">Total Amount</td>
              <td className="border p-3 text-right">
                Rs. {fee.totalAmount || 0}
              </td>
            </tr>

            <tr className="font-extrabold text-green-700">
              <td className="border p-3">Paid Amount</td>
              <td className="border p-3 text-right">
                Rs. {fee.paidAmount || 0}
              </td>
            </tr>

            <tr className="font-extrabold text-red-600">
              <td className="border p-3">Remaining Balance</td>
              <td className="border p-3 text-right">
                Rs. {balance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-xs font-semibold text-gray-600">
        NOTE: FOR ANY QUERY IN THE SLIP PLEASE CONTACT WITH SCHOOL
        ADMINISTRATION IN WORKING HOURS. THANKS
      </p>

      <div className="mt-8 grid grid-cols-2 gap-10 font-bold">
        <div className="border-t pt-3 text-center">Accountant</div>
        <div className="border-t pt-3 text-center">Principal</div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 font-extrabold text-black">{value}</p>
    </div>
  );
}

function printReceipt(fee) {
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