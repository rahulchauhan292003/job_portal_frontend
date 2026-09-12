import api from "./api";

export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data;
};

export const getRecruiterJobs = async () => {
  const response = await api.get("/jobs/recruiter");

  return response.data;
};
