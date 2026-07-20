"use client";

import EvaluationSubmissionPanel from "@/components/portals/EvaluationSubmissionPanel";

export default function StudentEvaluationPage() {
  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          Teacher Evaluation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete evaluations assigned by the school admin.
        </p>
      </div>

      <EvaluationSubmissionPanel />
    </section>
  );
}
