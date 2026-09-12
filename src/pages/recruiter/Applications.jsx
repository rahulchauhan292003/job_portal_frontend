import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getApplicationsByJob,
  updateApplicationStatus,
} from "../../services/application.api";

const STATUS_OPTIONS = [
  "applied",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

const Applications = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await getApplicationsByJob(jobId);

      setApplications(response.data || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load applications";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await updateApplicationStatus(
        applicationId,
        status
      );

      const updatedApplication = response.data;

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: updatedApplication.status,
              }
            : application
        )
      );

      toast.success("Application status updated");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update status";

      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

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
        <div className="py-10 text-center text-gray-500">
          Loading applications...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Job Applications
        </h1>

        <p className="text-gray-500 mt-2">
          Review applicants and update their application status.
        </p>
      </div>

      {/* Empty */}
      {applications.length === 0 && (
        <div className="border rounded-xl p-10 text-center">
          <h2 className="text-xl font-semibold">
            No applications yet
          </h2>

          <p className="text-gray-500 mt-2">
            No applicants have applied for this job.
          </p>
        </div>
      )}

      {/* Applications */}
      {applications.length > 0 && (
        <div className="space-y-5">
          {applications.map((application) => (
            <article
              key={application._id}
              className="border rounded-xl p-6"
            >
              {/* Applicant */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    {application.applicant?.name ||
                      "Unknown Applicant"}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {application.applicant?.email}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Applied on{" "}
                    {new Date(
                      application.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize w-fit ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              {/* Answers */}
              {application.answers?.length > 0 && (
                <div className="border-t mt-5 pt-5">
                  <h3 className="font-semibold mb-4">
                    Application Answers
                  </h3>

                  <div className="space-y-3">
                    {application.answers.map(
                      (answer) => (
                        <div
                          key={answer.questionId}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <p className="text-xs text-gray-500">
                            Question ID
                          </p>

                          <p className="text-sm mt-1 break-all">
                            {answer.questionId}
                          </p>

                          <p className="text-xs text-gray-500 mt-3">
                            Answer
                          </p>

                          <p className="text-sm font-medium mt-1">
                            {Array.isArray(
                              answer.answer
                            )
                              ? answer.answer.join(", ")
                              : String(
                                  answer.answer
                                )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t mt-5 pt-5">
                <label className="block text-sm font-medium mb-2">
                  Update Status
                </label>

                <select
                  value={application.status}
                  disabled={
                    updatingId === application._id
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      application._id,
                      event.target.value
                    )
                  }
                  className="border rounded-lg px-4 py-2.5 outline-none focus:ring-2"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                {updatingId === application._id && (
                  <span className="text-sm text-gray-500 ml-3">
                    Updating...
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Applications;