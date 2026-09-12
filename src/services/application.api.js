import api from "./api";

export const applyForJob = async (jobId, answers) => {
  const response = await api.post(`/applications/${jobId}/apply`, { answers });

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications");

  return response.data;
};

export const applyToAllJobs = async (jobIds, answersByJob) => {
  const response = await api.post("/applications/bulk", {
    jobIds,
    answersByJob,
  });

  return response.data;
};

export const getRecruiterApplications = async () => {
  const response = await api.get("/applications/recruiter");

  return response.data;
};

export const getApplicationsByJob = async (jobId) => {
  const response = await api.get(`/applications/recruiter/job/${jobId}`);

  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, {
    status,
  });

  return response.data;
};

export const getAdminApplicationsByJob = async (jobId) => {
  const response = await api.get(`/applications/admin/job/${jobId}`);

  return response.data;
};
