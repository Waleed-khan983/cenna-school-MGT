"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchMyAttendance } from "@/store/studentAttendanceSlice";
import PageLoader from "@/components/ui/PageLoader";

const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

export default function StudentAttendancePage() {
  const dispatch = useDispatch();
  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const [year, setYear] = useState(currentDate.getFullYear());

  const {
    subjectReport = [],
    loading,
    error,
  } = useSelector((state) => state.studentAttendance || {});

  useEffect(() => {
    dispatch(
      fetchMyAttendance({
        month,
        year,
      }),
    );
  }, [dispatch, month, year]);

  /*
   * Prepare safe data for the chart.
   */
  const chartData = useMemo(() => {
    return subjectReport.map((subject) => ({
      ...subject,

      subjectName: subject.subjectName || "Unknown Subject",

      subjectCode: subject.subjectCode || "",

      totalClasses: Number(subject.totalClasses) || 0,

      present: Number(subject.present) || 0,

      absent: Number(subject.absent) || 0,

      late: Number(subject.late) || 0,

      leave: Number(subject.leave) || 0,

      percentage: Math.min(100, Math.max(0, Number(subject.percentage) || 0)),
    }));
  }, [subjectReport]);

  /*
   * Overall attendance percentage for the selected month.
   */
  const overallSummary = useMemo(() => {
    const totals = chartData.reduce(
      (result, subject) => {
        result.total += subject.totalClasses;
        result.present += subject.present;
        result.absent += subject.absent;
        result.late += subject.late;
        result.leave += subject.leave;

        return result;
      },
      {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
      },
    );

    const percentage =
      totals.total > 0 ? Math.round((totals.present / totals.total) * 100) : 0;

    return {
      ...totals,
      percentage,
    };
  }, [chartData]);

  if (loading) {
    return <PageLoader text="Loading attendance report..." />;
  }

  return (
    <section className="min-h-screen space-y-6 bg-gray-50 p-4 md:p-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Student dashboard
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-gray-950">
            Subject Attendance
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View your monthly attendance percentage for every subject.
          </p>
        </div>

        {chartData.length > 0 && (
          <div className="rounded-2xl border bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Overall attendance
            </p>

            <div className="mt-1 flex items-end gap-2">
              <p
                className="text-3xl font-extrabold"
                style={{
                  color: getPercentageColor(overallSummary.percentage),
                }}
              >
                {overallSummary.percentage}%
              </p>

              <p className="mb-1 text-sm font-semibold text-gray-500">
                this month
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid gap-4 rounded-3xl border bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Month
          </label>

          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            {months.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Year
          </label>

          <input
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* One professional attendance chart */}
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">
                Attendance Percentage by Subject
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Each vertical bar represents one subject.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-600">
              <ChartLegend color="#16a34a" label="Excellent 90%+" />
              <ChartLegend color="#2563eb" label="Good 75%+" />
              <ChartLegend color="#eab308" label="Warning 60%+" />
              <ChartLegend color="#dc2626" label="Critical below 60%" />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {chartData.length > 0 ? (
            <div className="h-[460px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 30,
                    right: 20,
                    left: 0,
                    bottom: 70,
                  }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="subjectName"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={80}
                    tick={{
                      fontSize: 12,
                      fill: "#374151",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{
                      fontSize: 12,
                      fill: "#6b7280",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#f9fafb",
                    }}
                    content={<SubjectAttendanceTooltip />}
                  />

                  <ReferenceLine
                    y={75}
                    stroke="#f59e0b"
                    strokeDasharray="6 6"
                    label={{
                      value: "75% required",
                      position: "insideTopRight",
                      fill: "#92400e",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />

                  <Bar
                    dataKey="percentage"
                    name="Attendance"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={55}
                    background={{
                      fill: "#f3f4f6",
                      radius: [10, 10, 0, 0],
                    }}
                  >
                    {chartData.map((subject) => (
                      <Cell
                        key={subject.subjectId}
                        fill={getPercentageColor(subject.percentage)}
                      />
                    ))}

                    <LabelList
                      dataKey="percentage"
                      position="top"
                      formatter={(value) => `${value}%`}
                      style={{
                        fill: "#111827",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </section>
  );
}

/*
 * Professional subject label.
 */
function SubjectAxisTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-10}
        y={0}
        textAnchor="end"
        dominantBaseline="middle"
        fill="#111827"
        fontSize={12}
        fontWeight={700}
      >
        {shortenText(payload.value, 18)}
      </text>
    </g>
  );
}

/*
 * Shows all attendance information when the
 * student hovers over one subject bar.
 */
function SubjectAttendanceTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const subject = payload[0]?.payload;

  return (
    <div className="min-w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="border-b border-gray-100 pb-3">
        <p className="font-extrabold text-gray-950">{subject.subjectName}</p>

        {subject.subjectCode && (
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">
            {subject.subjectCode}
          </p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <TooltipRow
          label="Total classes"
          value={subject.totalClasses}
          color="#6b7280"
        />

        <TooltipRow label="Present" value={subject.present} color="#16a34a" />

        <TooltipRow label="Absent" value={subject.absent} color="#dc2626" />

        <TooltipRow label="Late" value={subject.late} color="#eab308" />

        <TooltipRow label="Leave" value={subject.leave} color="#2563eb" />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
        <span className="text-sm font-bold text-gray-600">Attendance</span>

        <span
          className="text-lg font-extrabold"
          style={{
            color: getPercentageColor(subject.percentage),
          }}
        >
          {subject.percentage}%
        </span>
      </div>

      <div className="mt-3">
        <PerformanceBadge percentage={subject.percentage} />
      </div>
    </div>
  );
}

function TooltipRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between gap-8 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span className="font-semibold text-gray-600">{label}</span>
      </div>

      <span className="font-extrabold text-gray-950">{value}</span>
    </div>
  );
}

function PerformanceBadge({ percentage }) {
  let text = "Critical attendance";
  let classes = "bg-red-50 text-red-700 border-red-200";

  if (percentage >= 90) {
    text = "Excellent attendance";
    classes = "bg-green-50 text-green-700 border-green-200";
  } else if (percentage >= 75) {
    text = "Good attendance";
    classes = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (percentage >= 60) {
    text = "Attendance warning";
    classes = "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center text-xs font-extrabold ${classes}`}
    >
      {text}
    </div>
  );
}

function ChartLegend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span>{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-gray-50 p-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xl">
        📊
      </div>

      <p className="font-bold text-gray-700">No attendance report found</p>

      <p className="mt-1 text-sm text-gray-500">
        Attendance has not been marked for this month.
      </p>
    </div>
  );
}

function getPercentageColor(percentage) {
  if (percentage >= 90) {
    return "#16a34a";
  }

  if (percentage >= 75) {
    return "#2563eb";
  }

  if (percentage >= 60) {
    return "#eab308";
  }

  return "#dc2626";
}

function shortenText(text, maximumLength) {
  if (!text) {
    return "";
  }

  if (text.length <= maximumLength) {
    return text;
  }

  return `${text.slice(0, maximumLength)}...`;
}
