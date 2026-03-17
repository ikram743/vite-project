import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import FoodWasteImpact from "./pages/FoodWasteImpact";
import AuthPage from "./pages/AuthPage";

//import DonorLayout from "./components/donor/DonorLayout";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorSurplus from "./pages/donor/DonorSurplus";
import DonorAddSurplus from "./pages/donor/DonorAddSurplus";
import DonorReservations from "./pages/donor/DonorReservations";
import DonorHistory from "./pages/donor/DonorHistory";
import DonorStatistics from "./pages/donor/DonorStatistics";
import DonorProfile from "./pages/donor/DonorProfile";
import DonorSettings from "./pages/donor/DonorSettings";

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Surplus from "./pages/admin/Surplus";
import Notifications from "./pages/admin/Notification";
import Impact from "./pages/admin/Impact";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/surplus" element={<Surplus />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/impact" element={<Impact />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
          {/* Public home page */}
          <Route path="/home" element={<Home />} />

          {/* Unified authentication page – mode & type controlled via query params */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Other existing routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/food-waste-impact" element={<FoodWasteImpact />} />

          {/* Optional: redirect old /login and /register to new auth page with correct mode */}
          <Route
            path="/login"
            element={<Navigate to="/auth?mode=signin" replace />}
          />
          <Route
            path="/register"
            element={<Navigate to="/auth?mode=signup" replace />}
          />

          <Route
            path="/doner"
            element={<Navigate to="/auth?mode=signup&type=donor" replace />}
          />
          <Route
            path="/beneficiary"
            element={
              <Navigate to="/auth?mode=signup&type=beneficiary" replace />
            }
          />

          {/* Optional: catch-all 404 or redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
