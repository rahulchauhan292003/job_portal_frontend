import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import {
  getRecruiterJobs,
  updateRecruiterJobStatus,
} from "../../services/job.api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState(null);

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);

      const response = await getRecruiterJobs();

      setJobs(response.data || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load recruiter jobs";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleJobStatus = async (jobId, status) => {
    try {
      setUpdatingJobId(jobId);

      const response = await updateRecruiterJobStatus(jobId, status);

      let message = "Job status updated successfully";

      if (status === "closed") {
        message = "Job closed successfully";
      }

      if (status === "active") {
        message = "Job reopened successfully";
      }

      if (status === "deleted") {
        message = "Job deleted successfully";
      }

      toast.success(response.message || message);

      await fetchRecruiterJobs();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update job status";

      toast.error(message);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const result = await Swal.fire({
      title: "Delete this job?",
      text: "This job will no longer be visible to you.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    await handleJobStatus(jobId, "deleted");
  };

  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicantCount || 0),
    0,
  );

  const jobsWithApplicants = jobs.filter(
    (job) => (job.applicantCount || 0) > 0,
  ).length;

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="py-10 text-center text-gray-500">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <p className="text-gray-500 mt-2">
            Manage your jobs and track applicants.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 w-fit"
        >
          Create Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Jobs</p>

          <p className="text-3xl font-bold mt-2">{jobs.length}</p>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Applicants</p>

          <p className="text-3xl font-bold mt-2">{totalApplicants}</p>
        </div>

        <div className="border rounded-xl p-5">
          <p className="text-sm text-gray-500">Jobs With Applicants</p>

          <p className="text-3xl font-bold mt-2">{jobsWithApplicants}</p>
        </div>
      </div>

      {/* Jobs Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">My Jobs</h2>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <h3 className="text-xl font-semibold">No jobs created yet</h3>

          <p className="text-gray-500 mt-2">
            Create your first job to start receiving applications.
          </p>

          <Link
            to="/recruiter/jobs/create"
            className="inline-block mt-5 bg-black text-white px-5 py-3 rounded-lg"
          >
            Create Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <article
              key={job.jobId}
              className="border rounded-xl p-5 hover:shadow-md transition"
            >
              {/* Job Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold truncate">
                    {job.title}
                  </h3>

                  <p className="text-gray-600 mt-1">{job.company}</p>
                </div>

                {/* Status */}
                <span
                  className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${
                    job.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {job.status === "active" ? "Active" : "Closed"}
                </span>
              </div>

              {/* Location */}
              <p className="text-sm text-gray-500 mt-3">📍 {job.location}</p>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                {job.description}
              </p>

              {/* Applicant Count */}
              <div className="border-t mt-5 pt-4">
                <p className="text-sm text-gray-500">Applicants</p>

                <p className="text-2xl font-bold mt-1">
                  {job.applicantCount || 0}
                </p>
              </div>

              {/* Actions */}
              {/* Actions */}
              <div className="flex flex-col gap-3 mt-5">
                {/* View / Edit */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to={`/recruiter/jobs/${job.jobId}/applications`}
                    className="text-center border border-gray-200 bg-white text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Applications
                  </Link>

                  <Link
                    to={`/recruiter/jobs/${job.jobId}`}
                    className="text-center border border-gray-200 bg-white text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    View
                  </Link>

                  <Link
                    to={`/recruiter/jobs/${job.jobId}/edit`}
                    className="text-center border border-gray-300 bg-gray-100 text-gray-800 px-3 py-2.5 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>

                {/* Close / Reopen */}
                <button
                  type="button"
                  disabled={updatingJobId === job.jobId}
                  onClick={() =>
                    handleJobStatus(
                      job.jobId,
                      job.status === "active" ? "closed" : "active",
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-800 text-white hover:bg-gray-900 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingJobId === job.jobId
                    ? "Updating..."
                    : job.status === "active"
                      ? "Close Job"
                      : "Reopen Job"}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  disabled={updatingJobId === job.jobId}
                  onClick={() => handleDeleteJob(job.jobId)}
                  className="w-full px-4 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingJobId === job.jobId ? "Updating..." : "Delete Job"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default RecruiterDashboard;
