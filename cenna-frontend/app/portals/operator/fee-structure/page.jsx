"use client";

import { useRef, useState } from "react";
import { FaPrint, FaUndo } from "react-icons/fa";

const classes = [
  "P.G",
  "Nursery",
  "K.G",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

const discountRows = [
  { key: "monthlyFee", label: "Monthly Fee" },
  { key: "secondSibling", label: "Second Sibling" },
  { key: "thirdSibling", label: "Third Sibling" },
  { key: "fourthSibling", label: "Fourth Sibling" },
  { key: "fifthSibling", label: "Fifth Sibling" },
  { key: "sixthSibling", label: "Sixth Sibling" },
];

const initialFees = {
  monthlyFee: [3000, 3000, 3000, 3500, 4000, 4000, 4000, 4000, 4000, 4000, 4500, 5000, 5000],
  secondSibling: [2400, 2400, 2400, 2800, 3200, 3200, 3200, 3200, 3200, 3200, 3600, 4000, 4000],
  thirdSibling: [2100, 2100, 2100, 2450, 2800, 2800, 2800, 2800, 2800, 2800, 3150, 3500, 3500],
  fourthSibling: [1800, 1800, 1800, 2100, 2400, 2400, 2400, 2400, 2400, 2400, 2700, 3000, 3000],
  fifthSibling: ["FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE", "FREE"],
  sixthSibling: [1500, 1500, 1500, 1750, 2000, 2000, 2000, 2000, 2000, 2000, 2250, 2500, 2500],
};

export default function OperatorFeeStructurePage() {
  const printRef = useRef(null);

  const [session, setSession] = useState("2026-2027");
  const [fees, setFees] = useState(initialFees);

  const handleFeeChange = (rowKey, index, value) => {
    setFees((prev) => ({
      ...prev,
      [rowKey]: prev[rowKey].map((item, i) => (i === index ? value : item)),
    }));
  };

  const reset = () => {
    setSession("2026-2027");
    setFees(initialFees);
  };

  const printPage = () => {
    const html = printRef.current.innerHTML;
    const w = window.open("", "_blank");

    w.document.write(`
      <html>
        <head>
          <title>Fee Structure</title>
          <style>${printStyles}</style>
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

    w.document.close();
  };

  return (
    <section className="space-y-6 p-4 md:p-6">
      <style jsx global>{printStyles}</style>

      <div>
        <h1 className="text-3xl font-extrabold text-black">Fee Structure</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate and print class-wise fee structure.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold text-black">
            Fee Structure Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Session
              </label>
              <input
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div className="max-h-[650px] space-y-5 overflow-auto pr-2">
              {discountRows.map((row) => (
                <div key={row.key} className="rounded-2xl border p-4">
                  <h3 className="mb-3 font-extrabold text-black">
                    {row.label}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {classes.map((cls, index) => (
                      <div key={cls}>
                        <label className="mb-1 block text-xs font-bold text-gray-500">
                          {cls}
                        </label>
                        <input
                          value={fees[row.key][index]}
                          onChange={(e) =>
                            handleFeeChange(row.key, index, e.target.value)
                          }
                          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
              onClick={printPage}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-gray-800"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black">
              Fee Structure Preview
            </h2>

            <button
              type="button"
              onClick={printPage}
              className="cursor-pointer rounded-xl bg-black px-5 py-2 text-sm font-bold text-white hover:bg-gray-800"
            >
              Print Fee Structure
            </button>
          </div>

          <div className="overflow-auto rounded-2xl bg-gray-100 p-6">
            <div ref={printRef}>
              <FeeStructureSheet session={session} fees={fees} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeeStructureSheet({ session, fees }) {
  return (
    <div className="fee-sheet">
      <h1>CENNA SCHOOL & COLLEGE</h1>

      <p className="address">
        KHUDREZAI, PABBI, NOWSHERA, KP, PAKISTAN
      </p>

      <p className="phones">
        0923 529166, &nbsp;0923 529266, &nbsp;0923 529466
      </p>

      <h2>FEE STRUCTURE FOR THE SESSION {session}</h2>

      <table className="fee-table">
        <thead>
          <tr>
            <th>CLASS</th>
            {classes.map((cls) => (
              <th key={cls}>{cls}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {discountRows.map((row) => (
            <tr key={row.key}>
              <th>{row.label}</th>
              {fees[row.key].map((amount, index) => (
                <td key={index} className={amount === "FREE" ? "free" : ""}>
                  {amount}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="discount-box">
        <h3>Discounts</h3>
        <div className="discount-grid">
          <p>1. Half 50%</p>
          <p>2. Orphan 50%</p>
          <p>3. Current Employee Childs 100%</p>
          <p>4. Ex-Employee Child 50%</p>
          <p>5. BSF FREE</p>
          <p>6. Normal</p>
          <p>7. Sib2 20%</p>
          <p>8. Sib3 30%</p>
          <p>9. Sib4 40%</p>
          <p>10. Sib5 FREE</p>
          <p>11. Sib6 50%</p>
        </div>
      </div>

      <div className="signature-area">
        <div className="fake-signature">Signature</div>
        <p>
          <b>Managing Director Signature:</b>{" "}
          <span>__________________________</span>
        </p>
      </div>
    </div>
  );
}

const printStyles = `
  .fee-sheet {
    width: 1120px;
    min-height: 760px;
    background: white;
    margin: 0 auto;
    padding: 60px 65px;
    box-sizing: border-box;
    color: #111;
    font-family: "Times New Roman", serif;
  }

  .fee-sheet h1 {
    margin: 0;
    text-align: center;
    font-size: 44px;
    line-height: 1;
    font-weight: 900;
    letter-spacing: 1px;
  }

  .fee-sheet .address {
    margin: 14px 0 0;
    text-align: center;
    font-size: 21px;
    font-weight: 800;
  }

  .fee-sheet .phones {
    margin: 7px 0 5px;
    text-align: center;
    font-size: 21px;
    font-weight: 800;
  }

  .fee-sheet h2 {
    margin: 0 0 20px;
    text-align: center;
    font-size: 26px;
    font-weight: 900;
    text-decoration: underline;
  }

  .fee-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 20px;
  }

  .fee-table th,
  .fee-table td {
    border: 2px solid #111;
    text-align: center;
    padding: 8px 6px;
    font-weight: 800;
  }

  .fee-table thead th {
    font-size: 18px;
  }

  .fee-table tbody th {
    text-align: left;
    padding-left: 20px;
    width: 130px;
  }

  .fee-table .free {
    font-weight: 900;
  }

  .discount-box {
    margin-top: 30px;
    border: 2px solid #111;
    padding: 14px 18px;
  }

  .discount-box h3 {
    margin: 0 0 10px;
    font-size: 22px;
    text-decoration: underline;
  }

  .discount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px 18px;
    font-size: 18px;
    font-weight: 700;
  }

  .discount-grid p {
    margin: 0;
  }

  .signature-area {
    margin-top: 45px;
    margin-left: auto;
    width: 440px;
    text-align: center;
    font-size: 17px;
    font-weight: 700;
  }

  .fake-signature {
    height: 70px;
    font-family: cursive;
    font-size: 28px;
    transform: rotate(-8deg);
  }

  .signature-area p {
    margin: 0;
  }

  @media print {
    @page {
      size: A4 landscape;
      margin: 8mm;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .fee-sheet {
      width: 100%;
      min-height: auto;
      padding: 25px 20px;
    }

    .discount-box {
      display: none;
    }
  }
`;