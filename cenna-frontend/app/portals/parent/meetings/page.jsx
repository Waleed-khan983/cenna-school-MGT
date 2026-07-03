const meetings = [
  { title: "Parent Teacher Meeting", teacher: "Sir Ahmad", date: "2026-06-12", time: "10:00 AM" },
];

export default function ParentMeetingsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Meetings</h1>
      <p className="mb-6 text-gray-500">View parent-teacher meeting schedule.</p>

      <div className="grid gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{meeting.title}</h2>
            <p className="mt-2 text-gray-500">Teacher: {meeting.teacher}</p>
            <p className="text-gray-500">Date: {meeting.date}</p>
            <p className="text-gray-500">Time: {meeting.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}