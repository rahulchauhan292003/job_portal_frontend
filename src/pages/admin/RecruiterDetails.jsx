import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getRecruiterDetails } from "../../services/auth.api";

const RecruiterDetails = () => {
  const { recruiterId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const response = await getRecruiterDetails(recruiterId);

        // console.log("--->>>",response)

        setData(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load recruiter",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, [recruiterId]);

  if (loading) {
    return <div className="p-8 text-center">Loading recruiter...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">Recruiter not found</div>
    );
  }

  const { recruiter, stats, jobs } = data;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin/recruiters"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Recruiters
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">{recruiter.name}</h1>

          <p className="mt-2 text-gray-600">{recruiter.email}</p>

          <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            {recruiter.status}
          </span>
        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Total Jobs</p>

            <p className="mt-2 text-3xl font-bold">{stats.totalJobs}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Total Applications</p>

            <p className="mt-2 text-3xl font-bold">{stats.totalApplications}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Active Jobs</p>

            <p className="mt-2 text-3xl font-bold">{stats.activeJobs}</p>
          </div>
        </div>

        {/* Jobs */}

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">Jobs Created</h2>

          {jobs.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              This recruiter has not created any jobs yet.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="rounded-xl border bg-white p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>

                      <p className="mt-1 text-gray-600">
                        {job.company} · {job.location}
                      </p>

                      <p className="mt-3 text-sm text-gray-500">
                        Created: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {job.applicantCount}
                        </p>

                        <p className="text-sm text-gray-500">Applicants</p>
                      </div>

                      <Link
                        to={`/admin/recruiters/${recruiterId}/jobs/${job._id}/applications`}
                        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                      >
                        View Applications
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDetails;
