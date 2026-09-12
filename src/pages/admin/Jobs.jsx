import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  const getStatusClass = (jobStatus) => {
    if (jobStatus === "active") {
      return "bg-green-100 text-green-700";
    }

    if (jobStatus === "closed") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
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
      <div className="border rounded-xl p-5 mb-8">
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
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-black"
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
        /* Empty */
        <div className="border rounded-xl p-10 text-center">
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
              <article
                key={job.jobId}
                className="border rounded-xl p-5 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>

                    <p className="text-gray-600 mt-1">{job.company}</p>
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusClass(
                      job.status,
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Location */}
                <p className="text-sm text-gray-500 mt-3">📍 {job.location}</p>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Recruiter */}
                <div className="border-t mt-5 pt-4">
                  <p className="text-sm text-gray-500">Created By</p>

                  <p className="font-medium mt-1">
                    {job.createdBy?.name || "N/A"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {job.createdBy?.email || ""}
                  </p>
                </div>

                {/* Created At */}
                <p className="text-xs text-gray-400 mt-4">
                  Created:{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  {job.status === "active" && (
                    <>
                      <button
                        type="button"
                        disabled={updatingJobId === job.jobId}
                        onClick={() => handleStatusUpdate(job.jobId, "closed")}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                      >
                        {updatingJobId === job.jobId ? "Updating..." : "Close"}
                      </button>

                      <button
                        type="button"
                        disabled={updatingJobId === job.jobId}
                        onClick={() => handleStatusUpdate(job.jobId, "deleted")}
                        className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {job.status === "closed" && (
                    <>
                      <button
                        type="button"
                        disabled={updatingJobId === job.jobId}
                        onClick={() => handleStatusUpdate(job.jobId, "active")}
                        className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingJobId === job.jobId ? "Updating..." : "Reopen"}
                      </button>

                      <button
                        type="button"
                        disabled={updatingJobId === job.jobId}
                        onClick={() => handleStatusUpdate(job.jobId, "deleted")}
                        className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}

                 {job.status === "deleted" && (
  <button
    type="button"
    disabled={updatingJobId === job.jobId}
    onClick={() =>
      handleStatusUpdate(job.jobId, "active")
    }
    className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
  >
    {updatingJobId === job.jobId
      ? "Restoring..."
      : "Restore Job"}
  </button>
)}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                type="button"
                disabled={pagination.page === 1 || loading}
                onClick={() => fetchJobs(pagination.page - 1)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
