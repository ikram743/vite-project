// pages/admin/Beneficiaries.tsx
import React, { useState } from "react";
import "./Benificiaries.css";

interface Beneficiary {
  id: number;
  associationName: string;
  associationType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  status: "active" | "pending" | "suspended";
  registrationNumber: string;
  mission: string;
  joinDate: string;
  totalReceived: number;
  lastClaim: string;
  totalClaims: number;
}

const Beneficiaries: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: 1,
      associationName: "Food Bank Algiers",
      associationType: "foodBank",
      contactName: "Fatima Zahra",
      email: "contact@foodbank.dz",
      phone: "+213 555 789 012",
      address: "45 Rue Didouche, Alger",
      wilaya: "16",
      status: "active",
      registrationNumber: "ABC123456",
      mission: "Lutter contre la faim et le gaspillage alimentaire",
      joinDate: "2025-01-20",
      totalReceived: 1250,
      lastClaim: "2025-03-25",
      totalClaims: 18,
    },
    {
      id: 2,
      associationName: "Solidarité Oran",
      associationType: "charity",
      contactName: "Mohamed Lamine",
      email: "info@solidarite.dz",
      phone: "+213 555 456 789",
      address: "12 Boulevard Emir Abdelkader, Oran",
      wilaya: "31",
      status: "active",
      registrationNumber: "DEF789012",
      mission: "Aide aux familles dans le besoin",
      joinDate: "2025-02-05",
      totalReceived: 780,
      lastClaim: "2025-03-24",
      totalClaims: 12,
    },
    {
      id: 3,
      associationName: "Aide et Partage",
      associationType: "community",
      contactName: "Nadia Benali",
      email: "nadia@aidepartage.dz",
      phone: "+213 555 234 567",
      address: "8 Rue des Frères Bouadou, Annaba",
      wilaya: "23",
      status: "pending",
      registrationNumber: "GHI345678",
      mission: "Distribution alimentaire aux personnes démunies",
      joinDate: "2025-03-18",
      totalReceived: 0,
      lastClaim: "-",
      totalClaims: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");
  const [filterWilaya, setFilterWilaya] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClaimsModal, setShowClaimsModal] = useState(false);

  const wilayas = [
    { code: "16", name: "Alger" },
    { code: "31", name: "Oran" },
    { code: "23", name: "Annaba" },
    { code: "13", name: "Tlemcen" },
    { code: "15", name: "Tizi Ouzou" },
  ];

  const associationTypes = [
    { value: "all", label: "Tous les types" },
    { value: "foodBank", label: "Banque Alimentaire" },
    { value: "charity", label: "Association Caritative" },
    { value: "shelter", label: "Refuge" },
    { value: "community", label: "Centre Communautaire" },
    { value: "religious", label: "Organisation Religieuse" },
    { value: "other", label: "Autre" },
  ];

  const statusCounts = {
    all: beneficiaries.length,
    active: beneficiaries.filter((b) => b.status === "active").length,
    pending: beneficiaries.filter((b) => b.status === "pending").length,
    suspended: beneficiaries.filter((b) => b.status === "suspended").length,
  };

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const matchesSearch =
      b.associationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesWilaya = filterWilaya === "all" || b.wilaya === filterWilaya;
    const matchesType =
      filterType === "all" || b.associationType === filterType;
    return matchesSearch && matchesStatus && matchesWilaya && matchesType;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "foodBank":
        return "Banque Alimentaire";
      case "charity":
        return "Association Caritative";
      case "shelter":
        return "Refuge";
      case "community":
        return "Centre Communautaire";
      case "religious":
        return "Organisation Religieuse";
      default:
        return "Autre";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "foodBank":
        return "fa-utensils";
      case "charity":
        return "fa-hand-holding-heart";
      case "shelter":
        return "fa-home";
      case "community":
        return "fa-users";
      case "religious":
        return "fa-church";
      default:
        return "fa-building";
    }
  };

  const handleApprove = (id: number) => {
    setBeneficiaries(
      beneficiaries.map((b) =>
        b.id === id ? { ...b, status: "active" as const } : b,
      ),
    );
  };

  const handleSuspend = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir suspendre cette association ?")) {
      setBeneficiaries(
        beneficiaries.map((b) =>
          b.id === id ? { ...b, status: "suspended" as const } : b,
        ),
      );
    }
  };

  const handleActivate = (id: number) => {
    setBeneficiaries(
      beneficiaries.map((b) =>
        b.id === id ? { ...b, status: "active" as const } : b,
      ),
    );
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette association ? Cette action est irréversible.",
      )
    ) {
      setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
    }
  };

  const handleViewDetails = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDetailsModal(true);
  };

  const handleViewClaims = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowClaimsModal(true);
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
    <div className="beneficiaries-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Bénéficiaires</h2>
          <p>{filteredBeneficiaries.length} associations trouvées</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <i className="fas fa-download"></i>
            Exporter
          </button>
          <button className="btn-primary">
            <i className="fas fa-plus"></i>
            Ajouter Association
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom d'association, contact ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Statut</label>
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

        <div className="filter-row">
          <div className="filter-group">
            <label>Wilaya</label>
            <select
              className="filter-select"
              value={filterWilaya}
              onChange={(e) => setFilterWilaya(e.target.value)}
            >
              <option value="all">Toutes les wilayas</option>
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Type d'association</label>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {associationTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="beneficiaries-table-container">
        <table className="beneficiaries-table">
          <thead>
            <tr>
              <th>Association</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Wilaya</th>
              <th>Total Reçu</th>
              <th>Dernière demande</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map((b) => (
              <tr key={b.id}>
                <td className="association-cell">
                  <div className="association-info">
                    <div className="association-icon">
                      <i
                        className={`fas ${getTypeIcon(b.associationType)}`}
                      ></i>
                    </div>
                    <div>
                      <strong>{b.associationName}</strong>
                      <span className="association-meta">
                        {b.totalClaims} demandes
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <strong>{b.contactName}</strong>
                    <span className="contact-email">{b.email}</span>
                  </div>
                </td>
                <td>
                  <span className="type-badge">
                    {getTypeLabel(b.associationType)}
                  </span>
                </td>
                <td>
                  {wilayas.find((w) => w.code === b.wilaya)?.name || b.wilaya}
                </td>
                <td className="received-amount">
                  <strong>{b.totalReceived} kg</strong>
                </td>
                <td>{b.lastClaim}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusBadgeClass(b.status)}`}
                  >
                    <i
                      className={`fas ${b.status === "active" ? "fa-check-circle" : b.status === "pending" ? "fa-clock" : "fa-ban"}`}
                    ></i>
                    {getStatusText(b.status)}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewDetails(b)}
                    title="Voir détails"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleViewClaims(b)}
                    title="Voir les demandes"
                  >
                    <i className="fas fa-clipboard-list"></i>
                  </button>
                  {b.status === "pending" && (
                    <button
                      className="btn-icon approve"
                      onClick={() => handleApprove(b.id)}
                      title="Approuver"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  {b.status === "active" && (
                    <button
                      className="btn-icon suspend"
                      onClick={() => handleSuspend(b.id)}
                      title="Suspendre"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  )}
                  {b.status === "suspended" && (
                    <button
                      className="btn-icon activate"
                      onClick={() => handleActivate(b.id)}
                      title="Réactiver"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  )}
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(b.id)}
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

      {/* Beneficiary Details Modal */}
      {showDetailsModal && selectedBeneficiary && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Détails de l'Association</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="beneficiary-detail-header">
                <div className="beneficiary-icon-large">
                  <i
                    className={`fas ${getTypeIcon(selectedBeneficiary.associationType)}`}
                  ></i>
                </div>
                <div>
                  <h4>{selectedBeneficiary.associationName}</h4>
                  <span
                    className={`status-badge ${getStatusBadgeClass(selectedBeneficiary.status)}`}
                  >
                    {getStatusText(selectedBeneficiary.status)}
                  </span>
                </div>
              </div>
              <div className="details-grid">
                <div className="detail-section">
                  <h5>Informations de l'association</h5>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span>
                      {getTypeLabel(selectedBeneficiary.associationType)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">N° d'enregistrement:</span>
                    <span>{selectedBeneficiary.registrationNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mission:</span>
                    <span>{selectedBeneficiary.mission}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Informations de contact</h5>
                  <div className="detail-row">
                    <span className="detail-label">Personne de contact:</span>
                    <span>{selectedBeneficiary.contactName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span>{selectedBeneficiary.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Téléphone:</span>
                    <span>{selectedBeneficiary.phone}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Adresse</h5>
                  <div className="detail-row">
                    <span className="detail-label">Adresse:</span>
                    <span>{selectedBeneficiary.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Wilaya:</span>
                    <span>
                      {
                        wilayas.find(
                          (w) => w.code === selectedBeneficiary.wilaya,
                        )?.name
                      }
                    </span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Statistiques</h5>
                  <div className="detail-row">
                    <span className="detail-label">Date d'inscription:</span>
                    <span>{selectedBeneficiary.joinDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total reçu:</span>
                    <span className="highlight">
                      {selectedBeneficiary.totalReceived} kg
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Dernière demande:</span>
                    <span>{selectedBeneficiary.lastClaim}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Demandes totales:</span>
                    <span>{selectedBeneficiary.totalClaims}</span>
                  </div>
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

      {/* Claims History Modal */}
      {showClaimsModal && selectedBeneficiary && (
        <div
          className="modal-overlay"
          onClick={() => setShowClaimsModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                Historique des demandes - {selectedBeneficiary.associationName}
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowClaimsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="claims-stats">
                <div className="stat-summary">
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedBeneficiary.totalReceived} kg
                    </span>
                    <span className="stat-label">Total reçu</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedBeneficiary.totalClaims}
                    </span>
                    <span className="stat-label">Demandes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedBeneficiary.lastClaim}
                    </span>
                    <span className="stat-label">Dernière demande</span>
                  </div>
                </div>
                <div className="claims-table-container">
                  <table className="claims-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Donateur</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>25-03-2025</td>
                        <td>Artisan Bakery</td>
                        <td>Baguettes</td>
                        <td>50 unités</td>
                        <td>
                          <span className="status-badge status-active">
                            Récupéré
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>20-03-2025</td>
                        <td>Supermarket El Djazair</td>
                        <td>Fruits et légumes</td>
                        <td>30 kg</td>
                        <td>
                          <span className="status-badge status-active">
                            Récupéré
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowClaimsModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
