const records = [
  { child: "Ahmad Khan", type: "Positive", remark: "Participates in class activities." },
  { child: "Fatima Khan", type: "Excellent", remark: "Very disciplined and punctual." },
];

export default function ParentBehaviorPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Behavior & Remarks</h1>
      <p className="mb-6 text-gray-500">View teacher remarks and behavior records.</p>

      <div className="space-y-5">
        {records.map((item) => (
          <div key={`${item.child}-${item.remark}`} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black">{item.child}</h2>
            <p className="mt-2 font-bold text-yellow-600">{item.type}</p>
            <p className="text-gray-500">{item.remark}</p>
          </div>
        ))}
      </div>
    </section>
  );
}