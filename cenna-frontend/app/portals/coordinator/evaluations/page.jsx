const evaluations = [
  { title: "Teacher Evaluation", status: "Pending Review" },
  { title: "Student Behavior Review", status: "Updated" },
  { title: "Award Recommendations", status: "Open" },
];

export default function CoordinatorEvaluationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Evaluations</h1>
      <p className="mb-6 text-gray-500">Manage evaluations and recommendations.</p>

      <div className="grid gap-6 md:grid-cols-3">
        {evaluations.map((item) => (
          <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.title}</h2>
            <p className="mt-2 font-bold text-yellow-600">{item.status}</p>
            <button className="mt-5 rounded-xl bg-black px-5 py-3 font-bold text-white">
              Open
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}