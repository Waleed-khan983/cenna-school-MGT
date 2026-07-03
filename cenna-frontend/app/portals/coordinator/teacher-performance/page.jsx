const teachers = [
  { name: "Sir Ahmad", classes: 3, attendance: "96%", rating: "Excellent" },
  { name: "Miss Sana", classes: 4, attendance: "94%", rating: "Good" },
];

export default function CoordinatorTeacherPerformancePage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Teacher Performance</h1>
      <p className="mb-6 text-gray-500">Review teacher attendance, classes, and performance.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {teachers.map((teacher) => (
          <div key={teacher.name} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{teacher.name}</h2>
            <p className="mt-2 text-gray-500">Classes: {teacher.classes}</p>
            <p className="text-gray-500">Attendance: {teacher.attendance}</p>
            <p className="font-bold text-green-600">Rating: {teacher.rating}</p>
          </div>
        ))}
      </div>
    </section>
  );
}