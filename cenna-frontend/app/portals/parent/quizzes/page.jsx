const quizzes = [
  { child: "Ahmad Khan", title: "Math Quiz 1", score: "18/20", status: "Completed" },
  { child: "Fatima Khan", title: "Science Quiz", score: "Pending", status: "Upcoming" },
];

export default function ParentQuizzesPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Quizzes</h1>
      <p className="mb-6 text-gray-500">View quiz scores and upcoming quizzes.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div key={quiz.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{quiz.title}</h2>
            <p className="mt-2 text-gray-500">Child: {quiz.child}</p>
            <p className="text-gray-500">Score: {quiz.score}</p>
            <p className="mt-2 font-bold text-blue-600">{quiz.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}