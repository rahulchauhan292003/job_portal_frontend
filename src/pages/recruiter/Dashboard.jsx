import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getRecruiterJobs } from "../../services/job.api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Jobs */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">My Jobs</h2>
      </div>

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
              <h3 className="text-xl font-semibold">{job.title}</h3>

              <p className="text-gray-600 mt-1">{job.company}</p>

              <p className="text-sm text-gray-500 mt-2">📍 {job.location}</p>

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
              <div className="flex gap-3 mt-5">
                <Link
                  to={`/recruiter/jobs/${job.jobId}/applications`}
                  className="flex-1 text-center border px-4 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  View Applications
                </Link>

                <Link
                  to={`/recruiter/jobs/${job.jobId}`}
                  className="border px-4 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default RecruiterDashboard;
