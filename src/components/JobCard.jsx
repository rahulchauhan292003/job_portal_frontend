import { Link } from "react-router-dom";

const JobCard = ({
  job,
  role = "user",
  selected = false,
  onSelect,
  updatingJobId,
  onStatusChange,
  onDelete,
}) => {
  const isUser = role === "user";
  const isRecruiter = role === "recruiter";
  const isAdmin = role === "admin";

  return (
    <article
      className={`border rounded-xl p-5 bg-white transition ${
        selected
          ? "border-gray-900 shadow-sm"
          : "border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {job.title}
          </h3>

          <p className="text-gray-600 mt-1">{job.company}</p>
        </div>

        {/* User Selection */}
        {isUser && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect?.(job.jobId)}
            className="w-5 h-5 mt-1 cursor-pointer"
          />
        )}

        {/* Status */}
        {!isUser && (
          <span
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${
              job.status === "active"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.status === "active" ? "Active" : "Closed"}
          </span>
        )}
      </div>

      {/* Location */}
      <p className="text-sm text-gray-500 mt-4">📍 {job.location}</p>

      {/* Description - Always 2 lines */}
      <p className="text-sm text-gray-600 mt-4 line-clamp-2 h-10 leading-5">
        {job.description}
      </p>

      {/* Applicant Count */}
      {!isUser && (
        <div className="border-t border-gray-200 mt-5 pt-4">
          <p className="text-sm text-gray-500">Applicants</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {job.applicantCount || 0}
          </p>
        </div>
      )}

      {/* User Actions */}
      {isUser && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500">
            {job.questions?.length || 0} questions
          </p>

          <Link
            to={`/jobs/${job.jobId}`}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition text-sm font-medium"
          >
            View Job
          </Link>
        </div>
      )}

      {/* Recruiter Actions */}
      {isRecruiter && (
        <div className="flex flex-col gap-3 mt-5">
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

          <button
            type="button"
            disabled={updatingJobId === job.jobId}
            onClick={() =>
              onStatusChange?.(
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

          <button
            type="button"
            disabled={updatingJobId === job.jobId}
            onClick={() => onDelete?.(job.jobId)}
            className="w-full px-4 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingJobId === job.jobId ? "Updating..." : "Delete Job"}
          </button>
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex flex-col gap-3 mt-5">
          {/* Recruiter Info */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">Created By</p>

            <p className="font-medium text-gray-900 mt-1">
              {job.createdBy?.name || "N/A"}
            </p>

            {job.createdBy?.email && (
              <p className="text-sm text-gray-500 mt-1">
                {job.createdBy.email}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-3">
              Created:{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {/* Actions */}
          {job.status === "active" && (
            <>
              <button
                type="button"
                disabled={updatingJobId === job.jobId}
                onClick={() => onStatusChange?.(job.jobId, "closed")}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-800 text-white hover:bg-gray-900 transition font-medium disabled:opacity-50"
              >
                {updatingJobId === job.jobId ? "Updating..." : "Close Job"}
              </button>

              <button
                type="button"
                disabled={updatingJobId === job.jobId}
                onClick={() => onStatusChange?.(job.jobId, "deleted")}
                className="w-full px-4 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50"
              >
                {updatingJobId === job.jobId ? "Updating..." : "Delete Job"}
              </button>
            </>
          )}

          {job.status === "closed" && (
            <>
              <button
                type="button"
                disabled={updatingJobId === job.jobId}
                onClick={() => onStatusChange?.(job.jobId, "active")}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-800 text-white hover:bg-gray-900 transition font-medium disabled:opacity-50"
              >
                {updatingJobId === job.jobId ? "Updating..." : "Reopen Job"}
              </button>

              <button
                type="button"
                disabled={updatingJobId === job.jobId}
                onClick={() => onStatusChange?.(job.jobId, "deleted")}
                className="w-full px-4 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-50"
              >
                {updatingJobId === job.jobId ? "Updating..." : "Delete Job"}
              </button>
            </>
          )}

          {job.status === "deleted" && (
            <button
              type="button"
              disabled={updatingJobId === job.jobId}
              onClick={() => onStatusChange?.(job.jobId, "active")}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition font-medium disabled:opacity-50"
            >
              {updatingJobId === job.jobId ? "Restoring..." : "Restore Job"}
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default JobCard;
