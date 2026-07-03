const records = [
  { date: "2026-06-01", checkIn: "07:45 AM", checkOut: "02:00 PM", status: "Present" },
  { date: "2026-06-02", checkIn: "07:55 AM", checkOut: "02:00 PM", status: "Present" },
];

export default function TeacherAttendancePage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Teacher Attendance</h1>
      <p className="mb-6 text-gray-500">View your attendance record.</p>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card title="Present Days" value="24" />
        <Card title="Absent Days" value="1" />
        <Card title="Late Days" value="2" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Check In</th>
              <th className="p-4">Check Out</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.date} className="border-b">
                <td className="p-4">{item.date}</td>
                <td className="p-4">{item.checkIn}</td>
                <td className="p-4">{item.checkOut}</td>
                <td className="p-4 font-bold text-green-600">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-extrabold text-black">{value}</h2>
    </div>
  );
}