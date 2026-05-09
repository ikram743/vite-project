// pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  getDashboardStats,
  getOverallImpact,
  getTopDonors,
  getRecentActivities,
  getQuickStats,
  exportDonationsPDF,
  exportUsersPDF,
  exportStatsPDF,
} from "../../lib/API";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import {
  FaStore,
  FaHandHoldingHeart,
  FaUtensils,
  FaRecycle,
  FaLeaf as FiLeaf,
} from "react-icons/fa";

// ============================================
// TYPES / INTERFACES
// ============================================

interface DonationStats {
  total: number;
  active: number;
  completed: number;
  expired: number;
}

interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface UserStats {
  total: number;
  donors: number;
  beneficiaries: number;
  admins: number;
}

interface ImpactStats {
  totalQuantityKg: number;
  mealsServed: number;
  co2Saved: number;
}

interface DashboardStatsData {
  donations: DonationStats;
  requests: RequestStats;
  users: UserStats;
  impact: ImpactStats;
}

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
  totalDonated?: number;
  count?: number;
}

interface Activity {
  type: string;
  message: string;
  date: string;
  createdAt?: string;
  donationId?: string;
  requestId?: string;
}

interface QuickStatsData {
  newDonationsToday: number;
  newRequestsToday: number;
  pendingVerifications: number;
  activeDonations: number;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<DashboardStatsData>({
    donations: { total: 0, active: 0, completed: 0, expired: 0 },
    requests: { total: 0, pending: 0, approved: 0, rejected: 0 },
    users: { total: 0, donors: 0, beneficiaries: 0, admins: 0 },
    impact: { totalQuantityKg: 0, mealsServed: 0, co2Saved: 0 },
  });

  const [impact, setImpact] = useState<ImpactData>({
    totalQuantityKg: 0,
    beneficiariesServed: 0,
    co2SavedKg: 0,
    mealsServed: 0,
    activeDonors: 0,
    activeBeneficiaries: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);

  const [quickStats, setQuickStats] = useState<QuickStatsData>({
    newDonationsToday: 0,
    newRequestsToday: 0,
    pendingVerifications: 0,
    activeDonations: 0,
  });

  const [exporting, setExporting] = useState<
    "donations" | "users" | "donors" | "beneficiaries" | "stats" | null
  >(null);

  // ============================================
  // DATA FETCHING FUNCTIONS
  // ============================================

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res && res.donations) {
        setStats(res);
      } else if (res && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Could not load dashboard statistics");
    }
  };

  const fetchImpact = async () => {
    try {
      const res = await getOverallImpact();
      if (res) {
        setImpact(res);
      }
    } catch (error) {
      console.error("Failed to fetch impact:", error);
    }
  };

  const fetchTopDonors = async () => {
    try {
      const res = await getTopDonors(5);
      if (res && res.donors && Array.isArray(res.donors)) {
        setTopDonors(res.donors);
      } else if (res && Array.isArray(res)) {
        setTopDonors(res);
      } else {
        setTopDonors([]);
      }
    } catch (error) {
      console.error("Failed to fetch top donors:", error);
      setTopDonors([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await getRecentActivities(10);
      if (res && res.activities && Array.isArray(res.activities)) {
        setActivities(res.activities);
      } else if (res && Array.isArray(res)) {
        setActivities(res);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setActivities([]);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const res = await getQuickStats();
      if (res) {
        setQuickStats(res);
      }
    } catch (error) {
      console.error("Failed to fetch quick stats:", error);
    }
  };

  // ✅ loadData avec mise à jour des states
  const loadData = async () => {
    setLoading(true);
    try {
      console.log("🟢 Chargement des données...");

      const [statsRes, impactRes, donorsRes, activitiesRes, quickStatsRes] =
        await Promise.all([
          getDashboardStats(),
          getOverallImpact(),
          getTopDonors(5),
          getRecentActivities(10),
          getQuickStats(),
        ]);

      console.log("📊 statsRes:", statsRes);
      console.log("🌍 impactRes:", impactRes);
      console.log("🏆 donorsRes:", donorsRes);
      console.log("📋 activitiesRes:", activitiesRes);
      console.log("⚡ quickStatsRes:", quickStatsRes);

      if (statsRes) setStats(statsRes);
      if (impactRes) setImpact(impactRes);
      if (donorsRes?.donors) setTopDonors(donorsRes.donors);
      if (activitiesRes?.activities) setActivities(activitiesRes.activities);
      if (quickStatsRes) setQuickStats(quickStatsRes);
    } catch (error) {
      console.error("❌ Erreur:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStats(),
      fetchImpact(),
      fetchTopDonors(),
      fetchActivities(),
      fetchQuickStats(),
    ]);
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================

  const handleExportDonations = async () => {
    setExporting("donations");
    try {
      await exportDonationsPDF();
      toast.success("Donations exported successfully");
    } catch (error) {
      toast.error("Failed to export donations");
    } finally {
      setExporting(null);
    }
  };

  const handleExportUsers = async () => {
    setExporting("users");
    try {
      await exportUsersPDF();
      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
    } finally {
      setExporting(null);
    }
  };

  const handleExportStats = async () => {
    setExporting("stats");
    try {
      await exportStatsPDF();
      toast.success("Statistics exported successfully");
    } catch (error) {
      toast.error("Failed to export statistics");
    } finally {
      setExporting(null);
    }
  };

  const handleExportDonors = async () => {
    setExporting("donors");
    try {
      await exportUsersPDF("donor");
      toast.success("Donors exported successfully");
    } catch (error) {
      toast.error("Failed to export donors");
    } finally {
      setExporting(null);
    }
  };

  const handleExportBeneficiaries = async () => {
    setExporting("beneficiaries");
    try {
      await exportUsersPDF("beneficiary");
      toast.success("Beneficiaries exported successfully");
    } catch (error) {
      toast.error("Failed to export beneficiaries");
    } finally {
      setExporting(null);
    }
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const getDonorName = (donor: TopDonor): string => {
    return donor.name || donor.organizationName || "Anonymous";
  };

  const getDonorQuantity = (donor: TopDonor): number => {
    return donor.totalQuantity || donor.totalDonated || 0;
  };

  const getDonorCount = (donor: TopDonor): number => {
    return donor.donationCount || donor.count || 0;
  };

  const renderTopDonors = () => {
    if (!topDonors || topDonors.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No donors yet</p>
          <p className="text-sm">Be the first to donate!</p>
        </div>
      );
    }

    return topDonors.map((donor: TopDonor, index: number) => (
      <div
        key={donor.userId || index}
        className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0
                ? "bg-yellow-100"
                : index === 1
                  ? "bg-gray-100"
                  : "bg-amber-100"
            }`}
          >
            <span
              className={`font-bold ${
                index === 0
                  ? "text-yellow-700"
                  : index === 1
                    ? "text-gray-600"
                    : "text-amber-700"
              }`}
            >
              #{index + 1}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{getDonorName(donor)}</p>
            <p className="text-xs text-gray-500">{donor.email || ""}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-emerald-600">
            {getDonorQuantity(donor)} kg
          </p>
          <p className="text-xs text-gray-500">
            {getDonorCount(donor)} donations
          </p>
        </div>
      </div>
    ));
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case "donation_created":
        return "🍽️";
      case "request_created":
        return "📦";
      case "user_registered":
        return "👤";
      case "donation_claimed":
        return "✅";
      default:
        return "📌";
    }
  };

  const getActivityDate = (activity: Activity): string => {
    return new Date(
      activity.date || activity.createdAt || Date.now(),
    ).toLocaleString();
  };

  const renderActivities = () => {
    if (!activities || activities.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>No recent activities</p>
        </div>
      );
    }

    return activities.map((activity: Activity, index: number) => (
      <div
        key={index}
        className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded-lg"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{activity.message}</p>
          <p className="text-xs text-gray-400">{getActivityDate(activity)}</p>
        </div>
      </div>
    ));
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Refresh and Export */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome to FoodShare Administration
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-10">
              <button
                onClick={handleExportDonations}
                disabled={exporting === "donations"}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
              >
                {exporting === "donations"
                  ? "Exporting..."
                  : "📊 Export Donations"}
              </button>
              <button
                onClick={handleExportDonors}
                disabled={exporting === "donors"}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {exporting === "donors" ? "Exporting..." : "🏪 Export Donors"}
              </button>
              <button
                onClick={handleExportBeneficiaries}
                disabled={exporting === "beneficiaries"}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {exporting === "beneficiaries"
                  ? "Exporting..."
                  : "🤝 Export Beneficiaries"}
              </button>
              <button
                onClick={handleExportUsers}
                disabled={exporting === "users"}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {exporting === "users" ? "Exporting..." : "👥 Export Users"}
              </button>
              <button
                onClick={handleExportStats}
                disabled={exporting === "stats"}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-xl"
              >
                {exporting === "stats"
                  ? "Exporting..."
                  : "📈 Export Statistics"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          IMPACT SECTION 
      ============================================ */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiLeaf className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Environmental Impact</h2>
              <p className="text-emerald-100 text-sm">
                Your platform's positive impact on the environment
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {impact.totalQuantityKg || stats.impact.totalQuantityKg || 0} kg
            </div>
            <div className="text-emerald-100 text-sm">Total redistributed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <FaUtensils className="w-5 h-5 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">
                Meals Served
              </span>
            </div>
            <div className="text-2xl font-bold">
              {impact.mealsServed || stats.impact.mealsServed || 0}
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              Based on 1kg ≈ 2 meals
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <FiLeaf className="w-5 h-5 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">
                CO₂ Saved
              </span>
            </div>
            <div className="text-2xl font-bold">
              {impact.co2SavedKg || stats.impact.co2Saved || 0} kg
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              Reducing carbon footprint
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <FaHandHoldingHeart className="w-5 h-5 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">
                Beneficiaries Served
              </span>
            </div>
            <div className="text-2xl font-bold">
              {impact.beneficiariesServed || 0}
            </div>
            <div className="text-xs text-emerald-200 mt-1">
              Communities helped
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Surplus</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.donations.total || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Surplus</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.donations.active || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Donors</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.users.donors || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaStore className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Beneficiaries</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.users.beneficiaries || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaHandHoldingHeart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Donors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🏆 Top Donors
            </h3>
          </div>
          <div className="p-5 max-h-[400px] overflow-y-auto">
            {renderTopDonors()}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📋 Recent Activities
            </h3>
          </div>
          <div className="p-5 max-h-[400px] overflow-y-auto">
            {renderActivities()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
// // pages/admin/AdminDashboard.tsx
// import React, { useState, useEffect } from "react";
// import {
//   getDashboardStats,
//   getOverallImpact,
//   getTopDonors,
//   getRecentActivities,
//   getQuickStats,
//   exportDonationsPDF,
//   exportUsersPDF,
//   exportStatsPDF,
// } from "../../lib/API";
// import toast from "react-hot-toast";
// import {
//   FiPackage,
//   FiUsers,
//   FiHeart,
//   FiTrendingUp,
//   FiDownload,
//   FiRefreshCw,
//   FiCheckCircle,
//   FiClock,
//   FiAlertCircle,
// } from "react-icons/fi";
// import { FaStore, FaHandHoldingHeart } from "react-icons/fa";

// // ============================================
// // TYPES / INTERFACES
// // ============================================

// interface DonationStats {
//   total: number;
//   active: number;
//   completed: number;
//   expired: number;
// }

// interface RequestStats {
//   total: number;
//   pending: number;
//   approved: number;
//   rejected: number;
// }

// interface UserStats {
//   total: number;
//   donors: number;
//   beneficiaries: number;
//   admins: number;
// }

// interface ImpactStats {
//   totalQuantityKg: number;
//   mealsServed: number;
//   co2Saved: number;
// }

// interface DashboardStatsData {
//   donations: DonationStats;
//   requests: RequestStats;
//   users: UserStats;
//   impact: ImpactStats;
// }

// interface ImpactData {
//   totalQuantityKg: number;
//   beneficiariesServed: number;
//   co2SavedKg: number;
//   mealsServed: number;
//   activeDonors: number;
//   activeBeneficiaries: number;
// }

// interface TopDonor {
//   userId: string;
//   name: string;
//   email: string;
//   organizationName?: string;
//   totalQuantity: number;
//   donationCount: number;
//   totalDonated?: number;
//   count?: number;
// }

// interface Activity {
//   type: string;
//   message: string;
//   date: string;
//   createdAt?: string;
//   donationId?: string;
//   requestId?: string;
// }

// interface QuickStatsData {
//   newDonationsToday: number;
//   newRequestsToday: number;
//   pendingVerifications: number;
//   activeDonations: number;
// }

// // ============================================
// // COMPOSANT PRINCIPAL
// // ============================================

// const AdminDashboard: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const [stats, setStats] = useState<DashboardStatsData>({
//     donations: { total: 0, active: 0, completed: 0, expired: 0 },
//     requests: { total: 0, pending: 0, approved: 0, rejected: 0 },
//     users: { total: 0, donors: 0, beneficiaries: 0, admins: 0 },
//     impact: { totalQuantityKg: 0, mealsServed: 0, co2Saved: 0 },
//   });

//   const [impact, setImpact] = useState<ImpactData>({
//     totalQuantityKg: 0,
//     beneficiariesServed: 0,
//     co2SavedKg: 0,
//     mealsServed: 0,
//     activeDonors: 0,
//     activeBeneficiaries: 0,
//   });

//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [topDonors, setTopDonors] = useState<TopDonor[]>([]);

//   const [quickStats, setQuickStats] = useState<QuickStatsData>({
//     newDonationsToday: 0,
//     newRequestsToday: 0,
//     pendingVerifications: 0,
//     activeDonations: 0,
//   });

//   const [exporting, setExporting] = useState<
//     "donations" | "users" | "donors" | "beneficiaries" | "stats" | null
//   >(null);

//   // ============================================
//   // DATA FETCHING FUNCTIONS
//   // ============================================

//   const fetchStats = async () => {
//     try {
//       const res = await getDashboardStats();
//       if (res && res.donations) {
//         setStats(res);
//       } else if (res && res.data) {
//         setStats(res.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch stats:", error);
//       toast.error("Could not load dashboard statistics");
//     }
//   };

//   const fetchImpact = async () => {
//     try {
//       const res = await getOverallImpact();
//       if (res) {
//         setImpact(res);
//       }
//     } catch (error) {
//       console.error("Failed to fetch impact:", error);
//     }
//   };

//   const fetchTopDonors = async () => {
//     try {
//       const res = await getTopDonors(5);
//       if (res && res.donors && Array.isArray(res.donors)) {
//         setTopDonors(res.donors);
//       } else if (res && Array.isArray(res)) {
//         setTopDonors(res);
//       } else {
//         setTopDonors([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch top donors:", error);
//       setTopDonors([]);
//     }
//   };

//   const fetchActivities = async () => {
//     try {
//       const res = await getRecentActivities(10);
//       if (res && res.activities && Array.isArray(res.activities)) {
//         setActivities(res.activities);
//       } else if (res && Array.isArray(res)) {
//         setActivities(res);
//       } else {
//         setActivities([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch activities:", error);
//       setActivities([]);
//     }
//   };

//   const fetchQuickStats = async () => {
//     try {
//       const res = await getQuickStats();
//       if (res) {
//         setQuickStats(res);
//       }
//     } catch (error) {
//       console.error("Failed to fetch quick stats:", error);
//     }
//   };

//   // const loadData = async () => {
//   //   setLoading(true);
//   //   await Promise.all([
//   //     fetchStats(),
//   //     fetchImpact(),
//   //     fetchTopDonors(),
//   //     fetchActivities(),
//   //     // fetchQuickStats(),
//   //   ]);
//   //   setLoading(false);
//   // };
//   // AdminDashboard.tsx - dans loadData()
//   const loadData = async () => {
//     setLoading(true);
//     try {
//       console.log("🟢 Chargement des données...");

//       const statsRes = await getDashboardStats();
//       console.log("📊 statsRes:", statsRes);

//       const impactRes = await getOverallImpact();
//       console.log("🌍 impactRes:", impactRes);

//       const donorsRes = await getTopDonors(5);
//       console.log("🏆 donorsRes:", donorsRes);

//       const activitiesRes = await getRecentActivities(10);
//       console.log("📋 activitiesRes:", activitiesRes);

//       const quickStatsRes = await getQuickStats();
//       console.log("⚡ quickStatsRes:", quickStatsRes);

//       // ... suite
//     } catch (error) {
//       console.error("❌ Erreur:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const refreshData = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchStats(),
//       fetchImpact(),
//       fetchTopDonors(),
//       fetchActivities(),
//       fetchQuickStats(),
//     ]);
//     setRefreshing(false);
//     toast.success("Dashboard refreshed");
//   };
//   useEffect(() => {
//     loadData();
//   }, []);

//   // ============================================
//   // EXPORT FUNCTIONS
//   // ============================================

//   const handleExportDonations = async () => {
//     setExporting("donations");
//     try {
//       await exportDonationsPDF();
//       toast.success("Donations exported successfully");
//     } catch (error) {
//       toast.error("Failed to export donations");
//     } finally {
//       setExporting(null);
//     }
//   };

//   const handleExportUsers = async () => {
//     setExporting("users");
//     try {
//       await exportUsersPDF();
//       toast.success("Users exported successfully");
//     } catch (error) {
//       toast.error("Failed to export users");
//     } finally {
//       setExporting(null);
//     }
//   };

//   const handleExportStats = async () => {
//     setExporting("stats");
//     try {
//       await exportStatsPDF();
//       toast.success("Statistics exported successfully");
//     } catch (error) {
//       toast.error("Failed to export statistics");
//     } finally {
//       setExporting(null);
//     }
//   };

//   const handleExportDonors = async () => {
//     setExporting("donors");
//     try {
//       await exportUsersPDF("donor");
//       toast.success("Donors exported successfully");
//     } catch (error) {
//       toast.error("Failed to export donors");
//     } finally {
//       setExporting(null);
//     }
//   };

//   const handleExportBeneficiaries = async () => {
//     setExporting("beneficiaries");
//     try {
//       await exportUsersPDF("beneficiary");
//       toast.success("Beneficiaries exported successfully");
//     } catch (error) {
//       toast.error("Failed to export beneficiaries");
//     } finally {
//       setExporting(null);
//     }
//   };

//   // ============================================
//   // RENDER FUNCTIONS
//   // ============================================

//   const getDonorName = (donor: TopDonor): string => {
//     return donor.name || donor.organizationName || "Anonymous";
//   };

//   const getDonorQuantity = (donor: TopDonor): number => {
//     return donor.totalQuantity || donor.totalDonated || 0;
//   };

//   const getDonorCount = (donor: TopDonor): number => {
//     return donor.donationCount || donor.count || 0;
//   };

//   const renderTopDonors = () => {
//     if (!topDonors || topDonors.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-500">
//           <p>No donors yet</p>
//           <p className="text-sm">Be the first to donate!</p>
//         </div>
//       );
//     }

//     return topDonors.map((donor: TopDonor, index: number) => (
//       <div
//         key={donor.userId || index}
//         className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded-lg"
//       >
//         <div className="flex items-center gap-3">
//           <div
//             className={`w-8 h-8 rounded-full flex items-center justify-center ${
//               index === 0
//                 ? "bg-yellow-100"
//                 : index === 1
//                   ? "bg-gray-100"
//                   : "bg-amber-100"
//             }`}
//           >
//             <span
//               className={`font-bold ${
//                 index === 0
//                   ? "text-yellow-700"
//                   : index === 1
//                     ? "text-gray-600"
//                     : "text-amber-700"
//               }`}
//             >
//               #{index + 1}
//             </span>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-800">{getDonorName(donor)}</p>
//             <p className="text-xs text-gray-500">{donor.email || ""}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="font-bold text-emerald-600">
//             {getDonorQuantity(donor)} kg
//           </p>
//           <p className="text-xs text-gray-500">
//             {getDonorCount(donor)} donations
//           </p>
//         </div>
//       </div>
//     ));
//   };

//   const getActivityIcon = (type: string): string => {
//     switch (type) {
//       case "donation_created":
//         return "🍽️";
//       case "request_created":
//         return "📦";
//       case "user_registered":
//         return "👤";
//       case "donation_claimed":
//         return "✅";
//       default:
//         return "📌";
//     }
//   };

//   const getActivityDate = (activity: Activity): string => {
//     return new Date(
//       activity.date || activity.createdAt || Date.now(),
//     ).toLocaleString();
//   };

//   const renderActivities = () => {
//     if (!activities || activities.length === 0) {
//       return (
//         <div className="text-center py-8 text-gray-500">
//           <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//           <p>No recent activities</p>
//         </div>
//       );
//     }

//     return activities.map((activity: Activity, index: number) => (
//       <div
//         key={index}
//         className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded-lg"
//       >
//         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
//           {getActivityIcon(activity.type)}
//         </div>
//         <div className="flex-1">
//           <p className="text-sm text-gray-800">{activity.message}</p>
//           <p className="text-xs text-gray-400">{getActivityDate(activity)}</p>
//         </div>
//       </div>
//     ));
//   };

//   // ============================================
//   // LOADING STATE
//   // ============================================

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // MAIN RENDER
//   // ============================================

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header with Refresh and Export */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <p className="text-gray-500 mt-1">
//             Welcome to FoodShare Administration
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <div className="relative group">
//             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition">
//               <FiDownload className="w-4 h-4" />
//               Export
//             </button>
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-10">
//               <button
//                 onClick={handleExportDonations}
//                 disabled={exporting === "donations"}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
//               >
//                 {exporting === "donations"
//                   ? "Exporting..."
//                   : "📊 Export Donations"}
//               </button>
//               <button
//                 onClick={handleExportDonors}
//                 disabled={exporting === "donors"}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 {exporting === "donors" ? "Exporting..." : "🏪 Export Donors"}
//               </button>
//               <button
//                 onClick={handleExportBeneficiaries}
//                 disabled={exporting === "beneficiaries"}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 {exporting === "beneficiaries"
//                   ? "Exporting..."
//                   : "🤝 Export Beneficiaries"}
//               </button>
//               <button
//                 onClick={handleExportUsers}
//                 disabled={exporting === "users"}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 {exporting === "users" ? "Exporting..." : "👥 Export Users"}
//               </button>
//               <button
//                 onClick={handleExportStats}
//                 disabled={exporting === "stats"}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-xl"
//               >
//                 {exporting === "stats"
//                   ? "Exporting..."
//                   : "📈 Export Statistics"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Surplus</p>
//               <p className="text-3xl font-bold text-gray-800">
//                 {stats.donations.total || 0}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
//               <FiPackage className="w-6 h-6 text-emerald-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Active Surplus</p>
//               <p className="text-3xl font-bold text-gray-800">
//                 {stats.donations.active || 0}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <FiTrendingUp className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Donors</p>
//               <p className="text-3xl font-bold text-gray-800">
//                 {stats.users.donors || 0}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//               <FaStore className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Beneficiaries</p>
//               <p className="text-3xl font-bold text-gray-800">
//                 {stats.users.beneficiaries || 0}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               <FaHandHoldingHeart className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Top Donors */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               🏆 Top Donors
//             </h3>
//           </div>
//           <div className="p-5 max-h-[400px] overflow-y-auto">
//             {renderTopDonors()}
//           </div>
//         </div>

//         {/* Recent Activities */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               📋 Recent Activities
//             </h3>
//           </div>
//           <div className="p-5 max-h-[400px] overflow-y-auto">
//             {renderActivities()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
