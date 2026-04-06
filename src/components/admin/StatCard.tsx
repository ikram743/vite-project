// components/admin/StatCard.tsx
import React from "react";
import "./StatCard.css";

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  change,
  changeType = "neutral",
}) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <i className={`fas ${icon} stat-icon`}></i>
        <h3>{title}</h3>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${changeType}`}>
          <i
            className={`fas fa-arrow-${changeType === "positive" ? "up" : changeType === "negative" ? "down" : "right"}`}
          ></i>
          <span>{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
