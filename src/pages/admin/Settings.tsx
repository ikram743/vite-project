// pages/admin/Settings.tsx
import React, { useState } from "react";
import "./Settings.css";

interface SettingsData {
  // General Settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  address: string;

  // Platform Settings
  requireApproval: boolean;
  autoPublishListings: boolean;
  enableGeolocation: boolean;
  enableNotifications: boolean;
  maxListingAge: number;

  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  notificationEmail: string;

  // Appearance
  primaryColor: string;

  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState<SettingsData>({
    siteName: "FoodShare Algeria",
    siteDescription: "Lutter contre le gaspillage alimentaire en Algérie",
    contactEmail: "contact@foodshare.dz",
    supportPhone: "+213 555 123 456",
    address: "123 Rue Didouche Mourad, Algiers",
    requireApproval: true,
    autoPublishListings: false,
    enableGeolocation: true,
    enableNotifications: true,
    maxListingAge: 24,
    emailNotifications: true,
    pushNotifications: false,
    dailyDigest: true,
    notificationEmail: "notifications@foodshare.dz",
    primaryColor: "#1e3a2f",
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Settings saved:", settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsSaving(false);
  };

  const tabs = [
    { id: "general", label: "Général", icon: "fa-cog" },
    { id: "platform", label: "Plateforme", icon: "fa-globe" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "appearance", label: "Apparence", icon: "fa-paint-brush" },
    { id: "security", label: "Sécurité", icon: "fa-shield-alt" },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <h2>Paramètres</h2>
          <p>Gérez la configuration de votre plateforme</p>
        </div>
        <div className="header-actions">
          {saveSuccess && (
            <div className="save-success">
              <i className="fas fa-check-circle"></i>
              Paramètres enregistrés !
            </div>
          )}
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Enregistrement...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="settings-section">
            <h3>Informations Générales</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Nom du site</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Description du site</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Email de contact</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Téléphone support</label>
                <input
                  type="tel"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Platform Settings */}
        {activeTab === "platform" && (
          <div className="settings-section">
            <h3>Configuration de la plateforme</h3>
            <div className="settings-grid">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="requireApproval"
                    checked={settings.requireApproval}
                    onChange={handleInputChange}
                  />
                  <span>
                    Approbation requise pour les nouveaux utilisateurs
                  </span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="autoPublishListings"
                    checked={settings.autoPublishListings}
                    onChange={handleInputChange}
                  />
                  <span>Publication automatique des surplus</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enableGeolocation"
                    checked={settings.enableGeolocation}
                    onChange={handleInputChange}
                  />
                  <span>Activer la géolocalisation</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleInputChange}
                  />
                  <span>Activer les notifications</span>
                </label>
              </div>

              <div className="form-group">
                <label>Durée maximale d'une annonce (heures)</label>
                <input
                  type="number"
                  name="maxListingAge"
                  value={settings.maxListingAge}
                  onChange={handleInputChange}
                  min="1"
                  max="72"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="settings-section">
            <h3>Préférences de notifications</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Email pour notifications</label>
                <input
                  type="email"
                  name="notificationEmail"
                  value={settings.notificationEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                  />
                  <span>Notifications par email</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={handleInputChange}
                  />
                  <span>Notifications push</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dailyDigest"
                    checked={settings.dailyDigest}
                    onChange={handleInputChange}
                  />
                  <span>Résumé quotidien</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <div className="settings-section">
            <h3>Apparence</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Couleur principale</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="preview-box">
                <div
                  className="preview-text"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Aperçu de la couleur
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="settings-section">
            <h3>Sécurité</h3>
            <div className="settings-grid">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleInputChange}
                  />
                  <span>Authentification à deux facteurs</span>
                </label>
              </div>

              <div className="form-group">
                <label>Durée de session (minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                  min="5"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label>Tentatives de connexion max</label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleInputChange}
                  min="3"
                  max="10"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="danger-zone">
        <h3>Zone de danger</h3>
        <div className="danger-actions">
          <div className="danger-action">
            <div>
              <h4>Exporter les données</h4>
              <p>Télécharger toutes les données de la plateforme</p>
            </div>
            <button className="btn-outline">
              <i className="fas fa-download"></i> Exporter
            </button>
          </div>

          <div className="danger-action">
            <div>
              <h4>Réinitialiser la plateforme</h4>
              <p>Restaurer les paramètres par défaut (irréversible)</p>
            </div>
            <button className="btn-danger">
              <i className="fas fa-exclamation-triangle"></i> Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
