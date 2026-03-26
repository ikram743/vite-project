// pages/admin/Dashboard.tsx
import React, { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import ActivityList from "../../components/admin/ActivityList";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const stats = {
    totalDonors: 48,
    totalBeneficiaries: 32,
    totalSurplus: 12500,
    totalMeals: 52300,
  };

  const recentActivities = [
    {
      id: 1,
      type: "donor" as const,
      description: "Nouveau donateur: Artisan Bakery",
      date: "22-03-2025",
      time: "14:30",
      status: "completed" as const,
    },
    {
      id: 2,
      type: "surplus" as const,
      description: "Surplus ajouté: 50 baguettes",
      date: "22-03-2025",
      time: "11:15",
      status: "active" as const,
    },
    {
      id: 3,
      type: "distribution" as const,
      description: "Distribution à Food Bank Algiers",
      date: "21-03-2025",
      time: "16:45",
      status: "completed" as const,
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      name: "Boulangerie El Djazair",
      type: "donor" as const,
      requestDate: "22-03-2025",
      status: "pending" as const,
    },
    {
      id: 2,
      name: "Association Aide et Partage",
      type: "beneficiary" as const,
      requestDate: "21-03-2025",
      status: "pending" as const,
    },
  ];


  return (
    <div className="dashboard-page">
      <div className="date-selector-wrapper">
        <div className="date-selector">
          <i className="fas fa-calendar-alt"></i>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-container">
        <StatCard
          icon="fa-store"
          title="Donateurs"
          value={stats.totalDonors}
          change="+4 cette semaine"
          changeType="positive"
        />
        <StatCard
          icon="fa-hand-holding-heart"
          title="Bénéficiaires"
          value={stats.totalBeneficiaries}
          change="+3 cette semaine"
          changeType="positive"
        />
        <StatCard
          icon="fa-weight-hanging"
          title="Surplus Total"
          value={`${stats.totalSurplus.toLocaleString()} kg`}
          change="+12% vs semaine dernière"
          changeType="positive"
        />
        <StatCard
          icon="fa-utensils"
          title="Repas Sauvés"
          value={stats.totalMeals.toLocaleString()}
          change="Impact positif"
          changeType="positive"
        />
      </div>

      <div className="dashboard-grid">
        <ActivityList activities={recentActivities} />
        {/* <ApprovalList
          approvals={pendingApprovals}
          onApprove={handleApprove}
          onReject={handleReject}
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;
