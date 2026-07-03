const remarks = [
  {
    type: "Positive",
    teacher: "Sir Ahmad",
    remark: "Very active in class and completes homework on time.",
    date: "2026-06-01",
  },
  {
    type: "Improvement",
    teacher: "Miss Sana",
    remark: "Needs more focus during English grammar practice.",
    date: "2026-06-03",
  },
];

export default function StudentBehaviorPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">
        Behavior & Remarks
      </h1>
      <p className="mb-6 text-gray-500">View teacher feedback and behavior records.</p>

      <div className="space-y-5">
        {remarks.map((item) => (
          <div key={item.remark} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.type}</h2>
            <p className="mt-2 text-gray-500">Teacher: {item.teacher}</p>
            <p className="text-gray-500">Date: {item.date}</p>
            <p className="mt-3 text-gray-700">{item.remark}</p>
          </div>
        ))}
      </div>
    </section>
  );
}