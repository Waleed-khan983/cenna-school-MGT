const performance = [
  { child: "Ahmad Khan", academic: "Good", attendance: "94%", remarks: "Improving" },
  { child: "Fatima Khan", academic: "Excellent", attendance: "97%", remarks: "Very active" },
];

export default function ParentPerformancePage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Performance</h1>
      <p className="mb-6 text-gray-500">Monitor academic progress and overall performance.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {performance.map((item) => (
          <div key={item.child} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.child}</h2>
            <p className="mt-2 text-gray-500">Academic: {item.academic}</p>
            <p className="text-gray-500">Attendance: {item.attendance}</p>
            <p className="font-bold text-green-600">Remarks: {item.remarks}</p>
          </div>
        ))}
      </div>
    </section>
  );
}