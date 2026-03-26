// components/admin/AdminHeader.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

interface AdminHeaderProps {
  title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Nouveau donateur en attente d'approbation",
      time: "Il y a 5 min",
      read: false,
      type: "warning",
    },
    {
      id: 2,
      message: "5 annonces de surplus expirent aujourd'hui",
      time: "Il y a 15 min",
      read: false,
      type: "danger",
    },
    {
      id: 3,
      message: "Distribution de 120 kg effectuée avec succès",
      time: "Il y a 2 heures",
      read: true,
      type: "success",
    },
    {
      id: 4,
      message: "Nouvelle association inscrite",
      time: "Il y a 3 heures",
      read: true,
      type: "info",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  // Get page title based on current route
  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path === "/admin") return "Tableau de bord";
    if (path === "/admin/donors") return "Gestion des Donateurs";
    if (path === "/admin/beneficiaries") return "Gestion des Bénéficiaires";
    if (path === "/admin/surplus") return "Gestion des Surplus";
    if (path === "/admin/distributions") return "Suivi des Distributions";
    if (path === "/admin/notifications") return "Notifications";
    if (path === "/admin/users") return "Utilisateurs";
    if (path === "/admin/impact") return "Impact & Statistiques";
    if (path === "/admin/settings") return "Paramètres";
    return "Administration";
  };

  // Get page description based on current route
  const getPageDescription = () => {
    const path = location.pathname;
    if (path === "/admin") return "Aperçu général de la plateforme";
    if (path === "/admin/donors")
      return "Gérez les commerces et entreprises donateurs";
    if (path === "/admin/beneficiaries")
      return "Gérez les associations bénéficiaires";
    if (path === "/admin/surplus")
      return "Suivez et modérez les annonces de surplus";
    if (path === "/admin/distributions")
      return "Suivez les distributions de nourriture";
    if (path === "/admin/notifications")
      return "Envoyez des notifications aux utilisateurs";
    if (path === "/admin/users")
      return "Gérez tous les utilisateurs de la plateforme";
    if (path === "/admin/impact") return "Visualisez l'impact de la plateforme";
    if (path === "/admin/settings")
      return "Configurez les paramètres de la plateforme";
    return "";
  };

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth?mode=signin");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "fa-exclamation-triangle";
      case "danger":
        return "fa-times-circle";
      case "success":
        return "fa-check-circle";
      case "info":
        return "fa-info-circle";
      default:
        return "fa-bell";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "#f57c00";
      case "danger":
        return "#c62828";
      case "success":
        return "#2e7d32";
      case "info":
        return "#1976d2";
      default:
        return "#6b8f7c";
    }
  };

  return (
    <header className="admin-header">
      {/* Left Side - Title & Description */}
      <div className="header-info">
        <h1>{getPageTitle()}</h1>
        <p>{getPageDescription()}</p>
      </div>

      {/* Right Side - Actions & Profile */}
      <div className="header-actions">
        {/* Date/Time Display */}
        <div className="datetime-display">
          <i className="fas fa-calendar-alt"></i>
          <span>
            {new Date().toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Notifications */}
        <div className="notifications-container" ref={notificationRef}>
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    className="mark-all-read"
                    onClick={handleMarkAllAsRead}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${!notif.read ? "unread" : ""}`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div
                        className="notification-icon"
                        style={{
                          background: `${getNotificationColor(notif.type)}20`,
                        }}
                      >
                        <i
                          className={`fas ${getNotificationIcon(notif.type)}`}
                          style={{ color: getNotificationColor(notif.type) }}
                        ></i>
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                      {!notif.read && <div className="notification-dot"></div>}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <i className="fas fa-bell-slash"></i>
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
              <div className="dropdown-footer">
                <button onClick={() => navigate("/admin/notifications")}>
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="profile-container" ref={dropdownRef}>
          <button
            className="admin-profile"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="profile-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="profile-info">
              <span className="profile-name">
                {admin.name || "Administrateur"}
              </span>
              <span className="profile-role">Administrateur</span>
            </div>
            <i
              className={`fas fa-chevron-${showProfileDropdown ? "up" : "down"} dropdown-arrow`}
            ></i>
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div>
                  <p className="user-name">{admin.name || "Administrateur"}</p>
                  <p className="user-email">
                    {admin.email || "admin@foodshare.dz"}
                  </p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button
                onClick={() => navigate("/admin/settings")}
                className="dropdown-item"
              >
                <i className="fas fa-cog"></i>
                <span>Paramètres</span>
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="dropdown-item"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Tableau de bord</span>
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout">
                <i className="fas fa-sign-out-alt"></i>
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
