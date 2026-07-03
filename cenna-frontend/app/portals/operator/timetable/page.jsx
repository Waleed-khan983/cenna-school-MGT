"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPrint } from "react-icons/fa";

import { fetchTimetables } from "@/store/timetableSlice";
import PageLoader from "@/components/ui/PageLoader";

export default function TimetablePage() {
  const dispatch = useDispatch();
  const printRef = useRef(null);

  const { timetables = [], loading } = useSelector(
    (state) => state.timetables || {}
  );

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const handlePrint = () => {
    const html = printRef.current.innerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Class Timetable</title>
          <style>${printStyles}</style>
        </head>
        <body>${html}<script>window.onload=()=>window.print()</script></body>
      </html>
    `);

    win.document.close();
  };

  if (loading) return <PageLoader text="Loading timetable..." />;

  return (
    <section className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Class Timetable</h1>
          <p className="text-gray-500">Weekly class schedule.</p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
        >
          <FaPrint /> Print
        </button>
      </div>

      <div ref={printRef}>
        <PrintableHeader title="Class Timetable" subtitle="Weekly Class Schedule" />

        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm print-box">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] print-table">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4 text-left">Class</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Teacher</th>
                  <th className="p-4 text-left">Day</th>
                  <th className="p-4 text-center">Start</th>
                  <th className="p-4 text-center">End</th>
                  <th className="p-4 text-center">Room</th>
                </tr>
              </thead>

              <tbody>
                {timetables.length > 0 ? (
                  timetables.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-4">
                        {item.classId?.displayName || item.classId?.name || "N/A"}
                      </td>
                      <td className="p-4">{item.subjectId?.name || "N/A"}</td>
                      <td className="p-4">
                        {item.teacherId?.user?.name || "N/A"}
                      </td>
                      <td className="p-4">{item.day || "N/A"}</td>
                      <td className="p-4 text-center">{item.startTime || "N/A"}</td>
                      <td className="p-4 text-center">{item.endTime || "N/A"}</td>
                      <td className="p-4 text-center">{item.room || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      No timetable available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrintableHeader({ title, subtitle }) {
  return (
    <div className="print-header">
      <img src="/images/logo.jpg" alt="Logo" />
      <div>
        <h2>CENNA School & College</h2>
        <p>Pabbi, Nowshera</p>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

const printStyles = `
  body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
  .print-header { display: flex; align-items: center; justify-content: center; gap: 18px; margin-bottom: 20px; text-align: center; }
  .print-header img { width: 75px; height: 75px; object-fit: contain; }
  .print-header h2 { margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; }
  .print-header h3 { margin: 8px 0 0; font-size: 22px; text-decoration: underline; }
  .print-header p { margin: 3px 0; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #111; padding: 9px; }
  th { background: #111; color: white; }
  td { text-align: left; }
  td:nth-child(5), td:nth-child(6), td:nth-child(7) { text-align: center; }
  @media print {
    @page { size: A4 landscape; margin: 8mm; }
    body { padding: 0; }
  }
`;