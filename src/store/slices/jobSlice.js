import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  selectedJob: null,
  pagination: {
    page: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
      state.pagination = action.payload.pagination;
    },

    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },

    setJobsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setJobsError: (state, action) => {
      state.error = action.payload;
    },

    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
});

export const {
  setJobs,
  setSelectedJob,
  setJobsLoading,
  setJobsError,
  clearSelectedJob,
} = jobSlice.actions;

export default jobSlice.reducer;
