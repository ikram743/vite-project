import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaEdit, FaSave, FaTimes, FaBox, FaUsers, FaStar, FaCalendar } from 'react-icons/fa';

const DonorProfile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    businessName: 'Artisan Bakery', businessType: 'Bakery', contactName: 'Ahmed Benali',
    email: 'ahmed.benali@bakery.dz', phone: '+213 555 123 456', address: '123 Rue Didouche, Algiers',
    registrationNumber: 'REG123456', taxNumber: 'TAX789012', joinedDate: 'January 2026',
    totalDonations: 48, totalBeneficiaries: 23, rating: 4.8
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Business Profile</h1><button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><FaEdit size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}</button></div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaBox className="text-emerald-600" /></div><div><div className="text-2xl font-bold">{profileData.totalDonations}</div><div className="text-sm text-gray-500">Total Donations</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaUsers className="text-blue-600" /></div><div><div className="text-2xl font-bold">{profileData.totalBeneficiaries}</div><div className="text-sm text-gray-500">Beneficiaries</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><FaStar className="text-amber-600" /></div><div><div className="text-2xl font-bold">{profileData.rating}</div><div className="text-sm text-gray-500">Rating</div></div></div>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3"><div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center"><FaCalendar className="text-rose-600" /></div><div><div className="text-2xl font-bold">{profileData.joinedDate}</div><div className="text-sm text-gray-500">Joined</div></div></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {!isEditing ? (<><div className="mb-6"><h3 className="text-lg font-semibold mb-3">Business Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm text-gray-500">Business Name</label><p className="font-medium">{profileData.businessName}</p></div><div><label className="text-sm text-gray-500">Business Type</label><p className="font-medium">{profileData.businessType}</p></div><div><label className="text-sm text-gray-500">Registration Number</label><p className="font-medium">{profileData.registrationNumber}</p></div><div><label className="text-sm text-gray-500">Tax Number</label><p className="font-medium">{profileData.taxNumber}</p></div></div></div><div><h3 className="text-lg font-semibold mb-3">Contact Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm text-gray-500">Contact Name</label><p className="font-medium">{profileData.contactName}</p></div><div><label className="text-sm text-gray-500">Email</label><p className="font-medium">{profileData.email}</p></div><div><label className="text-sm text-gray-500">Phone</label><p className="font-medium">{profileData.phone}</p></div><div><label className="text-sm text-gray-500">Address</label><p className="font-medium">{profileData.address}</p></div></div></div></>) : (<form><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Business Name</label><input type="text" name="businessName" value={profileData.businessName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Business Type</label><select name="businessType" value={profileData.businessType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"><option>Bakery</option><option>Restaurant</option><option>Supermarket</option></select></div><div><label className="block text-sm font-medium mb-1">Contact Name</label><input type="text" name="contactName" value={profileData.contactName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={profileData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" name="phone" value={profileData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Address</label><input type="text" name="address" value={profileData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="flex gap-3 mt-6"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50"><FaTimes className="inline mr-1" /> Cancel</button><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><FaSave className="inline mr-1" /> Save Changes</button></div></form>)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorProfile;