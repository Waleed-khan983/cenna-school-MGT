import Image from "next/image";

export default function CoordinatorProfilePage() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <Image
          src="/images/admin.png"
          alt="Coordinator Profile"
          width={140}
          height={140}
          className="rounded-full border object-cover"
        />

        <div>
          <h1 className="text-3xl font-extrabold text-black">Coordinator Profile</h1>
          <p className="mt-2 text-gray-500">Academic coordinator account details.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Info label="Name" value="Coordinator Name" />
        <Info label="Email" value="coordinator@cenna.edu.pk" />
        <Info label="Phone" value="03XX-XXXXXXX" />
        <Info label="Department" value="Academic Coordination" />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-black">{value}</p>
    </div>
  );
}