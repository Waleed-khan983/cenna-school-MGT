"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAwardRecommendations } from "@/store/coordinatorSlice";

export default function CoordinatorAwardsPage() {
  const dispatch = useDispatch();

  const { awards = {} } = useSelector(
    (state) => state.coordinator
  );

  useEffect(() => {
    dispatch(fetchAwardRecommendations());
  }, [dispatch]);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-extrabold">
        Award Recommendations
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        <AwardCard
          title="🏆 Best Student"
          name={awards.bestStudent?.student?.user?.name}
          value={`${awards.bestStudent?.percentage || 0}%`}
        />

        <AwardCard
          title="👨‍🏫 Best Teacher"
          name={awards.bestTeacher?.teacher?.user?.name}
          value={awards.bestTeacher?.score}
        />

        <AwardCard
          title="✅ Perfect Attendance"
          name={
            awards.perfectAttendance?.student?.user?.name
          }
          value={`${awards.perfectAttendance?.percentage || 0}%`}
        />

        <AwardCard
          title="🌟 Positive Student"
          name={
            awards.positiveStudent?.student?.user?.name
          }
          value={`${awards.positiveStudent?.remarks || 0} Remarks`}
        />

      </div>
    </section>
  );
}

function AwardCard({
  title,
  name,
  value,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-4 text-lg font-semibold">
        {name || "-"}
      </p>

      <p className="text-gray-500">
        {value}
      </p>
    </div>
  );
}