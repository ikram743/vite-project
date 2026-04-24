// pages/admin/Surplus.tsx
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiClock,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { getDonations, deleteDonation } from "../../lib/API";
import toast from "react-hot-toast";

interface SurplusItem {
  id: string;
  donorName: string;
  foodType: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
  expirationDate: string;
  status: "available" | "completed" | "expired" | "cancelled";
  donor?: {
    user?: {
      name: string;
    };
    organizationName?: string;
  };
}

const Surplus: React.FC = () => {
  const [surplus, setSurplus] = useState<SurplusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchSurplus = async () => {
    try {
      setLoading(true);
      const res = await getDonations(1, 100);
      const donations = res.data || [];
      setSurplus(donations);
    } catch (error) {
      console.error("Failed to fetch surplus:", error);
      toast.error("Could not load surplus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurplus();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this surplus item?")) {
      try {
        await deleteDonation(id);
        toast.success("Surplus item deleted");
        fetchSurplus();
      } catch (error) {
        toast.error("Failed to delete surplus item");
      }
    }
  };

  const filteredSurplus = surplus.filter((item) => {
    const matchesSearch =
      item.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.donor?.user?.name || item.donor?.organizationName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: surplus.length,
    available: surplus.filter((s) => s.status === "available").length,
    completed: surplus.filter((s) => s.status === "completed").length,
    expired: surplus.filter((s) => s.status === "expired").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <FiCheckCircle className="w-3 h-3" /> Disponible
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <FiCheckCircle className="w-3 h-3" /> Distribué
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <FiXCircle className="w-3 h-3" /> Expiré
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <FiXCircle className="w-3 h-3" /> Annulé
          </span>
        );
      default:
        return null;
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 0) return { label: "Expiré", class: "text-red-600" };
    if (diffDays <= 1)
      return { label: "Urgent", class: "text-red-500 font-semibold" };
    if (diffDays <= 3) return { label: "Bientôt", class: "text-amber-600" };
    return { label: "Valide", class: "text-gray-500" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des Surplus
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les annonces de surplus alimentaire
          </p>
        </div>
        <button
          onClick={fetchSurplus}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">
            {stats.available}
          </p>
          <p className="text-sm text-gray-500">Disponibles</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          <p className="text-sm text-gray-500">Distribués</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-sm text-gray-500">Expirés</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par produit ou donateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponibles</option>
          <option value="completed">Distribués</option>
          <option value="expired">Expirés</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurplus.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.foodType}</p>
                  <p className="text-xs text-gray-500">
                    {item.donor?.user?.name ||
                      item.donor?.organizationName ||
                      "Donateur"}
                  </p>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantité:</span>
                <span className="font-medium text-gray-800">
                  {item.availableQuantity} / {item.totalQuantity} {item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expiration:</span>
                <span className={getExpiryStatus(item.expirationDate).class}>
                  {new Date(item.expirationDate).toLocaleDateString()} (
                  {getExpiryStatus(item.expirationDate).label})
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <FiEye className="w-4 h-4" /> Détails
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surplus;
