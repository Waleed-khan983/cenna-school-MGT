const performance = [
  { student: "Ahmad Khan", className: "Grade 10", average: "86%", attendance: "94%", status: "Good" },
  { student: "Fatima Noor", className: "Grade 9", average: "92%", attendance: "97%", status: "Excellent" },
];

export default function TeacherPerformancePage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Student Performance</h1>
      <p className="mb-6 text-gray-500">Monitor student academic performance.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {performance.map((item) => (
          <div key={item.student} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.student}</h2>
            <p className="mt-2 text-gray-500">Class: {item.className}</p>
            <p className="text-gray-500">Average Marks: {item.average}</p>
            <p className="text-gray-500">Attendance: {item.attendance}</p>
            <p className="mt-2 font-bold text-green-600">{item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}