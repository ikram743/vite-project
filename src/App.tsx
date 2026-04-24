import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import "./App.css";

// Public Pages
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Donors from "./pages/admin/Donor";
import Beneficiaries from "./pages/admin/Beneficiaries";
import Surplus from "./pages/admin/Surplus";
import Distributions from "./pages/admin/Distributions";
import Notifications from "./pages/admin/Notification";
import Users from "./pages/admin/Users";
import Impact from "./pages/admin/Impact";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";

// Donor Pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorLayout from "./components/donor/DonorLayout";
import DonorSurplus from "./pages/donor/DonorSurplus";
import DonorAddSurplus from "./pages/donor/DonorAddSurplus";
import DonorReservations from "./pages/donor/DonorReservations";
import DonorHistory from "./pages/donor/DonorHistory";
import DonorProfile from "./pages/donor/DonorProfile";

// Beneficiary Pages
import BenDashboard from "./pages/beneficiary/BenDashboard";
import BenSurplus from "./pages/beneficiary/BenSurplus";
import BenReservations from "./pages/beneficiary/BenReservations";
import BeneficiaryHistory from "./pages/beneficiary/BenHistory";
import BeneficiaryProfile from "./pages/beneficiary/BenProfile";

// Composant de route protégée
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/login"
        element={<Navigate to="/auth?mode=signin" replace />}
      />
      <Route
        path="/register"
        element={<Navigate to="/auth?mode=signup" replace />}
      />

      {/* ============================================
          ROUTES ADMIN AVEC LAYOUT
      ============================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Gestion */}
        <Route path="donors" element={<Donors />} />
        <Route path="beneficiaries" element={<Beneficiaries />} />
        <Route path="surplus" element={<Surplus />} />
        <Route path="distributions" element={<Distributions />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="users" element={<Users />} />

        {/* Analytics & Settings */}
        <Route path="impact" element={<Impact />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ============================================
          ROUTES DONOR AVEC LAYOUT
      ============================================ */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={["donor"]}>
            <DonorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DonorDashboard />} />
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="surplus" element={<DonorSurplus />} />
        <Route path="surplus/add" element={<DonorAddSurplus />} />
        <Route path="reservations" element={<DonorReservations />} />
        <Route path="history" element={<DonorHistory />} />
        <Route path="profile" element={<DonorProfile />} />
      </Route>

      {/* ============================================
          ROUTES BENEFICIARY AVEC LAYOUT
      ============================================ */}
      <Route
        path="/beneficiary"
        element={
          <ProtectedRoute allowedRoles={["beneficiary"]}>
            <BenDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<BenDashboard />} />
        <Route path="dashboard" element={<BenDashboard />} />
        <Route path="available" element={<BenSurplus />} />
        <Route path="claims" element={<BenReservations />} />
        <Route path="history" element={<BeneficiaryHistory />} />
        <Route path="profile" element={<BeneficiaryProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
