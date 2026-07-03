const notifications = [
  { type: "Attendance Alert", message: "Ahmad was absent on 2026-06-02." },
  { type: "Fee Alert", message: "June fee is pending for Ahmad Khan." },
  { type: "Result Alert", message: "New result uploaded for Fatima Khan." },
];

export default function ParentNotificationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Notifications</h1>
      <p className="mb-6 text-gray-500">Attendance, fee, result, and academic alerts.</p>

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