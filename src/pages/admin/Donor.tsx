// pages/admin/Donors.tsx
// pages/admin/Donors.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiXCircle,
  FiCheckCircle,
  FiTrash2,
  FiPlus,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { getUsers, verifyDonor, deleteUser, register } from "../../lib/API";
import toast from "react-hot-toast";

// Liste des wilayas
const WILAYAS = [
  { code: "01", name: "Adrar" },
  { code: "02", name: "Chlef" },
  { code: "03", name: "Laghouat" },
  { code: "04", name: "Oum El Bouaghi" },
  { code: "05", name: "Batna" },
  { code: "06", name: "Béjaïa" },
  { code: "07", name: "Biskra" },
  { code: "08", name: "Béchar" },
  { code: "09", name: "Blida" },
  { code: "10", name: "Bouira" },
  { code: "11", name: "Tamanrasset" },
  { code: "12", name: "Tébessa" },
  { code: "13", name: "Tlemcen" },
  { code: "14", name: "Tiaret" },
  { code: "15", name: "Tizi Ouzou" },
  { code: "16", name: "Alger" },
  { code: "17", name: "Djelfa" },
  { code: "18", name: "Jijel" },
  { code: "19", name: "Sétif" },
  { code: "20", name: "Saïda" },
  { code: "21", name: "Skikda" },
  { code: "22", name: "Sidi Bel Abbès" },
  { code: "23", name: "Annaba" },
  { code: "24", name: "Guelma" },
  { code: "25", name: "Constantine" },
  { code: "26", name: "Médéa" },
  { code: "27", name: "Mostaganem" },
  { code: "28", name: "M'Sila" },
  { code: "29", name: "Mascara" },
  { code: "30", name: "Ouargla" },
  { code: "31", name: "Oran" },
  { code: "32", name: "El Bayadh" },
  { code: "33", name: "Illizi" },
  { code: "34", name: "Bordj Bou Arréridj" },
  { code: "35", name: "Boumerdès" },
  { code: "36", name: "El Tarf" },
  { code: "37", name: "Tindouf" },
  { code: "38", name: "Tissemsilt" },
  { code: "39", name: "El Oued" },
  { code: "40", name: "Khenchela" },
  { code: "41", name: "Souk Ahras" },
  { code: "42", name: "Tipaza" },
  { code: "43", name: "Mila" },
  { code: "44", name: "Aïn Defla" },
  { code: "45", name: "Naâma" },
  { code: "46", name: "Aïn Témouchent" },
  { code: "47", name: "Ghardaïa" },
  { code: "48", name: "Relizane" },
  { code: "49", name: "Timimoun" },
  { code: "50", name: "Bordj Badji Mokhtar" },
  { code: "51", name: "Ouled Djellal" },
  { code: "52", name: "Béni Abbès" },
  { code: "53", name: "In Salah" },
  { code: "54", name: "In Guezzam" },
  { code: "55", name: "Touggourt" },
  { code: "56", name: "Djanet" },
  { code: "57", name: "El Meghaier" },
  { code: "58", name: "El Menia" },
];

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  createdAt: string;
  donorProfile?: {
    organizationName: string;
    businessType: string;
    isVerified: boolean;
  };
}

const Donors: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingDonor, setCreatingDonor] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    wilaya: "",
    businessName: "",
    businessType: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleCreateDonor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!formData.wilaya) {
      toast.error("Please select a wilaya");
      return;
    }

    try {
      setCreatingDonor(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        wilaya: formData.wilaya,
        role: "donor",
        organizationName: formData.businessName,
        businessType: formData.businessType.toLowerCase(),
      });
      toast.success("Donor created successfully");
      setShowCreateModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        wilaya: "",
        businessName: "",
        businessType: "",
        password: "",
        confirmPassword: "",
      });
      fetchDonors();
    } catch (error: any) {
      console.error("Error creating donor:", error);
      toast.error(error.response?.data?.message || "Failed to create donor");
    } finally {
      setCreatingDonor(false);
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donor.donorProfile?.organizationName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getWilayaName = (code: string) => {
    const wilaya = WILAYAS.find((w) => w.code === code);
    return wilaya ? `${wilaya.code} - ${wilaya.name}` : code || "-";
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          Ajouter un donateur
        </button>
      </div>

      {/* Stats Cards (sans statut) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{donors.length}</p>
          <p className="text-sm text-gray-500">Total donateurs</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">
            {donors.filter((d) => d.donorProfile?.isVerified).length}
          </p>
          <p className="text-sm text-gray-500">Vérifiés</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">
            {donors.filter((d) => !d.donorProfile?.isVerified).length}
          </p>
          <p className="text-sm text-gray-500">Non vérifiés</p>
        </div>
      </div>

      {/* Search */}
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
      </div>

      {/* Table */}
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
                  <td className="p-4 text-gray-600">
                    {getWilayaName(donor.wilaya)}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDonor(donor);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="Voir détails"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(donor.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun donateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Donor Modal */}
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
                  Créer un nouveau donateur
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiXCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateDonor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
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
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0612345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'entreprise *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="supermarket">Supermarché</option>
                  <option value="bakery">Boulangerie</option>
                  <option value="hotel">Hôtel</option>
                  <option value="other">Autre</option>
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
                  Wilaya *
                </label>
                <select
                  value={formData.wilaya}
                  onChange={(e) =>
                    setFormData({ ...formData, wilaya: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Sélectionner une wilaya</option>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="•••••••• (min 6 caractères)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe *
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
                disabled={creatingDonor}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 font-medium"
              >
                {creatingDonor ? "Création..." : "Créer le donateur"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
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
                      {getWilayaName(selectedDonor.wilaya)}
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
