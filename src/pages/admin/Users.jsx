import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  getUsers,
  updateUserStatus,
} from "../../services/auth.api";

import {
  setUsers,
  setUsersLoading,
  setUsersError,
  updateUserInStore,
} from "../../store/slices/userSlice";

const STATUS_OPTIONS = [
  "active",
  "inactive",
  "blocked",
];

const Users = () => {
  const dispatch = useDispatch();

  const {
    users,
    loading,
    error,
  } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setUsersLoading(true));
        dispatch(setUsersError(null));

        const response = await getUsers();

        dispatch(setUsers(response.data || []));
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load users";

        dispatch(setUsersError(message));
        toast.error(message);
      } finally {
        dispatch(setUsersLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleStatusChange = async (
    userId,
    status
  ) => {
    try {
      const response = await updateUserStatus(
        userId,
        status
      );

      dispatch(updateUserInStore(response.data));

      toast.success("User status updated");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update user status";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center py-10 text-gray-500">
          Loading users...
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        <p className="text-gray-500 mt-2">
          View users and manage their account status.
        </p>
      </div>

      {error && (
        <div className="border rounded-lg p-4 mb-5">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {users.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          No users found.
        </div>
      ) : (
        <div className="border rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-5 py-4">
                    {user.name}
                  </td>

                  <td className="px-5 py-4">
                    {user.email}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    <span className="capitalize">
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {user.role === "admin" ? (
                      <span className="text-sm text-gray-500">
                        Protected
                      </span>
                    ) : (
                      <select
                        value={user.status}
                        onChange={(event) =>
                          handleStatusChange(
                            user._id,
                            event.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        {STATUS_OPTIONS.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Users;