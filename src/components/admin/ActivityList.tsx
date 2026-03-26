// components/admin/ActivityList.tsx
import React from "react";
import "./ActivityList.css";

interface Activity {
  id: number;
  type: "donor" | "beneficiary" | "surplus" | "distribution";
  description: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "active";
}

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "donor":
        return "fa-store";
      case "beneficiary":
        return "fa-hand-holding-heart";
      case "surplus":
        return "fa-box";
      case "distribution":
        return "fa-truck";
      default:
        return "fa-circle";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "fa-check-circle";
      case "pending":
        return "fa-clock";
      case "active":
        return "fa-play-circle";
      default:
        return "fa-circle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#2e7d32";
      case "pending":
        return "#f57c00";
      case "active":
        return "#1976d2";
      default:
        return "#6b8f7c";
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>
          <i className="fas fa-history"></i>
          Activités Récentes
        </h3>
        <button className="btn-link">Voir tout</button>
      </div>
      <div className="card-content">
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div
                className="activity-icon"
                style={{ background: `${getStatusColor(activity.status)}20` }}
              >
                <i
                  className={`fas ${getTypeIcon(activity.type)}`}
                  style={{ color: getStatusColor(activity.status) }}
                ></i>
              </div>
              <div className="activity-details">
                <p className="activity-description">{activity.description}</p>
                <span className="activity-time">
                  {activity.date} à {activity.time}
                </span>
              </div>
              <div className={`activity-status ${activity.status}`}>
                <i className={`fas ${getStatusIcon(activity.status)}`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
