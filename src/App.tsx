
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BenDashboard from './pages/beneficiary/BenDashboard';
import BenSurplus from './pages/beneficiary/BenSurplus';
import BenReservations from './pages/beneficiary/BenReservations';
import BenHistory from './pages/beneficiary/BenHistory';
import BenProfile from './pages/beneficiary/BenProfile';
import BenSettings from './pages/beneficiary/BenSettings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<BenDashboard />} />
          <Route path="/beneficiary/dashboard" element={<BenDashboard />} />
          <Route path="/beneficiary/surplus" element={<BenSurplus />} />
          <Route path="/beneficiary/reservations" element={<BenReservations />} />
          <Route path="/beneficiary/history" element={<BenHistory />} />
          <Route path="/beneficiary/profile" element={<BenProfile />} />
          <Route path="/beneficiary/settings" element={<BenSettings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;