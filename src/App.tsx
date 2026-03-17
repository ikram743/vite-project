import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import FoodWasteImpact from "./pages/FoodWasteImpact";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />{" "}
            {/* defaults to signin */}
            <Route path="/register" element={<AuthPage />} />{" "}
            {/* defaults to signup */}
            <Route path="/auth" element={<AuthPage />} />{" "}
            {/* also supports query params */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/food-waste-impact" element={<FoodWasteImpact />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Router>
  );
}

export default App;
