// pages/admin/Impact.tsx
import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiHeart,
  FiPackage,
  FiDownload,
  FiCalendar,
  FiRefreshCw,
  FiLoader,
} from "react-icons/fi";
import { FaUtensils, FaLeaf, FaHandHoldingHeart } from "react-icons/fa";
import {
  getDashboardStats,
  getOverallImpact,
  getTopDonors,
  getImpactByPeriod,
  getImpactByWilaya,
  exportStatsPDF,
} from "../../lib/API";
import toast from "react-hot-toast";

interface ImpactData {
  totalQuantityKg: number;
  beneficiariesServed: number;
  co2SavedKg: number;
  mealsServed: number;
  activeDonors: number;
  activeBeneficiaries: number;
}

interface TopDonor {
  userId: string;
  name: string;
  email: string;
  organizationName?: string;
  totalQuantity: number;
  donationCount: number;
}

const Impact: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [impact, setImpact] = useState<ImpactData>({
    totalQuantityKg: 0,
    beneficiariesServed: 0,
    co2SavedKg: 0,
    mealsServed: 0,
    activeDonors: 0,
    activeBeneficiaries: 0,
  });
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const [periodData, setPeriodData] = useState<any[]>([]);

  // Fetch impact data from backend
  const fetchImpact = async () => {
    try {
      const res = await getOverallImpact();
      setImpact(res);
    } catch (error) {
      console.error("Failed to fetch impact:", error);
      toast.error("Could not load impact data");
    }
  };

  // Fetch top donors from backend
  const fetchTopDonors = async () => {
    try {
      const res = await getTopDonors(5);
      setTopDonors(res.donors || []);
    } catch (error) {
      console.error("Failed to fetch top donors:", error);
    }
  };

  // Fetch impact by period
  const fetchImpactByPeriod = async () => {
    try {
      const res = await getImpactByPeriod(period);
      setPeriodData(res);
    } catch (error) {
      console.error("Failed to fetch period data:", error);
    }
  };

  // Fetch all data
  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchImpact(), fetchTopDonors(), fetchImpactByPeriod()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchImpactByPeriod();
  }, [period]);

  const handleExportPDF = async () => {
    try {
      await exportStatsPDF();
      toast.success("Statistics exported successfully");
    } catch (error) {
      toast.error("Failed to export statistics");
    }
  };

  // Format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.floor(num));
  };

  // Get donor name
  const getDonorName = (donor: TopDonor) => {
    return donor.organizationName || donor.name || "Anonymous";
  };

  // Calculate meals from quantity (1 kg = 2 meals)
  const getMealsFromQuantity = (quantity: number) => {
    return formatNumber(quantity * 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Metrics for display
  const metrics = [
    {
      label: "Repas sauvés",
      value: formatNumber(impact.mealsServed),
      change: "+" + Math.round((impact.mealsServed / 1000) * 10) + "%",
      icon: FaUtensils,
      color: "emerald",
    },
    {
      label: "CO2 évité",
      value: formatNumber(impact.co2SavedKg),
      unit: "kg",
      change: "+" + Math.round((impact.co2SavedKg / 1000) * 10) + "%",
      icon: FaLeaf,
      color: "green",
    },
    {
      label: "Bénéficiaires servis",
      value: formatNumber(impact.beneficiariesServed),
      change: "+" + Math.round((impact.beneficiariesServed / 100) * 5) + "%",
      icon: FaHandHoldingHeart,
      color: "blue",
    },
    {
      label: "Donateurs actifs",
      value: formatNumber(impact.activeDonors),
      change: "+" + Math.round((impact.activeDonors / 10) * 2),
      icon: FiUsers,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Impact & Statistiques
          </h1>
          <p className="text-gray-500 mt-1">
            Mesurez l'impact de votre plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <FiRefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FiDownload className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{m.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {m.value}
                  {m.unit && (
                    <span className="text-sm text-gray-400 ml-1">{m.unit}</span>
                  )}
                </p>
                <p className="text-xs text-emerald-600 mt-2">▲ {m.change}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <m.icon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              🌱 Impact environnemental total
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold">
                  {formatNumber(impact.totalQuantityKg)} kg
                </p>
                <p className="text-emerald-100 text-sm">
                  Nourriture redistribuée
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {formatNumber(impact.mealsServed)}
                </p>
                <p className="text-emerald-100 text-sm">Repas servis</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {formatNumber(impact.co2SavedKg)} kg
                </p>
                <p className="text-emerald-100 text-sm">CO₂ évité</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution des dons */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              📊 Évolution des dons
            </h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="day">Par jour</option>
              <option value="week">Par semaine</option>
              <option value="month">Par mois</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            {periodData.length > 0 ? (
              <div className="w-full h-full p-4">
                {/* Simple bar chart representation */}
                <div className="flex items-end justify-around h-full gap-2">
                  {periodData.slice(0, 7).map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                        style={{
                          height: `${Math.min(
                            200,
                            (item.quantityKg /
                              Math.max(
                                ...periodData.map((p) => p.quantityKg),
                              )) *
                              150,
                          )}px`,
                        }}
                      />
                      <span className="text-xs text-gray-500 rotate-45">
                        {new Date(item.period).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Top Donors */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🏆 Top donateurs
          </h2>
          <div className="space-y-3">
            {topDonors.length > 0 ? (
              topDonors.map((donor, index) => (
                <div
                  key={donor.userId || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {getDonorName(donor)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {donor.totalQuantity} kg donnés
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      {getMealsFromQuantity(donor.totalQuantity)}
                    </p>
                    <p className="text-xs text-gray-500">repas</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun donateur pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
