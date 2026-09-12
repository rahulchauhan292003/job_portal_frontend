import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="text-gray-500 mt-2">
          Manage users, recruiters and platform activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/users"
          className="border rounded-xl p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Manage Users</h2>

          <p className="text-gray-500 mt-2">
            View users and change account status.
          </p>
        </Link>

        <Link
          to="/admin/recruiters"
          className="block rounded-xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="text-2xl font-semibold">Recruiter Management</h2>

          <p className="mt-3 text-gray-500">
            Manage recruiter accounts and access status.
          </p>
        </Link>

        <Link
          to="/admin/jobs"
          className="block border rounded-xl p-6 hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">Job Management</h2>

          <p className="text-gray-500 mt-2">
            View, search and manage all jobs on the platform.
          </p>
        </Link>
      </div>
    </main>
  );
};

export default AdminDashboard;
