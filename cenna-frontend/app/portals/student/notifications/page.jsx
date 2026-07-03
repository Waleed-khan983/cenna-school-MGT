const notifications = [
  { type: "Assignment Alert", message: "New Mathematics assignment uploaded." },
  { type: "Fee Alert", message: "June fee challan is pending." },
  { type: "Result Alert", message: "Physics quiz result has been uploaded." },
  { type: "Attendance Alert", message: "Your attendance for this month is 92%." },
];

export default function StudentNotificationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Notifications</h1>
      <p className="mb-6 text-gray-500">View your academic and fee alerts.</p>

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