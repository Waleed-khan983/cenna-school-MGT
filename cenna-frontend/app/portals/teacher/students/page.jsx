const students = [
  { name: "Ahmad Khan", admissionNo: "CENNA-001", className: "Grade 10", section: "A", attendance: "94%" },
  { name: "Fatima Noor", admissionNo: "CENNA-002", className: "Grade 9", section: "B", attendance: "97%" },
];

export default function TeacherStudentsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Students</h1>
      <p className="mb-6 text-gray-500">View students assigned to your classes.</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Admission No</th>
              <th className="p-4">Class</th>
              <th className="p-4">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.admissionNo} className="border-b">
                <td className="p-4 font-semibold">{student.name}</td>
                <td className="p-4">{student.admissionNo}</td>
                <td className="p-4">{student.className} - {student.section}</td>
                <td className="p-4 font-bold text-green-600">{student.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}