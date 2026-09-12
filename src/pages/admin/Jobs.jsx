import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import JobCard from "../../components/JobCard";

import { getAdminJobs, updateAdminJobStatus } from "../../services/job.api";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getAdminJobs({
        search,
        status,
        page,
        limit: 10,
      });

      setJobs(response.jobs || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load jobs";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [search, status]);

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      setUpdatingJobId(jobId);

      const response = await updateAdminJobStatus(jobId, newStatus);

      toast.success(response.message || "Job status updated successfully");

      await fetchJobs(pagination.page);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update job status";

      toast.error(message);
    } finally {
      setUpdatingJobId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Management</h1>

        <p className="text-gray-500 mt-2">
          Manage all jobs available on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="border border-gray-200 rounded-xl p-5 mb-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Search Jobs
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company or location"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="border border-gray-200 rounded-xl p-10 text-center">
          <h2 className="text-xl font-semibold">No jobs found</h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                role="admin"
                updatingJobId={updatingJobId}
                onStatusChange={handleStatusUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                type="button"
                disabled={pagination.page === 1 || loading}
                onClick={() => fetchJobs(pagination.page - 1)}
                className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={pagination.page === pagination.totalPages || loading}
                onClick={() => fetchJobs(pagination.page + 1)}
                className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default AdminJobs;
