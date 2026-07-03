export default function TeacherResultUploadsPage() {
  return (
    <section>
      <h1 className="mb-2 text-3xl font-extrabold text-black">Result Uploads</h1>
      <p className="mb-6 text-gray-500">Upload mid-term and final exam marks.</p>

      <form className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Class" placeholder="Grade 10" />
          <Input label="Subject" placeholder="Mathematics" />
          <Input label="Exam Type" placeholder="Mid Term / Final" />
          <Input label="Student Admission No" placeholder="CENNA-001" />
          <Input label="Marks Obtained" placeholder="88" />
          <Input label="Total Marks" placeholder="100" />
        </div>

        <button className="mt-8 rounded-xl bg-black px-6 py-3 font-bold text-white">
          Upload Result
        </button>
      </form>
    </section>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}