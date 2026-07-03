const notifications = [
  { type: "Attendance", message: "Grade 10 attendance is below 90% today." },
  { type: "Reports", message: "Teacher performance report is ready." },
];

export default function CoordinatorNotificationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Notifications</h1>
      <p className="mb-6 text-gray-500">Important academic monitoring alerts.</p>

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