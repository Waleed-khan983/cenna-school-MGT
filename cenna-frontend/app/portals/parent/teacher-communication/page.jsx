const messages = [
  { teacher: "Sir Ahmad", subject: "Mathematics", message: "Ahmad needs more practice in algebra." },
  { teacher: "Miss Sana", subject: "English", message: "Fatima is performing very well." },
];

export default function ParentTeacherCommunicationPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Teacher Communication</h1>
      <p className="mb-6 text-gray-500">Read teacher messages and academic feedback.</p>

      <div className="space-y-5">
        {messages.map((item) => (
          <div key={`${item.teacher}-${item.subject}`} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.teacher}</h2>
            <p className="text-gray-500">Subject: {item.subject}</p>
            <p className="mt-3 text-gray-700">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}