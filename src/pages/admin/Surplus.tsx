// pages/admin/Surplus.tsx
import React, { useState } from "react";
import "./Surplus.css";

interface SurplusItem {
  id: number;
  donorName: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  pickupAddress: string;
  status: "active" | "claimed" | "expired";
  createdAt: string;
  claimedBy?: string;
  claimedAt?: string;
}

const Surplus: React.FC = () => {
  const [surplus, setSurplus] = useState<SurplusItem[]>([
    {
      id: 1,
      donorName: "Artisan Bakery",
      productName: "Baguettes",
      category: "Boulangerie",
      quantity: 50,
      unit: "unités",
      expiryDate: "2025-03-27",
      pickupAddress: "123 Rue Didouche, Alger",
      status: "active",
      createdAt: "2025-03-26",
    },
    {
      id: 2,
      donorName: "Supermarket El Djazair",
      productName: "Fruits et légumes",
      category: "Fruits & Légumes",
      quantity: 120,
      unit: "kg",
      expiryDate: "2025-03-28",
      pickupAddress: "45 Boulevard Krim Belkacem, Alger",
      status: "active",
      createdAt: "2025-03-26",
    },
    {
      id: 3,
      donorName: "Restaurant Le Jardin",
      productName: "Plats préparés",
      category: "Plats cuisinés",
      quantity: 45,
      unit: "repas",
      expiryDate: "2025-03-27",
      pickupAddress: "12 Rue Larbi Ben Mhidi, Oran",
      status: "claimed",
      createdAt: "2025-03-25",
      claimedBy: "Food Bank Algiers",
      claimedAt: "2025-03-26",
    },
    {
      id: 4,
      donorName: "Boulangerie Moderne",
      productName: "Pains complets",
      category: "Boulangerie",
      quantity: 30,
      unit: "unités",
      expiryDate: "2025-03-26",
      pickupAddress: "8 Rue des Frères, Annaba",
      status: "expired",
      createdAt: "2025-03-24",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "claimed" | "expired"
  >("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<SurplusItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const categories = [
    { value: "all", label: "Toutes catégories" },
    { value: "Boulangerie", label: "Boulangerie" },
    { value: "Fruits & Légumes", label: "Fruits & Légumes" },
    { value: "Plats cuisinés", label: "Plats cuisinés" },
    { value: "Produits secs", label: "Produits secs" },
    { value: "Boissons", label: "Boissons" },
    { value: "Autre", label: "Autre" },
  ];

  const statusCounts = {
    all: surplus.length,
    active: surplus.filter((s) => s.status === "active").length,
    claimed: surplus.filter((s) => s.status === "claimed").length,
    expired: surplus.filter((s) => s.status === "expired").length,
  };

  const filteredSurplus = surplus.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      setSurplus(surplus.filter((item) => item.id !== id));
    }
  };

  const handleMarkAsExpired = (id: number) => {
    setSurplus(
      surplus.map((item) =>
        item.id === id ? { ...item, status: "expired" as const } : item,
      ),
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "claimed":
        return "status-claimed";
      case "expired":
        return "status-expired";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Disponible";
      case "claimed":
        return "Réservé";
      case "expired":
        return "Expiré";
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Boulangerie":
        return "fa-bread-slice";
      case "Fruits & Légumes":
        return "fa-apple-alt";
      case "Plats cuisinés":
        return "fa-utensils";
      case "Produits secs":
        return "fa-box-open";
      case "Boissons":
        return "fa-wine-bottle";
      default:
        return "fa-box";
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <div className="surplus-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h2>Gestion des Surplus</h2>
          <p>{filteredSurplus.length} annonces trouvées</p>
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
            placeholder="Rechercher par produit ou donateur..."
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
              Disponibles <span className="count">{statusCounts.active}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "claimed" ? "active" : ""}`}
              onClick={() => setFilterStatus("claimed")}
            >
              <i className="fas fa-clock"></i>
              Réservés <span className="count">{statusCounts.claimed}</span>
            </button>
            <button
              className={`filter-btn ${filterStatus === "expired" ? "active" : ""}`}
              onClick={() => setFilterStatus("expired")}
            >
              <i className="fas fa-hourglass-end"></i>
              Expirés <span className="count">{statusCounts.expired}</span>
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Catégorie</label>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Surplus Cards */}
      <div className="surplus-grid">
        {filteredSurplus.map((item) => (
          <div key={item.id} className="surplus-card">
            <div className="card-header">
              <div className="product-category">
                <i className={`fas ${getCategoryIcon(item.category)}`}></i>
                <span>{item.category}</span>
              </div>
              <span
                className={`status-badge ${getStatusBadgeClass(item.status)}`}
              >
                {getStatusText(item.status)}
              </span>
            </div>
            <div className="card-body">
              <h3>{item.productName}</h3>
              <div className="product-details">
                <div className="detail">
                  <i className="fas fa-store"></i>
                  <span>{item.donorName}</span>
                </div>
                <div className="detail">
                  <i className="fas fa-weight-hanging"></i>
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="detail">
                  <i className="fas fa-calendar-alt"></i>
                  <span
                    className={
                      isExpiringSoon(item.expiryDate) ? "expiring-soon" : ""
                    }
                  >
                    Expire le {item.expiryDate}
                  </span>
                </div>
                <div className="detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{item.pickupAddress}</span>
                </div>
                {item.status === "claimed" && (
                  <div className="detail claimed-info">
                    <i className="fas fa-hand-holding-heart"></i>
                    <span>Réservé par {item.claimedBy}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn-icon"
                onClick={() => {
                  setSelectedItem(item);
                  setShowDetailsModal(true);
                }}
                title="Voir détails"
              >
                <i className="fas fa-eye"></i>
              </button>
              {item.status === "active" && (
                <button
                  className="btn-icon"
                  onClick={() => handleMarkAsExpired(item.id)}
                  title="Marquer comme expiré"
                >
                  <i className="fas fa-hourglass-end"></i>
                </button>
              )}
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(item.id)}
                title="Supprimer"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails du surplus</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <label>Produit:</label>
                <p>{selectedItem.productName}</p>
              </div>
              <div className="detail-item">
                <label>Catégorie:</label>
                <p>{selectedItem.category}</p>
              </div>
              <div className="detail-item">
                <label>Donateur:</label>
                <p>{selectedItem.donorName}</p>
              </div>
              <div className="detail-item">
                <label>Quantité:</label>
                <p>
                  {selectedItem.quantity} {selectedItem.unit}
                </p>
              </div>
              <div className="detail-item">
                <label>Date d'expiration:</label>
                <p>{selectedItem.expiryDate}</p>
              </div>
              <div className="detail-item">
                <label>Adresse de retrait:</label>
                <p>{selectedItem.pickupAddress}</p>
              </div>
              <div className="detail-item">
                <label>Date de création:</label>
                <p>{selectedItem.createdAt}</p>
              </div>
              {selectedItem.status === "claimed" && (
                <>
                  <div className="detail-item">
                    <label>Réservé par:</label>
                    <p>{selectedItem.claimedBy}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date de réservation:</label>
                    <p>{selectedItem.claimedAt}</p>
                  </div>
                </>
              )}
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

export default Surplus;
