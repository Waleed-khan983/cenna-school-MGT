const reports = [
  { title: "Student Reports", value: "Academic, attendance, behavior" },
  { title: "Teacher Reports", value: "Attendance, classes, evaluations" },
  { title: "Financial Reports", value: "Fees, defaulters, collections" },
  { title: "Dashboard Analytics", value: "School-wide summary and charts" },
];

export default function AdminReportsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Reports & Analytics</h1>
      <p className="mb-6 text-gray-500">View school performance and management reports.</p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <div key={report.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{report.title}</h2>
            <p className="mt-2 text-gray-500">{report.value}</p>
            <button className="mt-5 rounded-xl border border-black px-5 py-2 font-bold hover:bg-black hover:text-white">
              View Report
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}