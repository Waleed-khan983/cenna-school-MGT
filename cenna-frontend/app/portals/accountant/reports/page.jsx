const reports = [
  { title: "Monthly Collection Report", value: "Rs. 1.3M" },
  { title: "Pending Dues Report", value: "Rs. 320K" },
  { title: "Defaulter Report", value: "38 students" },
];

export default function AccountantReportsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Financial Reports</h1>
      <p className="mb-6 text-gray-500">View financial reports and summaries.</p>

      <div className="grid gap-6 md:grid-cols-3">
        {reports.map((item) => (
          <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.title}</h2>
            <p className="mt-3 text-2xl font-extrabold text-yellow-600">{item.value}</p>
            <button className="mt-5 rounded-xl bg-black px-5 py-3 font-bold text-white">
              View Report
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}