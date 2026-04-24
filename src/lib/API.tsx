// src/lib/API.ts
const API_URL = "http://localhost:3001/api";

// Helper pour gérer les réponses
async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || "Erreur serveur");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ============================================
// WILAYAS
// ============================================

export const getWilayas = async () => {
  const response = await fetch(`${API_URL}/wilayas`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.wilayas;
};

// ============================================
// AUTHENTIFICATION
// ============================================

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const updateProfile = async (userData: any) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  return handleResponse(response);
};

// ============================================
// DONS (DONATIONS)
// ============================================

export const getDonations = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/donations?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return handleResponse(response);
};

export const getDonationsNearby = async (
  lat: number,
  lng: number,
  radius = 10,
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/donations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return handleResponse(response);
};

export const getMyDonations = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/donations/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getDonationById = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/donations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const createDonation = async (donationData: any) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(donationData),
  });

  return handleResponse(response);
};

export const updateDonationStatus = async (id: string, status: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/donations/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
};

export const deleteDonation = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/donations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getDonationUnits = async () => {
  const response = await fetch(`${API_URL}/donations/units`);
  return handleResponse(response);
};

// ============================================
// DEMANDES (REQUESTS)
// ============================================

export const getMyRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/requests/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getReceivedRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/requests/received`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const createRequest = async (
  donationId: string,
  quantity: number,
  notes?: string,
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ donationId, quantity, notes }),
  });

  return handleResponse(response);
};

export const updateRequestStatus = async (id: string, status: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
};

// ============================================
// NOTIFICATIONS
// ============================================

export const getNotifications = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const markNotificationAsRead = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

// ============================================
// ADMIN NOTIFICATIONS
// ============================================

// Envoyer une notification (admin)
export const sendNotification = async (data: {
  title: string;
  message: string;
  target: "all" | "donors" | "beneficiaries";
}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/notifications/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Récupérer TOUTES les notifications (admin - historique)
export const getAllNotifications = async (page = 1, limit = 50) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/admin/notifications/all?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return handleResponse(response);
};

// ============================================
// STATISTIQUES (ADMIN)
// ============================================

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getOverallImpact = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/impact`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getTopDonors = async (limit = 5) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/top-donors?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getRecentActivities = async (limit = 10) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/activities?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getImpactByPeriod = async (period: string = "month") => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/stats/impact/period?period=${period}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return handleResponse(response);
};

export const getImpactByWilaya = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/impact/wilaya`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getQuickStats = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stats/quick`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

// ============================================
// UTILISATEURS (ADMIN)
// ============================================

export const getUsers = async (page = 1, limit = 20) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getUserById = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const deleteUser = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const activateUser = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}/activate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const deactivateUser = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${id}/deactivate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const getUnverifiedUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/unverified`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const verifyDonor = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/donor/${id}/verify`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

export const changeRole = async (id: string, role: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  return handleResponse(response);
};

export const verifyBeneficiary = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/beneficiary/${id}/verify`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
};

// ============================================
// EXPORTS PDF
// ============================================

export const exportDonationsPDF = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/pdf/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `donations_${new Date().toISOString().split("T")[0]}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportUsersPDF = async (role?: string) => {
  const token = localStorage.getItem("token");
  const url = role
    ? `${API_URL}/pdf/users?role=${role}`
    : `${API_URL}/pdf/users`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = urlBlob;
  link.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.pdf`;
  link.click();
  window.URL.revokeObjectURL(urlBlob);
};

export const exportStatsPDF = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/pdf/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `statistiques_${new Date().toISOString().split("T")[0]}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
};
// src/lib/API.ts

// ============================================
// DISTRIBUTIONS
// ============================================

export const getDistributions = async (page = 1, limit = 20) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/distributions?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return handleResponse(response);
};

export const getDistributionById = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/distributions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getDistributionStats = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/distributions/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const updateDistributionStatus = async (id: string, status: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/distributions/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const cancelDistribution = async (id: string, reason?: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/distributions/${id}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  return handleResponse(response);
};
