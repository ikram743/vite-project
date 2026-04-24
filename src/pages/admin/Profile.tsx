// pages/admin/Settings.tsx
import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiGlobe,
  FiBell,
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
} from "react-icons/fi";
import { getProfile, updateProfile, changePassword } from "../../lib/API";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "security"
  >("general");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Platform settings (local state only - would need backend endpoints)
  const [platformSettings, setPlatformSettings] = useState({
    platformName: "FoodShare Algeria",
    contactEmail: "contact@foodshare.dz",
    contactPhone: "+213 555 123 456",
    address: "Algiers, Algeria",
    emailNotifications: true,
    pushNotifications: false,
    dailySummary: true,
    twoFactorAuth: false,
    sessionDuration: 30,
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfile({
        name: res.user?.name || "",
        email: res.user?.email || "",
        phone: res.user?.phone || "",
        address: res.user?.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Could not load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success("Profile updated successfully");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setUpdating(true);
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      toast.success("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
  };

  // Update platform settings (local only - would need backend)
  const handleSavePlatformSettings = () => {
    // In a real app, you would send these to a backend endpoint
    // For now, just show a success message
    toast.success("Platform settings saved");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-gray-500 mt-1">Configurez votre plateforme</p>
        </div>
        <button
          onClick={fetchProfile}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "general"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiUser className="inline mr-2" /> Mon profil
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "security"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiShield className="inline mr-2" /> Sécurité
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "notifications"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiBell className="inline mr-2" /> Notifications
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        {/* My Profile Tab */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  L'email ne peut pas être modifié
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {saved ? "Enregistré !" : "Enregistrer"}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Changer le mot de passe
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder="Entrez votre mot de passe actuel"
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showOldPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Au moins 6 caractères"
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirmez votre nouveau mot de passe"
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={updating}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {updating ? "Changement..." : "Changer le mot de passe"}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Paramètres de sécurité
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">
                    Authentification à deux facteurs
                  </span>
                  <input
                    type="checkbox"
                    checked={platformSettings.twoFactorAuth}
                    onChange={(e) =>
                      setPlatformSettings({
                        ...platformSettings,
                        twoFactorAuth: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée de session (minutes)
                  </label>
                  <input
                    type="number"
                    value={platformSettings.sessionDuration}
                    onChange={(e) =>
                      setPlatformSettings({
                        ...platformSettings,
                        sessionDuration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Préférences de notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Notifications email</span>
                <input
                  type="checkbox"
                  checked={platformSettings.emailNotifications}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Notifications push</span>
                <input
                  type="checkbox"
                  checked={platformSettings.pushNotifications}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      pushNotifications: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Résumé quotidien</span>
                <input
                  type="checkbox"
                  checked={platformSettings.dailySummary}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      dailySummary: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSavePlatformSettings}
                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              >
                <FiSave className="w-4 h-4" /> Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
