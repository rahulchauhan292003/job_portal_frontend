import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    setUsersLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUsersError: (state, action) => {
      state.error = action.payload;
    },

    updateUserInStore: (state, action) => {
      const updatedUser = action.payload;

      const index = state.users.findIndex(
        (user) => user._id === updatedUser._id,
      );

      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
  },
});

export const { setUsers, setUsersLoading, setUsersError, updateUserInStore } =
  userSlice.actions;

export default userSlice.reducer;
