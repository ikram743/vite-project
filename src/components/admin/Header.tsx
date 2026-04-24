// components/admin/AdminHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../lib/API";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/donors") return "Donateurs";
    if (path === "/admin/beneficiaries") return "Bénéficiaires";
    if (path === "/admin/surplus") return "Surplus";
    if (path === "/admin/distributions") return "Distributions";
    if (path === "/admin/notifications") return "Notifications";
    if (path === "/admin/impact") return "Impact";
    if (path === "/admin/settings") return "Paramètres";
    if (path === "/admin/profile") return "Mon profil";
    return "Administration";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth?mode=signin");
  };

  const goToProfile = () => {
    navigate("/admin/profile");
    setShowDropdown(false);
  };

  const goToSettings = () => {
    navigate("/admin/settings");
    setShowDropdown(false);
  };

  const goToNotificationsPage = () => {
    navigate("/admin/notifications");
    setShowNotifications(false);
  };

  // Marquer une notification comme lue
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      setUnreadCount(0);
      toast.success("Toutes les notifications sont lues");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Erreur lors du marquage");
    }
  };

  // Naviguer vers la notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id).catch(console.error);
    }
    if (notification.link) {
      navigate(notification.link);
    } else {
      navigate("/admin/notifications");
    }
    setShowNotifications(false);
  };

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

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours} h`;
    return `il y a ${diffDays} j`;
  };

  // Filtrer uniquement les notifications non lues
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-4">
          {/* Notifications Button with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown - UNIQUEMENT LES NON LUES */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 text-xs text-emerald-600">
                          ({unreadCount} non lue{unreadCount > 1 ? "s" : ""})
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <FiCheckCircle className="w-3 h-3" />
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune notification non lue</p>
                      <p className="text-xs mt-1">
                        Les notifications lues sont dans l'historique
                      </p>
                    </div>
                  ) : (
                    unreadNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer bg-emerald-50/30"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {getTimeAgo(notif.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="w-2 h-2 bg-emerald-500 rounded-full hover:scale-125 transition"
                            title="Marquer comme lu"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <button
                      onClick={goToNotificationsPage}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Voir toutes les notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-medium uppercase">
                  {admin.name ? admin.name.charAt(0) : "A"}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">
                  {admin.name || "Administrateur"}
                </p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium uppercase">
                        {admin.name ? admin.name.charAt(0) : "A"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {admin.name || "Administrateur"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {admin.email || "admin@foodshare.dz"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition text-left cursor-pointer"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Mon profil</span>
                  </button>

                  <button
                    onClick={goToSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition text-left cursor-pointer"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </button>

                  <div className="h-px bg-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
