const lectures = [
  { title: "Algebra Basics", subject: "Mathematics", child: "Ahmad Khan" },
  { title: "Photosynthesis", subject: "Science", child: "Fatima Khan" },
];

export default function ParentLecturesPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Lectures</h1>
      <p className="mb-6 text-gray-500">View recorded lectures assigned to your children.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {lectures.map((lecture) => (
          <div key={lecture.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{lecture.title}</h2>
            <p className="mt-2 text-gray-500">Subject: {lecture.subject}</p>
            <p className="text-gray-500">Child: {lecture.child}</p>
            <button className="mt-5 rounded-xl bg-black px-5 py-3 font-bold text-white">
              Open Lecture
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}