const events = [
  { title: "Monthly Test", date: "2026-06-08", type: "Exam" },
  { title: "Sports Week", date: "2026-06-15", type: "Activity" },
  { title: "Parent Teacher Meeting", date: "2026-06-20", type: "Meeting" },
  { title: "Final Exam", date: "2026-07-01", type: "Exam" },
];

export default function StudentCalendarPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Academic Calendar</h1>
      <p className="mb-6 text-gray-500">View exams, meetings, activities, and school events.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{event.title}</h2>
            <p className="mt-2 text-gray-500">Date: {event.date}</p>
            <p className="font-bold text-yellow-600">{event.type}</p>
          </div>
        ))}
      </div>
    </section>
  );
}