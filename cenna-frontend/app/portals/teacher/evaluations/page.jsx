const evaluations = [
  { title: "Classroom Performance", score: "Excellent", note: "Strong teaching method and class control." },
  { title: "Student Feedback", score: "Good", note: "Students understand lessons clearly." },
];

export default function TeacherEvaluationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Teacher Evaluations</h1>
      <p className="mb-6 text-gray-500">View teacher evaluation records and feedback.</p>

      <div className="space-y-5">
        {evaluations.map((item) => (
          <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.title}</h2>
            <p className="mt-2 font-bold text-green-600">{item.score}</p>
            <p className="text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}