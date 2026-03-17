import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import FoodWasteImpact from "./pages/FoodWasteImpact";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public home page */}
          <Route path="/" element={<Home />} />

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
