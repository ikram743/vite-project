import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Public Pages
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import FoodWasteImpact from "./pages/FoodWasteImpact";
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

// Beneficiary Pages
import BeneficiaryDashboard from "./pages/beneficiary/BenDashboard";
import BenProfile from "./pages/beneficiary/BenProfile";
import BenHistory from "./pages/beneficiary/BenHistory";
import BenReservations from "./pages/beneficiary/BenReservations";
import BenSettings from "./pages/beneficiary/BenSettings";
import BenSurplus from "./pages/beneficiary/BenSurplus";

// Donor Pages
import DonorProfile from "./pages/donor/DonorProfile";
import DonorHistory from "./pages/donor/DonorHistory";
import DonorSettings from "./pages/donor/DonorSettings";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorAddSurplus from "./pages/donor/DonorAddSurplus";
import DonorReservations from "./pages/donor/DonorReservations";
import DonorStatistics from "./pages/donor/DonorStatistics";
import DonorSurplus from "./pages/donor/DonorSurplus";

// Mock user for testing (to see admin page)
// const mockUser = {
//   id: 1,
//   name: "Admin Test",
//   email: "admin@foodshare.dz",
//   role: "donor",
//   token: "mock-token-123",
// };
// localStorage.setItem("user", JSON.stringify(mockUser));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/HOME" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/food-waste-impact" element={<FoodWasteImpact />} />
          {/* Redirect old login/register to new auth page */}
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
          {/* ===== BENEFICIARY ROUTES ===== */}
          <Route
            path="/beneficiary/dashboard"
            element={<BeneficiaryDashboard />}
          />
          <Route path="/beneficiary/surplus" element={<BenSurplus />} />
          <Route
            path="/beneficiary/reservations"
            element={<BenReservations />}
          />
          <Route path="/beneficiary/history" element={<BenHistory />} />
          <Route path="/beneficiary/profile" element={<BenProfile />} />
          <Route path="/beneficiary/settings" element={<BenSettings />} />
          {/* ===== DONOR ROUTES ===== */}
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/surplus" element={<DonorSurplus />} />
          <Route path="/donor/add-surplus" element={<DonorAddSurplus />} />
          <Route path="/donor/reservations" element={<DonorReservations />} />
          <Route path="/donor/history" element={<DonorHistory />} />
          <Route path="/donor/statistics" element={<DonorStatistics />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          <Route path="/donor/settings" element={<DonorSettings />} />
          {/* ===== ADMIN ROUTES ===== */}

          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/donors" element={<Donors />} />
            <Route path="/admin/beneficiaries" element={<Beneficiaries />} />
            <Route path="/admin/surplus" element={<Surplus />} />
            <Route path="/admin/distributions" element={<Distributions />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/impact" element={<Impact />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
          {/* ===== CATCH ALL ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

//TO SEE THE ADMIN PAGE ..
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Admin Routes */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="donors" element={<Donors />} />
//           <Route path="beneficiaries" element={<Beneficiaries />} />
//           <Route path="surplus" element={<Surplus />} />
//           <Route path="distributions" element={<Distributions />} />
//           <Route path="notifications" element={<Notifications />} />
//           <Route path="users" element={<Users />} />
//           <Route path="impact" element={<Impact />} />
//           <Route path="settings" element={<Settings />} />
//         </Route>

//         {/* Redirect everything to admin */}
//         <Route path="/" element={<Navigate to="/admin" replace />} />
//         <Route path="*" element={<Navigate to="/admin" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

//  TO SEE THE DONOR PAGE ..

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<BeneficiaryDashboard />} />
//         <Route path="/beneficiary" element={<BeneficiaryDashboard />} />
//         <Route
//           path="/beneficiary/dashboard"
//           element={<BeneficiaryDashboard />}
//         />

//         {/* Auth routes */}
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/food-waste-impact" element={<FoodWasteImpact />} />
//         {/* Redirect anything else to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/donor" element={<DonorDashboard />}>
//           <Route index element={<DonorDashboard />} />
//           <Route path="dashboard" element={<DonorDashboard />} />
//           <Route path="surplus" element={<DonorSurplus />} />
//           <Route path="surplus/add" element={<DonorAddSurplus />} />
//           <Route path="reservations" element={<DonorReservations />} />
//           <Route path="history" element={<DonorHistory />} />
//           <Route path="statistics" element={<DonorStatistics />} />
//           <Route path="profile" element={<DonorProfile />} />
//           <Route path="settings" element={<DonorSettings />} />
//         </Route>

//         {/* Auth routes */}
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/food-waste-impact" element={<FoodWasteImpact />} />
//         {/* Redirect anything else to home */}
//         <Route path="/" element={<Navigate to="/donor" replace />} />
//         <Route path="*" element={<Navigate to="/donor" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
