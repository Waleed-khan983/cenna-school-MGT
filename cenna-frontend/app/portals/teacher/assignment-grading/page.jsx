const submissions = [
  { student: "Ahmad Khan", assignment: "Algebra Worksheet", status: "Submitted", marks: "Pending" },
  { student: "Fatima Noor", assignment: "Algebra Worksheet", status: "Submitted", marks: "18/20" },
];

export default function TeacherAssignmentGradingPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Assignment Grading</h1>
      <p className="mb-6 text-gray-500">Review and grade submitted assignments.</p>

      <div className="grid gap-6">
        {submissions.map((item) => (
          <div key={`${item.student}-${item.assignment}`} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.assignment}</h2>
            <p className="mt-2 text-gray-500">Student: {item.student}</p>
            <p className="text-gray-500">Status: {item.status}</p>
            <p className="font-bold text-yellow-600">Marks: {item.marks}</p>

            <button className="mt-5 rounded-xl bg-black px-5 py-3 font-bold text-white">
              Grade Assignment
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}