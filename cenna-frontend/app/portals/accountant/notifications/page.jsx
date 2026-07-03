const notifications = [
  { type: "Fee Alert", message: "38 students have pending dues." },
  { type: "Report Alert", message: "Monthly report is ready." },
];

export default function AccountantNotificationsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Notifications</h1>
      <p className="mb-6 text-gray-500">Fee and finance alerts.</p>

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