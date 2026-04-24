// pages/admin/Donors.tsx
import React, { useState, useEffect } from "react";
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
  FiPackage,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";
import { FaStore, FaBuilding } from "react-icons/fa";
import {
  getUsers,
  verifyDonor,
  deleteUser,
  activateUser,
  deactivateUser,
} from "../../lib/API";
import toast from "react-hot-toast";

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  status: "active" | "pending" | "suspended";
  totalDonated: number;
  createdAt: string;
  donorProfile?: {
    organizationName: string;
    businessType: string;
    isVerified: boolean;
  };
}

const Donors: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      const donorsList = (res.users || []).filter(
        (user: any) => user.role === "donor",
      );
      setDonors(donorsList);
    } catch (error) {
      console.error("Failed to fetch donors:", error);
      toast.error("Could not load donors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await verifyDonor(id);
      toast.success("Donor verified successfully");
      fetchDonors();
    } catch (error) {
      toast.error("Failed to verify donor");
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUser(id);
      toast.success("Donor activated");
      fetchDonors();
    } catch (error) {
      toast.error("Failed to activate donor");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id);
      toast.success("Donor deactivated");
      fetchDonors();
    } catch (error) {
      toast.error("Failed to deactivate donor");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await deleteUser(id);
        toast.success("Donor deleted");
        fetchDonors();
      } catch (error) {
        toast.error("Failed to delete donor");
      }
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donor.donorProfile?.organizationName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || donor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: donors.length,
    active: donors.filter((d) => d.status === "active").length,
    pending: donors.filter((d) => d.status === "pending").length,
    suspended: donors.filter((d) => d.status === "suspended").length,
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Donateurs</h1>
          <p className="text-gray-500 mt-1">
            Gérez les commerces et entreprises donateurs
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDonors}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
            <FiPlus className="w-4 h-4" />
            Ajouter un donateur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total donateurs</p>
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom, organisation ou email..."
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Entreprise
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Contact
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
              {filteredDonors.map((donor) => (
                <tr
                  key={donor.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <FaStore className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {donor.donorProfile?.organizationName || donor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {donor.donorProfile?.businessType || "Commerce"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{donor.name}</p>
                    <p className="text-xs text-gray-500">{donor.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">{donor.wilaya || "-"}</td>
                  <td className="p-4">{getStatusBadge(donor.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDonor(donor);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {donor.donorProfile?.isVerified === false && (
                        <button
                          onClick={() => handleVerify(donor.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {donor.status === "active" && (
                        <button
                          onClick={() => handleDeactivate(donor.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      )}
                      {donor.status === "suspended" && (
                        <button
                          onClick={() => handleActivate(donor.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(donor.id)}
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

      {/* Modal */}
      {showModal && selectedDonor && (
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
                  Détails du donateur
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
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <FaStore className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedDonor.donorProfile?.organizationName ||
                      selectedDonor.name}
                  </h3>
                  <p className="text-gray-500">
                    {selectedDonor.donorProfile?.businessType || "Donateur"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-gray-800">{selectedDonor.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-800">{selectedDonor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-gray-800">{selectedDonor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Wilaya</p>
                    <p className="text-gray-800">
                      {selectedDonor.wilaya || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date d'inscription</p>
                    <p className="text-gray-800">
                      {new Date(selectedDonor.createdAt).toLocaleDateString()}
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

export default Donors;
