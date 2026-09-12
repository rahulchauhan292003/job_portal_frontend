import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// User
import Jobs from "../pages/user/Jobs";
import JobDetails from "../pages/user/JobDetails";
import MyApplications from "../pages/user/MyApplications";
import ApplyToAll from "../pages/user/ApplyToAll";

// Recruiter
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import CreateJob from "../pages/recruiter/CreateJob";
import Applications from "../pages/recruiter/Applications";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Recruiters from "../pages/admin/Recruiters";
import RecruiterDetails from "../pages/admin/RecruiterDetails";
import RecruiterJobApplications from "../pages/admin/RecruiterJobApplications";

// Protected Route
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ==================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* ==================== USER ==================== */}

      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:jobId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-all"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <ApplyToAll />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* ==================== RECRUITER ==================== */}

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/create"
        element={
          <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      {/* Same JobDetails component for recruiter/admin */}
      <Route
        path="/recruiter/jobs/:jobId"
        element={
          <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/:jobId/applications"
        element={
          <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
            <Applications />
          </ProtectedRoute>
        }
      />

      {/* ==================== ADMIN ==================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/recruiters"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Recruiters />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/recruiters/:recruiterId"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RecruiterDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/recruiters/:recruiterId/jobs/:jobId/applications"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <RecruiterJobApplications />
          </ProtectedRoute>
        }
      />

      {/* ==================== DEFAULT ==================== */}

      <Route path="/" element={<Navigate to="/jobs" replace />} />

      {/* ==================== 404 ==================== */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
