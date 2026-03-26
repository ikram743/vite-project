// App.tsx - Ultra Simple Admin Test
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

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

// Mock user for testing
const mockUser = {
  id: 1,
  name: "Admin Test",
  email: "admin@foodshare.dz",
  role: "admin",
  token: "mock-token-123",
};
localStorage.setItem("user", JSON.stringify(mockUser));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donors" element={<Donors />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="surplus" element={<Surplus />} />
          <Route path="distributions" element={<Distributions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="users" element={<Users />} />
          <Route path="impact" element={<Impact />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect everything to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
