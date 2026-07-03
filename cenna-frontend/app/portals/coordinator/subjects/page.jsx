const subjects = [
  { name: "Mathematics", code: "MATH-10", teacher: "Sir Ahmad" },
  { name: "English", code: "ENG-10", teacher: "Miss Sana" },
];

export default function CoordinatorSubjectsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Subjects</h1>
      <p className="mb-6 text-gray-500">Monitor subject assignment and teachers.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {subjects.map((subject) => (
          <div key={subject.code} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{subject.name}</h2>
            <p className="mt-2 text-gray-500">Code: {subject.code}</p>
            <p className="text-gray-500">Teacher: {subject.teacher}</p>
          </div>
        ))}
      </div>
    </section>
  );
}