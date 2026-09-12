import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

import JobCard from "../../components/JobCard";

import {
  getRecruiterJobs,
  updateRecruiterJobStatus,
} from "../../services/job.api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState(null);

  // Fetch recruiter jobs
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

  // Close / Reopen / Delete
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

  // Delete confirmation
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

  // Stats
  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicantCount || 0),
    0,
  );

  const jobsWithApplicants = jobs.filter(
    (job) => (job.applicantCount || 0) > 0,
  ).length;

  // Loading
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
          className="bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-black transition w-fit"
        >
          Create Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <p className="text-sm text-gray-500">Total Jobs</p>

          <p className="text-3xl font-bold mt-2">{jobs.length}</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <p className="text-sm text-gray-500">Total Applicants</p>

          <p className="text-3xl font-bold mt-2">{totalApplicants}</p>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
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
        <div className="border border-gray-200 rounded-xl p-10 text-center">
          <h3 className="text-xl font-semibold">No jobs created yet</h3>

          <p className="text-gray-500 mt-2">
            Create your first job to start receiving applications.
          </p>

          <Link
            to="/recruiter/jobs/create"
            className="inline-block mt-5 bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-black transition"
          >
            Create Job
          </Link>
        </div>
      ) : (
        /* Jobs */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job.jobId}
              job={job}
              role="recruiter"
              updatingJobId={updatingJobId}
              onStatusChange={handleJobStatus}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default RecruiterDashboard;
