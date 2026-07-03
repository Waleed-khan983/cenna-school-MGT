"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchActiveEvaluations,
  submitEvaluation,
} from "@/store/evaluationSlice";

import PageLoader from "@/components/ui/PageLoader";

const questions = [
  { name: "punctuality", label: "Teacher comes to class on time" },
  { name: "teachingQuality", label: "Teacher explains lessons clearly" },
  { name: "assignmentGiven", label: "Teacher gives assignments regularly" },
  { name: "assignmentChecking", label: "Teacher checks assignments" },
  { name: "communication", label: "Teacher answers student questions" },
  { name: "discipline", label: "Teacher behaves respectfully" },
];

const ratingOptions = [
  "Strongly Agree",
  "Agree",
  "Good",
  "Disagree",
];

const defaultAnswers = {
  punctuality: "Strongly Agree",
  teachingQuality: "Strongly Agree",
  assignmentGiven: "Strongly Agree",
  assignmentChecking: "Strongly Agree",
  communication: "Strongly Agree",
  discipline: "Strongly Agree",
  remarks: "",
};

export default function StudentEvaluationPage() {
  const dispatch = useDispatch();

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [form, setForm] = useState(defaultAnswers);

  const { activeCampaigns, loading, error } = useSelector(
    (state) => state.evaluations
  );

  useEffect(() => {
    dispatch(fetchActiveEvaluations());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setForm(defaultAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCampaign) {
      toast.error("Please select an evaluation");
      return;
    }

    try {
      await dispatch(
        submitEvaluation({
          campaign: selectedCampaign._id,
          teacher: selectedCampaign.teacher?._id,
          ...form,
        })
      ).unwrap();

      toast.success("Evaluation submitted successfully");

      setSelectedCampaign(null);
      setForm(defaultAnswers);
      dispatch(fetchActiveEvaluations());
    } catch (error) {
      toast.error(error || "Failed to submit evaluation");
    }
  };

  if (loading) return <PageLoader text="Loading evaluations..." />;

  return (
    <section className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          Teacher Evaluation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete evaluations launched by the school admin.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {!selectedCampaign && (
        <div className="grid gap-4 md:grid-cols-2">
          {activeCampaigns.length > 0 ? (
            activeCampaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-extrabold text-black">
                  {campaign.teacher?.user?.name || "Teacher"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {campaign.month} {campaign.year}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Last Date:{" "}
                  {campaign.endDate
                    ? new Date(campaign.endDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <button
                  type="button"
                  onClick={() => handleSelectCampaign(campaign)}
                  className="mt-5 !cursor-pointer rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-gray-800"
                >
                  Start Evaluation
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border bg-white p-10 text-center font-semibold text-gray-500 shadow-sm md:col-span-2">
              No active evaluations are available right now.
            </div>
          )}
        </div>
      )}

      {selectedCampaign && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-black">
                {selectedCampaign.teacher?.user?.name || "Teacher"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedCampaign.month} {selectedCampaign.year}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCampaign(null)}
              className="!cursor-pointer rounded-xl bg-gray-100 px-5 py-3 font-bold text-black"
            >
              Back
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {questions.map((question) => (
              <RatingBox
                key={question.name}
                label={question.label}
                name={question.name}
                value={form[question.name]}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Remarks
            </label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={4}
              placeholder="Write your feedback..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 !cursor-pointer rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Evaluation"}
          </button>
        </form>
      )}
    </section>
  );
}

function RatingBox({ label, name, value, onChange }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="mb-3 font-bold text-black">{label}</p>

      <div className="flex flex-wrap gap-2">
        {ratingOptions.map((option) => (
          <label
            key={option}
            className={`!cursor-pointer rounded-xl px-4 py-2 text-sm font-bold ${
              value === option
                ? "bg-black text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="hidden"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}