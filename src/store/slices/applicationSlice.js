import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "applications",

  initialState,

  reducers: {
    setApplications: (state, action) => {
      state.myApplications = action.payload;
    },

    setApplicationsLoading: (state, action) => {
      state.loading = action.payload;
    },

    setApplicationsError: (state, action) => {
      state.error = action.payload;
    },

    clearApplications: (state) => {
      state.myApplications = [];
      state.error = null;
    },
  },
});

export const {
  setApplications,
  setApplicationsLoading,
  setApplicationsError,
  clearApplications,
} = applicationSlice.actions;

export default applicationSlice.reducer;