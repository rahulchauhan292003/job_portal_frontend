import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { getMyApplications } from "../../services/application.api";

import {
  setApplications,
  setApplicationsLoading,
  setApplicationsError,
} from "../../store/slices/applicationSlice";

const MyApplications = () => {
  const dispatch = useDispatch();

  const { myApplications, loading, error } = useSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        dispatch(setApplicationsLoading(true));
        dispatch(setApplicationsError(null));

        const response = await getMyApplications();

        dispatch(setApplications(response.data));
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load applications";

        dispatch(setApplicationsError(message));
        toast.error(message);
      } finally {
        dispatch(setApplicationsLoading(false));
      }
    };

    fetchApplications();
  }, [dispatch]);

  const getStatusClass = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "hired":
        return "bg-blue-100 text-blue-700";

      case "reviewing":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center py-10 text-gray-500">
          Loading applications...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="border rounded-xl p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>

        <p className="text-gray-500 mt-2">
          Track the jobs you have applied for.
        </p>
      </div>

      {/* Empty State */}
      {myApplications.length === 0 && (
        <div className="border rounded-xl p-10 text-center">
          <h2 className="text-xl font-semibold">No applications yet</h2>

          <p className="text-gray-500 mt-2">
            You haven't applied to any jobs yet.
          </p>
        </div>
      )}

      {/* Applications */}
      {myApplications.length > 0 && (
        <div className="space-y-4">
          {myApplications.map((application) => (
            <article key={application._id} className="border rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Job Info */}
                <div>
                  <h2 className="text-xl font-semibold">
                    {application.job?.title}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {application.job?.company}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    📍 {application.job?.location}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize w-fit ${getStatusClass(
                    application.status,
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              {/* Application Date */}
              <div className="border-t mt-5 pt-4">
                <p className="text-sm text-gray-500">
                  Applied on{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyApplications;
