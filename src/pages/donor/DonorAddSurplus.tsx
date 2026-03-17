import React from 'react';
import { useNavigate } from 'react-router-dom';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import AddSurplusForm from '../../components/donor/AddSurplusForm';
import './DonorDashboard.css';

const DonorAddSurplus: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="donor-dashboard">
      <DonorHeader />
      <div className="dashboard-main container">
        <DonorSidebar />
        
        <div className="dashboard-content">
          {/* أزرار التنقل */}
          <div className="navigation-buttons">
            <button className="nav-btn back-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
            <button className="nav-btn home-btn" onClick={() => navigate('/')}>
              <i className="fas fa-home"></i> Home
            </button>
          </div>

          <AddSurplusForm />
        </div>
      </div>
    </div>
  );
};

export default DonorAddSurplus;