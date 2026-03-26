// pages/admin/Users.tsx
import React, { useState } from "react";
import "./Users.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "donor" | "beneficiary";
  status: "active" | "pending" | "suspended";
  phone: string;
  joinDate: string;
  lastLogin: string;
  totalActions?: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed@artisan.dz",
      role: "donor",
      status: "active",
      phone: "+213 555 123 456",
      joinDate: "2025-01-15",
      lastLogin: "2025-03-25",
      totalActions: 45,
    },
    {
      id: 2,
      name: "Fatima Zahra",
      email: "fatima@foodbank.dz",
      role: "beneficiary",
      status: "active",
      phone: "+213 555 789 012",
      joinDate: "2025-01-20",
      lastLogin: "2025-03-24",
      totalActions: 12,
    },
    {
      id: 3,
      name: "Karim Said",
      email: "karim@supermarket.dz",
      role: "donor",
      status: "pending",
      phone: "+213 555 345 678",
      joinDate: "2025-03-20",
      lastLogin: "-",
      totalActions: 0,
    },
    {
      id: 4,
      name: "Nadia Bensalem",
      email: "nadia@solidarite.dz",
      role: "beneficiary",
      status: "suspended",
      phone: "+213 555 901 234",
      joinDate: "2025-02-10",
      lastLogin: "2025-03-15",
      totalActions: 8,
    },
    {
      id: 5,
      name: "Mohamed Larbi",
      email: "admin@foodshare.dz",
      role: "admin",
      status: "active",
      phone: "+213 555 567 890",
      joinDate: "2025-01-10",
      lastLogin: "2025-03-26",
      totalActions: 156,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "admin" | "donor" | "beneficiary"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  // Role filter counts
  const roleCounts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    donor: users.filter((u) => u.role === "donor").length,
    beneficiary: users.filter((u) => u.role === "beneficiary").length,
  };

  // Status filter counts
  const statusCounts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleResetPassword = (user: User) => {
    setResetPasswordEmail(user.email);
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = () => {
    alert(`Un email de réinitialisation a été envoyé à ${resetPasswordEmail}`);
    setShowResetPasswordModal(false);
  };

  const handleSuspend = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: "suspended" as const } : user,
      ),
    );
  };

  const handleActivate = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: "active" as const } : user,
      ),
    );
  };

  const handleApprove = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: "active" as const } : user,
      ),
    );
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.",
      )
    ) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "role-admin";
      case "donor":
        return "role-donor";
      case "beneficiary":
        return "role-beneficiary";
      default:
        return "";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "donor":
        return "Donateur";
      case "beneficiary":
        return "Bénéficiaire";
      default:
        return role;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "suspended":
        return "status-suspended";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "pending":
        return "En attente";
      case "suspended":
        return "Suspendu";
      default:
        return status;
    }
  };

  return (
    <div className="users-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Utilisateurs</h2>
          <p>{filteredUsers.length} utilisateurs trouvés</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <i className="fas fa-download"></i>
            Exporter
          </button>
          <button className="btn-primary">
            <i className="fas fa-user-plus"></i>
            Ajouter Utilisateur
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrer par rôle</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterRole === "all" ? "active" : ""}`}
              onClick={() => setFilterRole("all")}
            >
              Tous <span className="count">{roleCounts.all}</span>
            </button>
            <button
              className={`filter-btn ${filterRole === "admin" ? "active" : ""}`}
              onClick={() => setFilterRole("admin")}
            >
              <i className="fas fa-crown"></i>
              Administrateurs <span className="count">{roleCounts.admin}</span>
            </button>
            <button
              className={`filter-btn ${filterRole === "donor" ? "active" : ""}`}
              onClick={() => setFilterRole("donor")}
            >
              <i className="fas fa-store"></i>
              Donateurs <span className="count">{roleCounts.donor}</span>
            </button>
            <button
              className={`filter-btn ${filterRole === "beneficiary" ? "active" : ""}`}
              onClick={() => setFilterRole("beneficiary")}
            >
              <i className="fas fa-hand-holding-heart"></i>
              Bénéficiaires{" "}
              <span className="count">{roleCounts.beneficiary}</span>
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="filter-group">
          <label>Filtrer par statut</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              Tous <span className="count">{statusCounts.all}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              <i className="fas fa-check-circle"></i>
              Actifs <span className="count">{statusCounts.active}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
              onClick={() => setFilterStatus("pending")}
            >
              <i className="fas fa-clock"></i>
              En attente <span className="count">{statusCounts.pending}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "suspended" ? "active" : ""}`}
              onClick={() => setFilterStatus("suspended")}
            >
              <i className="fas fa-ban"></i>
              Suspendus <span className="count">{statusCounts.suspended}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="user-name">
                  <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div>
                    <strong>{user.name}</strong>
                    <span className="user-join-date">
                      Inscrit le {user.joinDate}
                    </span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span
                    className={`role-badge ${getRoleBadgeClass(user.role)}`}
                  >
                    <i
                      className={`fas ${user.role === "admin" ? "fa-crown" : user.role === "donor" ? "fa-store" : "fa-hand-holding-heart"}`}
                    ></i>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusBadgeClass(user.status)}`}
                  >
                    <i
                      className={`fas ${user.status === "active" ? "fa-check-circle" : user.status === "pending" ? "fa-clock" : "fa-ban"}`}
                    ></i>
                    {getStatusText(user.status)}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewDetails(user)}
                    title="Voir détails"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleResetPassword(user)}
                    title="Réinitialiser mot de passe"
                  >
                    <i className="fas fa-key"></i>
                  </button>
                  {user.status === "pending" && user.role !== "admin" && (
                    <button
                      className="btn-icon approve"
                      onClick={() => handleApprove(user.id)}
                      title="Approuver"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  {user.status === "active" && user.role !== "admin" && (
                    <button
                      className="btn-icon suspend"
                      onClick={() => handleSuspend(user.id)}
                      title="Suspendre"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  )}
                  {user.status === "suspended" && (
                    <button
                      className="btn-icon activate"
                      onClick={() => handleActivate(user.id)}
                      title="Réactiver"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  )}
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(user.id)}
                    title="Supprimer"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'utilisateur</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-avatar">
                <i className="fas fa-user-circle"></i>
                <h4>{selectedUser.name}</h4>
                <span
                  className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}
                >
                  {getRoleText(selectedUser.role)}
                </span>
              </div>
              <div className="user-details-grid">
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="detail-item">
                  <label>Téléphone</label>
                  <p>{selectedUser.phone}</p>
                </div>
                <div className="detail-item">
                  <label>Statut</label>
                  <p>
                    <span
                      className={`status-badge ${getStatusBadgeClass(selectedUser.status)}`}
                    >
                      {getStatusText(selectedUser.status)}
                    </span>
                  </p>
                </div>
                <div className="detail-item">
                  <label>Date d'inscription</label>
                  <p>{selectedUser.joinDate}</p>
                </div>
                <div className="detail-item">
                  <label>Dernière connexion</label>
                  <p>{selectedUser.lastLogin}</p>
                </div>
                <div className="detail-item">
                  <label>Actions totales</label>
                  <p>{selectedUser.totalActions || 0}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowResetPasswordModal(false)}
        >
          <div
            className="modal-content small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Réinitialiser le mot de passe</h3>
              <button
                className="close-btn"
                onClick={() => setShowResetPasswordModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="reset-password-info">
                <i className="fas fa-envelope"></i>
                <p>Un email de réinitialisation sera envoyé à :</p>
                <strong>{resetPasswordEmail}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowResetPasswordModal(false)}
              >
                Annuler
              </button>
              <button className="btn-primary" onClick={confirmResetPassword}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
