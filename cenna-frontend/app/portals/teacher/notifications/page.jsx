const notifications = [
  { type: "Assignment", message: "3 new submissions need grading." },
  { type: "Attendance", message: "Please mark attendance for Grade 10." },
  { type: "Meeting", message: "Staff meeting scheduled for Monday." },
];

export default function TeacherNotificationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Notifications</h1>
      <p className="mb-6 text-gray-500">View teaching and school notifications.</p>

      <div className="space-y-5">
        {notifications.map((item) => (
          <div key={item.message} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.type}</h2>
            <p className="mt-2 text-gray-500">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}