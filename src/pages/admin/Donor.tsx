// pages/admin/Donors.tsx
import React, { useState } from "react";
import "./Donor.css";

interface Donor {
  id: number;
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  status: "active" | "pending" | "suspended";
  taxId: string;
  joinDate: string;
  totalDonated: number;
  lastDonation: string;
  totalListings: number;
  description?: string;
}

const Donors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([
    {
      id: 1,
      businessName: "Artisan Bakery",
      businessType: "Boulangerie",
      contactName: "Ahmed Benali",
      email: "contact@artisan.dz",
      phone: "+213 555 123 456",
      address: "123 Rue Didouche, Alger",
      wilaya: "16",
      status: "active",
      taxId: "123456789",
      joinDate: "2025-01-15",
      totalDonated: 450,
      lastDonation: "2025-03-25",
      totalListings: 12,
      description: "Boulangerie artisanale depuis 1990",
    },
    {
      id: 2,
      businessName: "Supermarket El Djazair",
      businessType: "Supermarché",
      contactName: "Karim Said",
      email: "karim@supermarket.dz",
      phone: "+213 555 345 678",
      address: "45 Boulevard Krim Belkacem, Alger",
      wilaya: "16",
      status: "pending",
      taxId: "987654321",
      joinDate: "2025-03-20",
      totalDonated: 0,
      lastDonation: "-",
      totalListings: 0,
      description: "Supermarket avec rayon fruits et légumes",
    },
    {
      id: 3,
      businessName: "Restaurant Le Jardin",
      businessType: "Restaurant",
      contactName: "Nadia Bensalem",
      email: "nadia@lejardin.dz",
      phone: "+213 555 901 234",
      address: "12 Rue Larbi Ben Mhidi, Oran",
      wilaya: "31",
      status: "active",
      taxId: "456789123",
      joinDate: "2025-02-10",
      totalDonated: 280,
      lastDonation: "2025-03-24",
      totalListings: 8,
      description: "Restaurant traditionnel algérien",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");
  const [filterWilaya, setFilterWilaya] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDonationsModal, setShowDonationsModal] = useState(false);

  const wilayas = [
    { code: "16", name: "Alger" },
    { code: "31", name: "Oran" },
    { code: "23", name: "Annaba" },
    { code: "13", name: "Tlemcen" },
    { code: "15", name: "Tizi Ouzou" },
  ];

  const businessTypes = [
    { value: "all", label: "Tous les types" },
    { value: "Boulangerie", label: "Boulangerie" },
    { value: "Supermarché", label: "Supermarché" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Catering", label: "Traiteur" },
    { value: "Hotel", label: "Hôtel" },
    { value: "other", label: "Autre" },
  ];

  const statusCounts = {
    all: donors.length,
    active: donors.filter((d) => d.status === "active").length,
    pending: donors.filter((d) => d.status === "pending").length,
    suspended: donors.filter((d) => d.status === "suspended").length,
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || donor.status === filterStatus;
    const matchesWilaya =
      filterWilaya === "all" || donor.wilaya === filterWilaya;
    const matchesType =
      filterType === "all" || donor.businessType === filterType;
    return matchesSearch && matchesStatus && matchesWilaya && matchesType;
  });

  const handleApprove = (id: number) => {
    setDonors(
      donors.map((donor) =>
        donor.id === id ? { ...donor, status: "active" as const } : donor,
      ),
    );
  };

  const handleSuspend = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir suspendre ce donateur ?")) {
      setDonors(
        donors.map((donor) =>
          donor.id === id ? { ...donor, status: "suspended" as const } : donor,
        ),
      );
    }
  };

  const handleActivate = (id: number) => {
    setDonors(
      donors.map((donor) =>
        donor.id === id ? { ...donor, status: "active" as const } : donor,
      ),
    );
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer ce donateur ? Cette action est irréversible.",
      )
    ) {
      setDonors(donors.filter((donor) => donor.id !== id));
    }
  };

  const handleViewDetails = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDetailsModal(true);
  };

  const handleViewDonations = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDonationsModal(true);
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

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "Boulangerie":
        return "fa-bread-slice";
      case "Supermarché":
        return "fa-shopping-cart";
      case "Restaurant":
        return "fa-utensils";
      case "Catering":
        return "fa-concierge-bell";
      case "Hotel":
        return "fa-hotel";
      default:
        return "fa-store";
    }
  };

  return (
    <div className="donors-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Donateurs</h2>
          <p>{filteredDonors.length} donateurs trouvés</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <i className="fas fa-download"></i>
            Exporter
          </button>
          <button className="btn-primary">
            <i className="fas fa-plus"></i>
            Ajouter Donateur
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom d'entreprise, contact ou email..."
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
            <label>Type d'entreprise</label>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {businessTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="donors-table-container">
        <table className="donors-table">
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Wilaya</th>
              <th>Total Donné</th>
              <th>Dernier don</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor) => (
              <tr key={donor.id}>
                <td className="business-cell">
                  <div className="business-info">
                    <div className="business-icon">
                      <i
                        className={`fas ${getBusinessTypeIcon(donor.businessType)}`}
                      ></i>
                    </div>
                    <div>
                      <strong>{donor.businessName}</strong>
                      <span className="business-meta">
                        {donor.totalListings} annonces
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <strong>{donor.contactName}</strong>
                    <span className="contact-email">{donor.email}</span>
                  </div>
                </td>
                <td>
                  <span className="business-type-badge">
                    {donor.businessType}
                  </span>
                </td>
                <td>
                  {wilayas.find((w) => w.code === donor.wilaya)?.name ||
                    donor.wilaya}
                </td>
                <td className="donated-amount">
                  <strong>{donor.totalDonated} kg</strong>
                </td>
                <td>{donor.lastDonation}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusBadgeClass(donor.status)}`}
                  >
                    <i
                      className={`fas ${donor.status === "active" ? "fa-check-circle" : donor.status === "pending" ? "fa-clock" : "fa-ban"}`}
                    ></i>
                    {getStatusText(donor.status)}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleViewDetails(donor)}
                    title="Voir détails"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleViewDonations(donor)}
                    title="Voir les dons"
                  >
                    <i className="fas fa-chart-line"></i>
                  </button>
                  {donor.status === "pending" && (
                    <button
                      className="btn-icon approve"
                      onClick={() => handleApprove(donor.id)}
                      title="Approuver"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  {donor.status === "active" && (
                    <button
                      className="btn-icon suspend"
                      onClick={() => handleSuspend(donor.id)}
                      title="Suspendre"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  )}
                  {donor.status === "suspended" && (
                    <button
                      className="btn-icon activate"
                      onClick={() => handleActivate(donor.id)}
                      title="Réactiver"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  )}
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(donor.id)}
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

      {/* Donor Details Modal */}
      {showDetailsModal && selectedDonor && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Détails du Donateur</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="donor-detail-header">
                <div className="donor-icon-large">
                  <i
                    className={`fas ${getBusinessTypeIcon(selectedDonor.businessType)}`}
                  ></i>
                </div>
                <div>
                  <h4>{selectedDonor.businessName}</h4>
                  <span
                    className={`status-badge ${getStatusBadgeClass(selectedDonor.status)}`}
                  >
                    {getStatusText(selectedDonor.status)}
                  </span>
                </div>
              </div>
              <div className="details-grid">
                <div className="detail-section">
                  <h5>Informations de l'entreprise</h5>
                  <div className="detail-row">
                    <span className="detail-label">Type d'entreprise:</span>
                    <span>{selectedDonor.businessType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">
                      N° Identification fiscale:
                    </span>
                    <span>{selectedDonor.taxId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span>{selectedDonor.description || "Non renseigné"}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Informations de contact</h5>
                  <div className="detail-row">
                    <span className="detail-label">Personne de contact:</span>
                    <span>{selectedDonor.contactName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span>{selectedDonor.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Téléphone:</span>
                    <span>{selectedDonor.phone}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Adresse</h5>
                  <div className="detail-row">
                    <span className="detail-label">Adresse:</span>
                    <span>{selectedDonor.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Wilaya:</span>
                    <span>
                      {
                        wilayas.find((w) => w.code === selectedDonor.wilaya)
                          ?.name
                      }
                    </span>
                  </div>
                </div>
                <div className="detail-section">
                  <h5>Statistiques</h5>
                  <div className="detail-row">
                    <span className="detail-label">Date d'inscription:</span>
                    <span>{selectedDonor.joinDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total donné:</span>
                    <span className="highlight">
                      {selectedDonor.totalDonated} kg
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Dernier don:</span>
                    <span>{selectedDonor.lastDonation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Annonces publiées:</span>
                    <span>{selectedDonor.totalListings}</span>
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

      {/* Donations History Modal */}
      {showDonationsModal && selectedDonor && (
        <div
          className="modal-overlay"
          onClick={() => setShowDonationsModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Historique des dons - {selectedDonor.businessName}</h3>
              <button
                className="close-btn"
                onClick={() => setShowDonationsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="donations-stats">
                <div className="stat-summary">
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDonor.totalDonated} kg
                    </span>
                    <span className="stat-label">Total donné</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDonor.totalListings}
                    </span>
                    <span className="stat-label">Annonces</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {selectedDonor.lastDonation}
                    </span>
                    <span className="stat-label">Dernier don</span>
                  </div>
                </div>
                <div className="donations-table-container">
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Bénéficiaire</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>25-03-2025</td>
                        <td>Baguettes</td>
                        <td>50 unités</td>
                        <td>Food Bank Algiers</td>
                        <td>
                          <span className="status-badge status-active">
                            Distribué
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>20-03-2025</td>
                        <td>Pains complets</td>
                        <td>30 unités</td>
                        <td>Association Solidarité</td>
                        <td>
                          <span className="status-badge status-active">
                            Distribué
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
                onClick={() => setShowDonationsModal(false)}
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

export default Donors;
