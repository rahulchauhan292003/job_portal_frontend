import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getUsers, updateUserStatus } from "../../services/auth.api";
import {
  setUsers,
  setUsersLoading,
  setUsersError,
  updateUserInStore,
} from "../../store/slices/userSlice";

const Recruiters = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.users);

  const recruiters = users.filter((user) => user.role === "recruiter");

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        dispatch(setUsersLoading(true));

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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
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
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recruiters</h2>
          </div>

          {loading && (
            <div className="p-8 text-center text-gray-500">
              Loading recruiters...
            </div>
          )}

          {!loading && error && (
            <div className="p-8 text-center text-red-500">{error}</div>
          )}

          {!loading && !error && recruiters.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No recruiters found.
            </div>
          )}

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
    </div>
  );
};

export default Recruiters;
