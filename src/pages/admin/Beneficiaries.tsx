// pages/admin/Beneficiaries.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiPlus,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";
import {
  getUsers,
  verifyBeneficiary,
  deleteUser,
  activateUser,
  deactivateUser,
  register,
} from "../../lib/API";
import toast from "react-hot-toast";

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  status: "active" | "pending" | "suspended";
  totalReceived: number;
  createdAt: string;
  beneficiaryProfile?: {
    organizationType: string;
    isVerified: boolean;
  };
}

const Beneficiaries: React.FC = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingBeneficiary, setCreatingBeneficiary] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    organizationName: "",
    organizationType: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch beneficiaries from backend
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      // Filter only beneficiaries
      const beneficiariesList = (res.users || []).filter(
        (user: any) => user.role === "beneficiary",
      );
      setBeneficiaries(beneficiariesList);
    } catch (error) {
      console.error("Failed to fetch beneficiaries:", error);
      toast.error("Could not load beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await verifyBeneficiary(id);
      toast.success("Beneficiary verified successfully");
      fetchBeneficiaries();
    } catch (error) {
      toast.error("Failed to verify beneficiary");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUser(id);
      toast.success("Beneficiary activated");
      fetchBeneficiaries();
    } catch (error) {
      toast.error("Failed to activate beneficiary");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id);
      toast.success("Beneficiary suspended successfully");
      fetchBeneficiaries();
    } catch (error) {
      toast.error("Failed to suspend beneficiary");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this beneficiary?")) {
      try {
        await deleteUser(id);
        toast.success("Beneficiary deleted");
        fetchBeneficiaries();
      } catch (error) {
        toast.error("Failed to delete beneficiary");
      }
    }
  };

  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setCreatingBeneficiary(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: "beneficiary",
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
      });
      toast.success("Beneficiary created successfully");
      setShowCreateModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        organizationName: "",
        organizationType: "",
        password: "",
        confirmPassword: "",
      });
      fetchBeneficiaries();
    } catch (error) {
      toast.error("Failed to create beneficiary");
    } finally {
      setCreatingBeneficiary(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: beneficiaries.length,
    active: beneficiaries.filter((b) => b.status === "active").length,
    pending: beneficiaries.filter((b) => b.status === "pending").length,
    suspended: beneficiaries.filter((b) => b.status === "suspended").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <FiCheckCircle className="w-3 h-3" /> Actif
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <FiXCircle className="w-3 h-3" /> En attente
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <FiXCircle className="w-3 h-3" /> Suspendu
          </span>
        );
      default:
        return null;
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bénéficiaires</h1>
          <p className="text-gray-500 mt-1">
            Gérez les associations et organisations bénéficiaires
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBeneficiaries}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FiPlus className="w-4 h-4" />
            Ajouter un bénéficiaire
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total bénéficiaires</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">En attente</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
          <p className="text-sm text-gray-500">Suspendus</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
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
          <option value="active">Actifs</option>
          <option value="pending">En attente</option>
          <option value="suspended">Suspendus</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Bénéficiaire
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Wilaya
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBeneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FaHandHoldingHeart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{b.name}</p>
                        <p className="text-xs text-gray-500">{b.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{b.email}</td>
                  <td className="p-4 text-gray-600">{b.wilaya || "-"}</td>
                  <td className="p-4">{getStatusBadge(b.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBeneficiary(b);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {b.status === "pending" && (
                        <button
                          onClick={() => handleVerify(b.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {b.status === "active" && (
                        <button
                          onClick={() => handleDeactivate(b.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Suspend this beneficiary"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      )}
                      {b.status === "suspended" && (
                        <button
                          onClick={() => handleActivate(b.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Créer un nouveau bénéficiaire
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiXCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateBeneficiary} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de contact
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nom du responsable"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+213..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'organisation
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nom de l'association"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'organisation
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organizationType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="ONG">ONG</option>
                  <option value="Association">Association</option>
                  <option value="Fondation">Fondation</option>
                  <option value="École">École</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Adresse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={creatingBeneficiary}
                className="w-full bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {creatingBeneficiary ? "Création..." : "Créer le bénéficiaire"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedBeneficiary && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Détails du bénéficiaire
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiXCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaHandHoldingHeart className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedBeneficiary.name}
                  </h3>
                  <p className="text-gray-500">
                    {selectedBeneficiary.beneficiaryProfile?.organizationType ||
                      "Association"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-800">{selectedBeneficiary.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-gray-800">{selectedBeneficiary.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Wilaya</p>
                    <p className="text-gray-800">
                      {selectedBeneficiary.wilaya || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date d'inscription</p>
                    <p className="text-gray-800">
                      {new Date(
                        selectedBeneficiary.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
