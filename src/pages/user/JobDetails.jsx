import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getJobById } from "../../services/job.api";
import { applyForJob, getMyApplications } from "../../services/application.api";

import {
  setSelectedJob,
  setJobsLoading,
  setJobsError,
  clearSelectedJob,
} from "../../store/slices/jobSlice";

import DynamicQuestion from "../../components/DynamicQuestion";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedJob, loading, error } = useSelector((state) => state.jobs);

  const { user } = useSelector((state) => state.auth);

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const isRecruiter = user?.role === "recruiter";
  const isAdmin = user?.role === "admin";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        dispatch(setJobsLoading(true));
        dispatch(setJobsError(null));
        dispatch(clearSelectedJob());

        // Get job details
        const response = await getJobById(jobId);

        dispatch(setSelectedJob(response.data));

        // Check application status only for normal users
        if (user?.role === "user") {
          const applicationsResponse = await getMyApplications();

          const applications = applicationsResponse.data || [];

          const hasApplied = applications.some(
            (application) => application.job?.jobId === jobId,
          );

          setAlreadyApplied(hasApplied);
        } else {
          setAlreadyApplied(false);
        }
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load job details";

        dispatch(setJobsError(message));
        toast.error(message);
      } finally {
        dispatch(setJobsLoading(false));
      }
    };

    fetchJob();
  }, [jobId, dispatch, user?.role]);

  // Submit application
  const onSubmit = async (formData) => {
    // Recruiter/admin should never submit an application
    if (alreadyApplied || isRecruiter || isAdmin) {
      return;
    }

    try {
      const answers = Object.entries(formData.answers || {}).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        }),
      );

      await applyForJob(jobId, answers);

      setAlreadyApplied(true);

      toast.success("Application submitted successfully");

      navigate("/my-applications");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit application";

      toast.error(message);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-10 text-gray-500">
          Loading job details...
        </div>
      </main>
    );
  }

  // Error
  if (error || !selectedJob) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="border rounded-xl p-8 text-center">
          <p className="text-red-500">{error || "Job not found"}</p>

          <button
            type="button"
            onClick={() =>
              navigate(
                isRecruiter || isAdmin ? "/recruiter/dashboard" : "/jobs",
              )
            }
            className="mt-5 bg-black text-white px-5 py-3 rounded-lg"
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* ================= JOB INFORMATION ================= */}

      <section className="border rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold">{selectedJob.title}</h1>

        <p className="text-lg text-gray-600 mt-2">{selectedJob.company}</p>

        <p className="text-sm text-gray-500 mt-2">📍 {selectedJob.location}</p>

        <div className="border-t mt-6 pt-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {selectedJob.description}
          </p>
        </div>
      </section>

      {/* ================= RECRUITER / ADMIN VIEW ================= */}

      {(isRecruiter || isAdmin) && (
        <section className="border rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Application Questions</h2>

            <p className="text-gray-500 mt-1">
              Questions configured for this job.
            </p>
          </div>

          {selectedJob.questions?.length === 0 ? (
            <div className="border rounded-lg p-5 text-center">
              <p className="text-gray-500">No application questions added.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedJob.questions.map((question, index) => (
                <div
                  key={question.questionId}
                  className="border rounded-lg p-4"
                >
                  <p className="font-medium">
                    {index + 1}. {question.label}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Type: {question.type}
                    {" · "}
                    {question.required ? "Required" : "Optional"}
                  </p>

                  {question.options?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Options: {question.options.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recruiter Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate(`/recruiter/jobs/${jobId}/applications`)}
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800"
            >
              View Applications
            </button>

            <button
              type="button"
              onClick={() => navigate("/recruiter/dashboard")}
              className="border px-5 py-3 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </section>
      )}

      {/* ================= USER APPLICATION FORM ================= */}

      {!isRecruiter && !isAdmin && (
        <section className="border rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Apply for this Job</h2>

            <p className="text-gray-500 mt-1">
              Please answer the following questions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {selectedJob.questions?.map((question) => (
                <div key={question.questionId}>
                  <DynamicQuestion
                    question={question}
                    register={register}
                    control={control}
                  />

                  {errors.answers?.[question.questionId] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.answers[question.questionId].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="border px-5 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type={alreadyApplied ? "button" : "submit"}
                disabled={alreadyApplied}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {alreadyApplied ? "✓ Applied" : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
};

export default JobDetails;
