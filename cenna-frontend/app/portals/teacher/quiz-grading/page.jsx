const quizzes = [
  { student: "Ahmad Khan", quiz: "Math Quiz 1", score: "18/20", status: "Checked" },
  { student: "Fatima Noor", quiz: "Physics Quiz", score: "Pending", status: "Need Review" },
];

export default function TeacherQuizGradingPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Quiz Grading</h1>
      <p className="mb-6 text-gray-500">Review quiz attempts and marks.</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Quiz</th>
              <th className="p-4">Score</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((item) => (
              <tr key={`${item.student}-${item.quiz}`} className="border-b">
                <td className="p-4 font-semibold">{item.student}</td>
                <td className="p-4">{item.quiz}</td>
                <td className="p-4">{item.score}</td>
                <td className="p-4 font-bold text-blue-600">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}