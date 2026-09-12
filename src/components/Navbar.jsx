import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/jobs" className="text-xl font-bold">
          JobPortal
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {user?.role === "user" && (
            <>
              <Link to="/jobs">Jobs</Link>

              <Link to="/my-applications">My Applications</Link>
            </>
          )}

          {user.role === "recruiter" && (
            <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>
          )}

          {user.role === "admin" && <Link to="/admin/dashboard">Admin</Link>}

          <span className="text-sm text-gray-500">{user?.name}</span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
