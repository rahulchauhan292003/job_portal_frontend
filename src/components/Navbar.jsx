import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);

    toast.success("Logged out successfully");
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/jobs" onClick={closeMenu} className="text-xl font-bold">
            JobPortal
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user?.role === "user" && (
              <>
                <Link to="/jobs">Jobs</Link>

                <Link to="/my-applications">My Applications</Link>
              </>
            )}

            {user?.role === "recruiter" && (
              <Link to="/recruiter/dashboard">Recruiter Dashboard</Link>
            )}

            {user?.role === "admin" && <Link to="/admin/dashboard">Admin</Link>}

            <div
  className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium"
  title={user?.name}
>
  {user?.name?.charAt(0).toUpperCase()}
</div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b">
          <span className="text-lg font-semibold">Menu</span>

          <button
            onClick={closeMenu}
            className="text-2xl text-gray-500 hover:text-gray-900"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col px-5 py-6 gap-5">
          {user?.role === "user" && (
            <>
              <Link
                to="/jobs"
                onClick={closeMenu}
                className="text-gray-700 hover:text-gray-900"
              >
                Jobs
              </Link>

              <Link
                to="/my-applications"
                onClick={closeMenu}
                className="text-gray-700 hover:text-gray-900"
              >
                My Applications
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <Link
              to="/recruiter/dashboard"
              onClick={closeMenu}
              className="text-gray-700 hover:text-gray-900"
            >
              Recruiter Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              onClick={closeMenu}
              className="text-gray-700 hover:text-gray-900"
            >
              Admin
            </Link>
          )}

          <div className="border-t pt-5">
            <p className="text-sm text-gray-500 mb-4">{user?.name}</p>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg border text-left hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
