const results = [
  { className: "Grade 10", exam: "Mid Term", passRate: "88%", topStudent: "Fatima Noor" },
  { className: "Grade 9", exam: "Monthly Test", passRate: "91%", topStudent: "Ahmad Khan" },
];

export default function CoordinatorResultsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Results Monitoring</h1>
      <p className="mb-6 text-gray-500">Review class-wise exam performance.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {results.map((item) => (
          <div key={`${item.className}-${item.exam}`} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.className}</h2>
            <p className="mt-2 text-gray-500">Exam: {item.exam}</p>
            <p className="text-gray-500">Top Student: {item.topStudent}</p>
            <p className="mt-2 font-bold text-green-600">Pass Rate: {item.passRate}</p>
          </div>
        ))}
      </div>
    </section>
  );
}