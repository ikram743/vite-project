/// pages/admin/Notifications.tsx
import React, { useState, useEffect } from "react";
import { FiBell, FiCheckCircle, FiClock, FiEye } from "react-icons/fi";
import { getNotifications, markNotificationAsRead } from "../../lib/API";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      console.log("Notifications response:", res);
      setNotifications(res.notifications || res || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Error loading notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_donation":
        return "🍽️";
      case "request_received":
        return "📦";
      case "request_approved":
        return "✅";
      case "request_rejected":
        return "❌";
      default:
        return "🔔";
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} h ago`;
    return `${diffDays} d ago`;
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 mt-1">View your received notifications</p>
        </div>
      </div>

      {/* Notifications History */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiBell className="w-5 h-5 text-emerald-600" />
            Your Notification History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            All notifications you have received
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">
                          {notif.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {notif.isRead ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                        <FiEye className="w-3 h-3" /> Read
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                      >
                        <FiCheckCircle className="w-3 h-3" /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
