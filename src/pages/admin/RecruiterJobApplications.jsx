import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAdminApplicationsByJob } from "../../services/application.api";

const RecruiterJobApplications = () => {
  const { jobId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getAdminApplicationsByJob(jobId);
        setData(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load applications",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading) {
    return <div className="p-8 text-center">Loading applications...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        Applications not found.
      </div>
    );
  }

  const { job, applications } = data;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin/recruiters"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Recruiters
        </Link>

        <div className="mt-6 rounded-xl border bg-white p-6">
          <h1 className="text-2xl font-bold">{job.title}</h1>

          <p className="mt-2 text-gray-600">
            {job.company} · {job.location}
          </p>

          <div className="mt-4 flex gap-6 text-sm">
            <span>
              Recruiter: <strong>{job.createdBy?.name}</strong>
            </span>

            <span>
              Applications: <strong>{applications.length}</strong>
            </span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Applicants</h2>

          {applications.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              No applications received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="rounded-xl border bg-white p-6"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <h3 className="font-semibold">
                        {application.applicant?.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {application.applicant?.email}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Applied:{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="h-fit rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <h4 className="mb-3 font-medium">Answers</h4>

                    <div className="space-y-2">
                      {application.answers.map((answer) => (
                        <div
                          key={answer.questionId}
                          className="rounded-lg bg-gray-50 p-3"
                        >
                          {/* <p className="text-xs text-gray-500">Question ID</p> */}

                          <p className="text-sm text-gray-500">
                            {data.job.questions.find(
                              (question) =>
                                question.questionId === answer.questionId,
                            )?.label || "Question"}
                          </p>

                          <p className="mt-1 text-gray-800">
                            {Array.isArray(answer.answer)
                              ? answer.answer.join(", ")
                              : String(answer.answer)}
                          </p>
                        </div>
                      ))}
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

export default RecruiterJobApplications;
