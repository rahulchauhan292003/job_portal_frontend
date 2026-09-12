import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getJobById } from "../../services/job.api";
import { applyToAllJobs } from "../../services/application.api";
import DynamicQuestion from "../../components/DynamicQuestion";

const ApplyToAll = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const { register, control, handleSubmit } = useForm();

  const jobIds = searchParams.get("jobs")
    ? searchParams.get("jobs").split(",").filter(Boolean)
    : [];

  // Fetch selected jobs
  useEffect(() => {
    const fetchSelectedJobs = async () => {
      if (jobIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const responses = await Promise.all(
          jobIds.map((jobId) => getJobById(jobId)),
        );

        const fetchedJobs = responses.map((response) => response.data);

        setJobs(fetchedJobs);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load selected jobs";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedJobs();
  }, [searchParams]);

  // Submit applications
  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setResult(null);

      const answersByJob = {};

      jobs.forEach((job) => {
        const jobAnswers = formData.answers?.[job.jobId] || {};

        answersByJob[job.jobId] = job.questions
          .map((question) => ({
            questionId: question.questionId,
            answer: jobAnswers[question.questionId],
          }))
          .filter((item) => item.answer !== undefined && item.answer !== "");
      });

      const response = await applyToAllJobs(jobIds, answersByJob);

      setResult(response.data);

      if (response.data.failed?.length === 0) {
        toast.success("Applications submitted successfully");
      } else {
        toast.success("Applications processed");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit applications";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // No jobs selected
  if (!loading && jobIds.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="border rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold">No Jobs Selected</h1>

          <p className="text-gray-500 mt-2">
            Please select at least one job before applying.
          </p>

          <button
            onClick={() => navigate("/jobs")}
            className="mt-5 bg-black text-white px-5 py-3 rounded-lg"
          >
            Browse Jobs
          </button>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-10 text-gray-500">
          Loading selected jobs...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apply to Selected Jobs</h1>

        <p className="text-gray-500 mt-2">
          Complete the required questions for each job.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          {jobs.map((job, index) => (
            <section key={job.jobId} className="border rounded-xl p-6">
              {/* Job Header */}
              <div className="border-b pb-4 mb-6">
                <p className="text-sm text-gray-500">Application {index + 1}</p>

                <h2 className="text-2xl font-semibold mt-1">{job.title}</h2>

                <p className="text-gray-600 mt-1">{job.company}</p>

                <p className="text-sm text-gray-500 mt-2">📍 {job.location}</p>
              </div>

              {/* Dynamic Questions */}
              <div className="space-y-6">
                {job.questions?.map((question) => (
                  <DynamicQuestion
                    key={question.questionId}
                    question={question}
                    register={register}
                    control={control}
                    namePrefix={`answers.${job.jobId}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            disabled={submitting}
            className="border px-5 py-3 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Submitting..." : `Apply to ${jobs.length} Jobs`}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-8 border rounded-xl p-6">
          <h2 className="text-xl font-semibold">Application Result</h2>

          {/* Submitted */}
          {result.submitted?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-green-600">
                Successfully Applied
              </h3>

              <ul className="mt-2 space-y-1 text-sm">
                {result.submitted.map((jobId) => (
                  <li key={jobId}>✓ {jobId}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Failed */}
          {result.failed?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-red-600">Failed Applications</h3>

              <ul className="mt-2 space-y-2 text-sm">
                {result.failed.map((item) => (
                  <li key={item.jobId}>
                    <span className="font-medium">{item.jobId}</span>:{" "}
                    {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate("/my-applications")}
            className="mt-5 border px-5 py-2.5 rounded-lg"
          >
            View My Applications
          </button>
        </div>
      )}
    </main>
  );
};

export default ApplyToAll;
