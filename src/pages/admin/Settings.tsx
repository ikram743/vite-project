/// pages/admin/Settings.tsx
import React, { useState } from "react";
import {
  FiSave,
  FiGlobe,
  FiBell,
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "security"
  >("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez votre plateforme</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium transition ${activeTab === "general" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FiGlobe className="inline mr-2" /> Général
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium transition ${activeTab === "notifications" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FiBell className="inline mr-2" /> Notifications
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-medium transition ${activeTab === "security" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          <FiShield className="inline mr-2" /> Sécurité
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        {activeTab === "general" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Informations générales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la plateforme
                </label>
                <input
                  type="text"
                  defaultValue="FoodShare Algeria"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  defaultValue="contact@foodshare.dz"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  defaultValue="+213 555 123 456"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  defaultValue="Algiers, Algeria"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

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
                  defaultChecked
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Notifications push</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Résumé quotidien</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Sécurité</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">
                  Authentification à deux facteurs
                </span>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée de session (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FiSave className="w-4 h-4" />{" "}
            {saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
