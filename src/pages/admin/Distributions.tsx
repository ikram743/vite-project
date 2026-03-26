// pages/admin/Distributions.tsx
import React, { useState } from "react";
import "./Distributions.css";

interface Distribution {
  id: number;
  donorName: string;
  beneficiaryName: string;
  productName: string;
  quantity: number;
  unit: string;
  date: string;
  pickupTime: string;
  status: "completed" | "scheduled" | "cancelled";
  address: string;
}

const Distributions: React.FC = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([
    {
      id: 1,
      donorName: "Artisan Bakery",
      beneficiaryName: "Food Bank Algiers",
      productName: "Baguettes",
      quantity: 50,
      unit: "unités",
      date: "2025-03-26",
      pickupTime: "14:30",
      status: "completed",
      address: "123 Rue Didouche, Alger",
    },
    {
      id: 2,
      donorName: "Supermarket El Djazair",
      beneficiaryName: "Solidarité Oran",
      productName: "Fruits et légumes",
      quantity: 120,
      unit: "kg",
      date: "2025-03-27",
      pickupTime: "10:00",
      status: "scheduled",
      address: "45 Boulevard Krim Belkacem, Alger",
    },
    {
      id: 3,
      donorName: "Restaurant Le Jardin",
      beneficiaryName: "Aide et Partage",
      productName: "Plats préparés",
      quantity: 45,
      unit: "repas",
      date: "2025-03-25",
      pickupTime: "12:00",
      status: "completed",
      address: "12 Rue Larbi Ben Mhidi, Oran",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "scheduled" | "cancelled"
  >("all");
  const [selectedDistribution, setSelectedDistribution] =
    useState<Distribution | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusCounts = {
    all: distributions.length,
    completed: distributions.filter((d) => d.status === "completed").length,
    scheduled: distributions.filter((d) => d.status === "scheduled").length,
    cancelled: distributions.filter((d) => d.status === "cancelled").length,
  };

  const filteredDistributions = distributions.filter((dist) => {
    const matchesSearch =
      dist.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || dist.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCancel = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette distribution ?")) {
      setDistributions(
        distributions.map((d) =>
          d.id === id ? { ...d, status: "cancelled" as const } : d,
        ),
      );
    }
  };

  const handleComplete = (id: number) => {
    setDistributions(
      distributions.map((d) =>
        d.id === id ? { ...d, status: "completed" as const } : d,
      ),
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "scheduled":
        return "status-scheduled";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Livré";
      case "scheduled":
        return "Planifié";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <div className="distributions-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Suivi des Distributions</h2>
          <p>{filteredDistributions.length} distributions trouvées</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <i className="fas fa-download"></i>
            Exporter
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par produit, donateur ou bénéficiaire..."
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
              className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
              onClick={() => setFilterStatus("completed")}
            >
              <i className="fas fa-check-circle"></i>
              Livrés <span className="count">{statusCounts.completed}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "scheduled" ? "active" : ""}`}
              onClick={() => setFilterStatus("scheduled")}
            >
              <i className="fas fa-clock"></i>
              Planifiés <span className="count">{statusCounts.scheduled}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "cancelled" ? "active" : ""}`}
              onClick={() => setFilterStatus("cancelled")}
            >
              <i className="fas fa-ban"></i>
              Annulés <span className="count">{statusCounts.cancelled}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Distributions Table */}
      <div className="distributions-table-container">
        <table className="distributions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Donateur</th>
              <th>Bénéficiaire</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDistributions.map((dist) => (
              <tr key={dist.id}>
                <td>{dist.date}</td>
                <td>{dist.pickupTime}</td>
                <td>{dist.donorName}</td>
                <td>{dist.beneficiaryName}</td>
                <td>{dist.productName}</td>
                <td>
                  {dist.quantity} {dist.unit}
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusBadgeClass(dist.status)}`}
                  >
                    <i
                      className={`fas ${dist.status === "completed" ? "fa-check-circle" : dist.status === "scheduled" ? "fa-clock" : "fa-ban"}`}
                    ></i>
                    {getStatusText(dist.status)}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setSelectedDistribution(dist);
                      setShowDetailsModal(true);
                    }}
                    title="Voir détails"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {dist.status === "scheduled" && (
                    <>
                      <button
                        className="btn-icon approve"
                        onClick={() => handleComplete(dist.id)}
                        title="Marquer comme livré"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleCancel(dist.id)}
                        title="Annuler"
                      >
                        <i className="fas fa-ban"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDistribution && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la distribution</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <label>Date:</label>
                <p>{selectedDistribution.date}</p>
              </div>
              <div className="detail-item">
                <label>Heure de retrait:</label>
                <p>{selectedDistribution.pickupTime}</p>
              </div>
              <div className="detail-item">
                <label>Donateur:</label>
                <p>{selectedDistribution.donorName}</p>
              </div>
              <div className="detail-item">
                <label>Bénéficiaire:</label>
                <p>{selectedDistribution.beneficiaryName}</p>
              </div>
              <div className="detail-item">
                <label>Produit:</label>
                <p>{selectedDistribution.productName}</p>
              </div>
              <div className="detail-item">
                <label>Quantité:</label>
                <p>
                  {selectedDistribution.quantity} {selectedDistribution.unit}
                </p>
              </div>
              <div className="detail-item">
                <label>Adresse de retrait:</label>
                <p>{selectedDistribution.address}</p>
              </div>
              <div className="detail-item">
                <label>Statut:</label>
                <p>{getStatusText(selectedDistribution.status)}</p>
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
    </div>
  );
};

export default Distributions;
