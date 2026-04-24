// pages/admin/Distributions.tsx
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiPackage,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import { FaStore, FaHandHoldingHeart } from "react-icons/fa";
import { getDistributions, updateDistributionStatus } from "../../lib/API";
import toast from "react-hot-toast";

interface Distribution {
  id: string;
  date: string;
  donorName: string;
  beneficiaryName: string;
  productName: string;
  quantity: number;
  unit: string;
  address: string;
  status: "completed" | "scheduled" | "cancelled";
  pickupTime: string;
}

const Distributions: React.FC = () => {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDistribution, setSelectedDistribution] =
    useState<Distribution | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch distributions from backend
  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const res = await getDistributions();
      setDistributions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch distributions:", error);
      toast.error("Could not load distributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDistributionStatus(id, newStatus);
      toast.success(`Distribution status updated to ${newStatus}`);
      fetchDistributions();
    } catch (error) {
      toast.error("Failed to update status");
    }
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

  const stats = {
    total: distributions.length,
    completed: distributions.filter((d) => d.status === "completed").length,
    scheduled: distributions.filter((d) => d.status === "scheduled").length,
    cancelled: distributions.filter((d) => d.status === "cancelled").length,
    totalQuantity: distributions.reduce((sum, d) => sum + d.quantity, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <FiCheckCircle className="w-3 h-3" /> Livré
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <FiClock className="w-3 h-3" /> Planifié
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <FiXCircle className="w-3 h-3" /> Annulé
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
          <h1 className="text-2xl font-bold text-gray-800">Distributions</h1>
          <p className="text-gray-500 mt-1">
            Suivez les distributions de nourriture
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDistributions}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
            <FiTruck className="w-4 h-4" />
            Nouvelle distribution
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">
            {stats.completed}
          </p>
          <p className="text-sm text-gray-500">Terminées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">{stats.scheduled}</p>
          <p className="text-sm text-gray-500">Planifiées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-gray-500">Annulées</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalQuantity} kg
          </p>
          <p className="text-sm text-gray-500">Total distribué</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par produit, donateur ou bénéficiaire..."
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
          <option value="completed">Terminés</option>
          <option value="scheduled">Planifiés</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Heure
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Donateur
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Bénéficiaire
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Produit
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
                  Quantité
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
              {filteredDistributions.map((dist) => (
                <tr
                  key={dist.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-600">{dist.date}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {dist.pickupTime}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <FaStore className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {dist.donorName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FaHandHoldingHeart className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {dist.beneficiaryName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {dist.productName}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {dist.quantity} {dist.unit}
                  </td>
                  <td className="p-4">
                    <select
                      value={dist.status}
                      onChange={(e) =>
                        handleStatusChange(dist.id, e.target.value)
                      }
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="scheduled">Planifié</option>
                      <option value="completed">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedDistribution(dist);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDistribution && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Détails de la distribution
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <FiXCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-gray-800">{selectedDistribution.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Heure</p>
                    <p className="text-gray-800">
                      {selectedDistribution.pickupTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaStore className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Donateur</p>
                    <p className="text-gray-800">
                      {selectedDistribution.donorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaHandHoldingHeart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Bénéficiaire</p>
                    <p className="text-gray-800">
                      {selectedDistribution.beneficiaryName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPackage className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Produit</p>
                    <p className="text-gray-800">
                      {selectedDistribution.productName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPackage className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Quantité</p>
                    <p className="text-gray-800 font-semibold">
                      {selectedDistribution.quantity}{" "}
                      {selectedDistribution.unit}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Adresse de retrait</p>
                    <p className="text-gray-800">
                      {selectedDistribution.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    {getStatusBadge(selectedDistribution.status)}
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

export default Distributions; // // pages/admin/Distributions.tsx
// import React, { useState } from "react";
// import {
//   FiSearch,
//   FiEye,
//   FiCheckCircle,
//   FiXCircle,
//   FiClock,
//   FiTruck,
//   FiCalendar,
//   FiMapPin,
//   FiUser,
//   FiPackage,
//   FiDownload,
// } from "react-icons/fi";
// import { FaStore, FaHandHoldingHeart } from "react-icons/fa";

// interface Distribution {
//   id: number;
//   date: string;
//   donorName: string;
//   beneficiaryName: string;
//   productName: string;
//   quantity: number;
//   unit: string;
//   address: string;
//   status: "completed" | "scheduled" | "cancelled";
//   pickupTime: string;
// }

// const Distributions: React.FC = () => {
//   const [distributions, setDistributions] = useState<Distribution[]>([
//     {
//       id: 1,
//       date: "14/04/2025",
//       donorName: "Artisan Bakery",
//       beneficiaryName: "Food Bank Algiers",
//       productName: "Baguettes",
//       quantity: 50,
//       unit: "unités",
//       address: "123 Rue Didouche, Alger",
//       status: "completed",
//       pickupTime: "14:30",
//     },
//     {
//       id: 2,
//       date: "14/04/2025",
//       donorName: "Supermarket El Djazair",
//       beneficiaryName: "Solidarité Oran",
//       productName: "Fruits & légumes",
//       quantity: 120,
//       unit: "kg",
//       address: "45 Boulevard Krim, Alger",
//       status: "scheduled",
//       pickupTime: "10:00",
//     },
//     {
//       id: 3,
//       date: "13/04/2025",
//       donorName: "Restaurant Le Jardin",
//       beneficiaryName: "Aide et Partage",
//       productName: "Plats préparés",
//       quantity: 45,
//       unit: "repas",
//       address: "12 Rue Larbi, Oran",
//       status: "completed",
//       pickupTime: "12:00",
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<string>("all");

//   const filteredDistributions = distributions.filter((d) => {
//     const matchesSearch =
//       d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === "all" || d.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const stats = {
//     total: distributions.length,
//     completed: distributions.filter((d) => d.status === "completed").length,
//     scheduled: distributions.filter((d) => d.status === "scheduled").length,
//     totalQuantity: distributions.reduce((sum, d) => sum + d.quantity, 0),
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return (
//           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
//             <FiCheckCircle className="w-3 h-3" /> Livré
//           </span>
//         );
//       case "scheduled":
//         return (
//           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
//             <FiClock className="w-3 h-3" /> Planifié
//           </span>
//         );
//       case "cancelled":
//         return (
//           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
//             <FiXCircle className="w-3 h-3" /> Annulé
//           </span>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Distributions</h1>
//           <p className="text-gray-500 mt-1">
//             Suivez les distributions de nourriture
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
//             <FiDownload className="w-4 h-4" />
//             Exporter
//           </button>
//           <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
//             <FiTruck className="w-4 h-4" />
//             Nouvelle distribution
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-4 border border-gray-100">
//           <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//           <p className="text-sm text-gray-500">Total distributions</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 border border-gray-100">
//           <p className="text-2xl font-bold text-emerald-600">
//             {stats.completed}
//           </p>
//           <p className="text-sm text-gray-500">Terminées</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 border border-gray-100">
//           <p className="text-2xl font-bold text-amber-600">{stats.scheduled}</p>
//           <p className="text-sm text-gray-500">Planifiées</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 border border-gray-100">
//           <p className="text-2xl font-bold text-blue-600">
//             {stats.totalQuantity} kg
//           </p>
//           <p className="text-sm text-gray-500">Total distribué</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1 relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Rechercher par produit, donateur ou bénéficiaire..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
//           />
//         </div>
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
//         >
//           <option value="all">Tous les statuts</option>
//           <option value="completed">Terminées</option>
//           <option value="scheduled">Planifiées</option>
//           <option value="cancelled">Annulées</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Date
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Heure
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Donateur
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Bénéficiaire
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Produit
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Quantité
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Statut
//                 </th>
//                 <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredDistributions.map((dist) => (
//                 <tr
//                   key={dist.id}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="p-4 text-sm text-gray-600">{dist.date}</td>
//                   <td className="p-4 text-sm text-gray-600">
//                     {dist.pickupTime}
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
//                         <FaStore className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <span className="text-sm font-medium text-gray-800">
//                         {dist.donorName}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
//                         <FaHandHoldingHeart className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <span className="text-sm text-gray-600">
//                         {dist.beneficiaryName}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-gray-600">
//                     {dist.productName}
//                   </td>
//                   <td className="p-4 text-sm font-medium text-gray-800">
//                     {dist.quantity} {dist.unit}
//                   </td>
//                   <td className="p-4">{getStatusBadge(dist.status)}</td>
//                   <td className="p-4">
//                     <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition">
//                       <FiEye className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Distributions;
