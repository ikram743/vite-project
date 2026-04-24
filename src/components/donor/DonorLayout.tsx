import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DonorHeader from "./DonorHeader";
import DonorSidebar from "./DonorSidebar";

const DonorLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DonorHeader />
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} pt-4`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DonorLayout;