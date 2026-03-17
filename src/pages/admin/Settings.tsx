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

  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  notificationEmail: string;

  // Appearance
  primaryColor: string;
  logo: string | null;
  favicon: string | null;

  // Security
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock data - in real app, fetch from API
  const [settings, setSettings] = useState<SettingsData>({
    // General Settings
    siteName: "FoodShare Algeria",
    siteDescription: "Fighting food waste, feeding communities",
    contactEmail: "contact@foodshare.dz",
    supportPhone: "+213 555 123 456",
    address: "123 Rue Didouche Mourad, Algiers",

    // Platform Settings
    requireApproval: true,
    autoPublishListings: false,
    enableGeolocation: true,
    enableNotifications: true,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    dailyDigest: true,
    notificationEmail: "notifications@foodshare.dz",

    // Appearance
    primaryColor: "#1e3a2f",
    logo: null,
    favicon: null,

    // Security
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

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Settings saved:", settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, upload to server
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "fa-cog" },
    { id: "platform", label: "Platform", icon: "fa-globe" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "appearance", label: "Appearance", icon: "fa-paint-brush" },
    { id: "security", label: "Security", icon: "fa-shield-alt" },
    { id: "integrations", label: "Integrations", icon: "fa-plug" },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-left">
          <h2>Settings</h2>
          <p>Manage your platform configuration and preferences</p>
        </div>
        <div className="header-actions">
          {saveSuccess && (
            <div className="save-success">
              <i className="fas fa-check-circle"></i>
              Settings saved successfully!
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
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
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
            <h3>General Information</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  placeholder="FoodShare Algeria"
                />
              </div>

              <div className="form-group">
                <label>Site Description</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of your platform"
                />
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@foodshare.dz"
                />
              </div>

              <div className="form-group">
                <label>Support Phone</label>
                <input
                  type="tel"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleInputChange}
                  placeholder="+213 XXX XX XX XX"
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>
        )}

        {/* Platform Settings */}
        {activeTab === "platform" && (
          <div className="settings-section">
            <h3>Platform Configuration</h3>
            <div className="settings-grid">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="requireApproval"
                    checked={settings.requireApproval}
                    onChange={handleInputChange}
                  />
                  <span>Require admin approval for new users</span>
                </label>
                <p className="field-hint">
                  New users must be approved before they can access the platform
                </p>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="autoPublishListings"
                    checked={settings.autoPublishListings}
                    onChange={handleInputChange}
                  />
                  <span>Auto-publish surplus listings</span>
                </label>
                <p className="field-hint">
                  Listings are published immediately without review
                </p>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enableGeolocation"
                    checked={settings.enableGeolocation}
                    onChange={handleInputChange}
                  />
                  <span>Enable geolocation features</span>
                </label>
                <p className="field-hint">
                  Allow users to find nearby donations
                </p>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleInputChange}
                  />
                  <span>Enable notifications</span>
                </label>
                <p className="field-hint">Send real-time alerts to users</p>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Notification Email</label>
                <input
                  type="email"
                  name="notificationEmail"
                  value={settings.notificationEmail}
                  onChange={handleInputChange}
                  placeholder="notifications@foodshare.dz"
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
                  <span>Email notifications</span>
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
                  <span>Push notifications</span>
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
                  <span>Daily digest email</span>
                </label>
                <p className="field-hint">
                  Receive a summary of daily activity
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Primary Color</label>
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
                    placeholder="#1e3a2f"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Site Logo</label>
                <div className="file-upload">
                  {settings.logo ? (
                    <div className="logo-preview">
                      <img src={settings.logo} alt="Logo preview" />
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() =>
                          setSettings((prev) => ({ ...prev, logo: null }))
                        }
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="upload-area">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>Click to upload or drag and drop</p>
                      <span>PNG, JPG up to 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Favicon</label>
                <div className="file-upload">
                  <input type="file" accept="image/x-icon,image/png" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="settings-section">
            <h3>Security</h3>
            <div className="settings-grid">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleInputChange}
                  />
                  <span>Enable two-factor authentication</span>
                </label>
                <p className="field-hint">Require 2FA for admin accounts</p>
              </div>

              <div className="form-group">
                <label>Session Timeout (minutes)</label>
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
                <label>Max Login Attempts</label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleInputChange}
                  min="3"
                  max="10"
                />
                <p className="field-hint">
                  Number of failed attempts before lockout
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === "integrations" && (
          <div className="settings-section">
            <h3>Integrations</h3>
            <div className="integrations-grid">
              <div className="integration-card">
                <i className="fab fa-google"></i>
                <div className="integration-info">
                  <h4>Google Maps</h4>
                  <p>Enable geolocation features</p>
                </div>
                <button className="btn-outline">Configure</button>
              </div>

              <div className="integration-card">
                <i className="fab fa-facebook"></i>
                <div className="integration-info">
                  <h4>Facebook Login</h4>
                  <p>Allow users to sign in with Facebook</p>
                </div>
                <button className="btn-outline">Configure</button>
              </div>

              <div className="integration-card">
                <i className="fas fa-envelope"></i>
                <div className="integration-info">
                  <h4>Email Service</h4>
                  <p>Configure SMTP for notifications</p>
                </div>
                <button className="btn-outline">Configure</button>
              </div>

              <div className="integration-card">
                <i className="fas fa-sms"></i>
                <div className="integration-info">
                  <h4>SMS Gateway</h4>
                  <p>Send SMS notifications</p>
                </div>
                <button className="btn-outline">Configure</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <div className="danger-actions">
          <div className="danger-action">
            <div>
              <h4>Export Data</h4>
              <p>Download all platform data as JSON</p>
            </div>
            <button className="btn-outline">
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>

          <div className="danger-action">
            <div>
              <h4>Clear Cache</h4>
              <p>Remove temporary data and refresh</p>
            </div>
            <button className="btn-outline">
              <i className="fas fa-trash"></i>
              Clear
            </button>
          </div>

          <div className="danger-action">
            <div>
              <h4>Reset Platform</h4>
              <p>Restore default settings (cannot be undone)</p>
            </div>
            <button className="btn-danger">
              <i className="fas fa-exclamation-triangle"></i>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
