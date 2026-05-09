// pages/admin/Profile.tsx
import React, { useState, useEffect } from "react";
import { FiSave, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { getProfile, updateProfile } from "../../lib/API";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
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
                Email cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
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
                Address
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
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
