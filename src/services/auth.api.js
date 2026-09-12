import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/auth/users");

  return response.data;
};

export const updateUserStatus = async (
  userId,
  status
) => {
  const response = await api.patch(
    `/auth/users/${userId}/status`,
    { status }
  );

  return response.data;
};

export const getRecruiters = async () => {
  const response = await api.get("/auth/recruiters");
  return response.data;
};

export const getRecruiterDetails = async (recruiterId) => {
  const response = await api.get(
    `/auth/recruiters/${recruiterId}`
  );

  return response.data;
};

export const createRecruiter = async (recruiterData) => {
  const response = await api.post(
    "/auth/recruiters",
    recruiterData
  );

  return response.data;
};