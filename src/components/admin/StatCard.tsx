import React from "react";
import { motion } from "framer-motion";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import Card from "../common/Card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: "up" | "down";
  unit?: string;
  color?: "emerald" | "blue" | "amber" | "purple";
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  change,
  changeType = "up",
  unit,
  color = "emerald",
}) => {
  const colorClasses = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {value}
              {unit && (
                <span className="text-sm font-normal text-gray-400 ml-1">
                  {unit}
                </span>
              )}
            </p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {changeType === "up" ? (
                  <FiArrowUp className="w-3 h-3 text-emerald-600" />
                ) : (
                  <FiArrowDown className="w-3 h-3 text-red-600" />
                )}
                <p
                  className={`text-xs font-medium ${changeType === "up" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {change}
                </p>
              </div>
            )}
          </div>
          <div
            className={`w-12 h-12 ${colorClasses[color].bg} rounded-xl flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${colorClasses[color].text}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
