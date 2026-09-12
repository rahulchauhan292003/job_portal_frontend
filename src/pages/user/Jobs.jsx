import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import JobCard from "../../components/JobCard";
import { getJobs } from "../../services/job.api";

import {
  setJobs,
  setJobsLoading,
  setJobsError,
} from "../../store/slices/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, pagination, loading, error } = useSelector(
    (state) => state.jobs,
  );

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [selectedJobIds, setSelectedJobIds] = useState([]);

  const isFirstRender = useRef(true);

  // Fetch jobs
  const fetchJobs = async (currentPage = 1) => {
    try {
      dispatch(setJobsLoading(true));
      dispatch(setJobsError(null));

      const response = await getJobs({
        search: search.trim(),
        location: location.trim(),
        page: currentPage,
        limit: 10,
      });

      dispatch(
        setJobs({
          jobs: response.data || [],
          pagination: response.pagination,
        }),
      );
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load jobs";

      dispatch(setJobsError(message));
      toast.error(message);
    } finally {
      dispatch(setJobsLoading(false));
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(1);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);
      fetchJobs(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, location]);

  // Pagination
  useEffect(() => {
    if (page === 1) return;

    fetchJobs(page);
  }, [page]);

  // Search form
  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    fetchJobs(1);
  };

  // Select / unselect job
  const handleJobSelection = (jobId) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  // Apply to selected jobs
  const handleApplyToAll = () => {
    if (selectedJobIds.length === 0) {
      toast.error("Please select at least one job");
      return;
    }

    navigate(`/apply-all?jobs=${selectedJobIds.join(",")}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Next Job</h1>

        <p className="text-gray-500 mt-2">
          Explore opportunities and apply to the ones you like.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 mb-6"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by job title or company"
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Location */}
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          className="md:w-56 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
        >
          Search
        </button>
      </form>

      {/* Apply Selected Jobs */}
      {selectedJobIds.length > 0 && (
        <div className="mb-6 flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium">
            {selectedJobIds.length} job
            {selectedJobIds.length > 1 ? "s" : ""} selected
          </p>

          <button
            type="button"
            onClick={handleApplyToAll}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition"
          >
            Apply to Selected Jobs
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-gray-500">Loading jobs...</div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="border border-gray-200 rounded-lg p-5 text-center">
          <p className="text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => fetchJobs(page)}
            className="mt-3 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <div className="py-10 text-center text-gray-500">No jobs found.</div>
      )}

      {/* Jobs */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                role="user"
                selected={selectedJobIds.includes(job.jobId)}
                onSelect={handleJobSelection}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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

export default Jobs;
