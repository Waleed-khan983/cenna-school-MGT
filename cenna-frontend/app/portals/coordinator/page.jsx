import DashboardCard from "@/components/portals/DashboardCard";

export default function CoordinatorDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold text-black">
        Coordinator Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Students" value="650" icon="🎓" change="All classes" color="black" />
        <DashboardCard title="Teachers" value="45" icon="👨‍🏫" change="Active staff" color="gold" />
        <DashboardCard title="Attendance" value="92%" icon="✅" change="Today average" color="green" />
        <DashboardCard title="Performance" value="Good" icon="📊" change="Monthly review" color="blue" />
      </div>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-black">Academic Monitoring</h2>
        <p className="mt-2 text-gray-500">
          Monitor students, teachers, classes, attendance, results, performance, and evaluations.
        </p>
      </section>
    </div>
  );
}