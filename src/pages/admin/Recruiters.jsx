import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import {
  getUsers,
  updateUserStatus,
  createRecruiter,
} from "../../services/auth.api";

import {
  setUsers,
  setUsersLoading,
  setUsersError,
  updateUserInStore,
} from "../../store/slices/userSlice";

const Recruiters = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.users);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const recruiters = users.filter((user) => user.role === "recruiter");

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        dispatch(setUsersLoading(true));
        dispatch(setUsersError(null));

        const response = await getUsers();

        dispatch(setUsers(response.data));
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load recruiters";

        dispatch(setUsersError(message));
        toast.error(message);
      } finally {
        dispatch(setUsersLoading(false));
      }
    };

    fetchRecruiters();
  }, [dispatch]);

  const handleStatusChange = async (userId, status) => {
    try {
      const response = await updateUserStatus(userId, status);

      dispatch(updateUserInStore(response.data));

      toast.success("Recruiter status updated");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update recruiter status";

      toast.error(message);
    }
  };

  const handleCreateRecruiter = async (data) => {
    try {
      const response = await createRecruiter(data);

      dispatch(setUsers([response.data, ...users]));

      toast.success("Recruiter created successfully");

      reset();
      setShowCreateModal(false);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create recruiter";

      toast.error(message);
    }
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    reset();
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="mb-4 inline-block text-sm text-gray-500 hover:text-black"
          >
            ← Back to Admin Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Recruiter Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage recruiter accounts and their access status.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Total Recruiters</p>

            <p className="mt-2 text-3xl font-bold">{recruiters.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Active Recruiters</p>

            <p className="mt-2 text-3xl font-bold">
              {recruiters.filter((user) => user.status === "active").length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-500">Blocked Recruiters</p>

            <p className="mt-2 text-3xl font-bold">
              {recruiters.filter((user) => user.status === "blocked").length}
            </p>
          </div>
        </div>

        {/* Recruiters */}
        <div className="overflow-hidden rounded-xl border bg-white">
          {/* Table Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recruiters</h2>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Create Recruiter
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-8 text-center text-gray-500">
              Loading recruiters...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-8 text-center text-red-500">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && recruiters.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No recruiters found.
            </div>
          )}

          {/* Table */}
          {!loading && !error && recruiters.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Name</th>

                    <th className="px-6 py-4">Email</th>

                    <th className="px-6 py-4">Status</th>

                    <th className="px-6 py-4">Joined</th>

                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recruiters.map((recruiter) => (
                    <tr key={recruiter._id}>
                      <td className="px-6 py-4 font-medium">
                        {recruiter.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {recruiter.email}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={recruiter.status}
                          onChange={(event) =>
                            handleStatusChange(
                              recruiter._id,
                              event.target.value,
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          <option value="active">Active</option>

                          <option value="inactive">Inactive</option>

                          <option value="blocked">Blocked</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(recruiter.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/recruiters/${recruiter._id}`}
                          className="inline-block rounded-lg bg-black px-6 py-3 text-sm text-white transition hover:bg-gray-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* CREATE RECRUITER MODAL */}
      {/* ================================================= */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          {/* Modal */}
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Recruiter
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new recruiter account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-2xl leading-none text-gray-400 transition hover:text-black disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(handleCreateRecruiter)}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter recruiter name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter recruiter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Recruiter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruiters;
