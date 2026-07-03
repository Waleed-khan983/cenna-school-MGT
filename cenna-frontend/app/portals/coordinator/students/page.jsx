const students = [
  { name: "Ahmad Khan", admissionNo: "CENNA-001", className: "Grade 10", performance: "Good" },
  { name: "Fatima Noor", admissionNo: "CENNA-002", className: "Grade 9", performance: "Excellent" },
];

export default function CoordinatorStudentsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Students</h1>
      <p className="mb-6 text-gray-500">Monitor student records and academic progress.</p>

      <Table
        headers={["Name", "Admission No", "Class", "Performance"]}
        rows={students.map((s) => [s.name, s.admissionNo, s.className, s.performance])}
      />
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-black text-white">
          <tr>{headers.map((h) => <th key={h} className="p-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b">
              {row.map((cell, j) => <td key={j} className="p-4">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}