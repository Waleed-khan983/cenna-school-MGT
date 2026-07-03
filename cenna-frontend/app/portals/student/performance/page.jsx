const subjects = [
  { subject: "Mathematics", score: "88%", grade: "A" },
  { subject: "English", score: "82%", grade: "A" },
  { subject: "Physics", score: "76%", grade: "B" },
  { subject: "Computer Science", score: "94%", grade: "A+" },
];

export default function StudentPerformancePage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Performance</h1>
      <p className="mb-6 text-gray-500">Track your academic progress.</p>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card title="Average Marks" value="85%" />
        <Card title="Current Grade" value="A" />
        <Card title="Attendance" value="92%" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Score</th>
              <th className="p-4">Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr key={item.subject} className="border-b">
                <td className="p-4 font-semibold">{item.subject}</td>
                <td className="p-4">{item.score}</td>
                <td className="p-4 font-bold text-green-600">{item.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-extrabold text-black">{value}</h2>
    </div>
  );
}