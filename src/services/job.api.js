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

export const updateRecruiterJobStatus = async (jobId, status) => {
  const response = await api.patch(`/jobs/${jobId}/status`, {
    status,
  });

  return response.data;
};

// Admin - get all jobs
export const getAdminJobs = async (params = {}) => {
  const response = await api.get("/jobs/admin", {
    params,
  });

  return response.data;
};

// Admin - update job status
export const updateAdminJobStatus = async (jobId, status) => {
  const response = await api.patch(`/jobs/admin/${jobId}/status`, {
    status,
  });

  return response.data;
};

export const updateRecruiterJob = async (jobId, jobData) => {
  const response = await api.patch(`/jobs/${jobId}`, jobData);
  return response.data;
};
