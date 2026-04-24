/// pages/admin/Notifications.tsx
import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiBell,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { FaStore, FaHandHoldingHeart } from "react-icons/fa";
import { sendNotification, getAllNotifications } from "../../lib/API";
import toast from "react-hot-toast";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  target: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  isRead: boolean;
  sentAt: string;
}

const Notifications: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "all" as "all" | "donors" | "beneficiaries",
  });
  const [isSending, setIsSending] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getAllNotifications(page, 50);
      setNotifications(res.notifications || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Veuillez remplir le titre et le message");
      return;
    }

    setIsSending(true);
    try {
      await sendNotification(formData);
      toast.success(`Notification envoyée avec succès !`);
      setFormData({ title: "", message: "", target: "all" });
      fetchNotifications(); // Rafraîchir l'historique
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const getTargetLabel = (target: string) => {
    switch (target) {
      case "all":
        return "Tous";
      case "donors":
        return "Donateurs";
      case "beneficiaries":
        return "Bénéficiaires";
      default:
        return target;
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "all":
        return <FiUsers className="w-4 h-4" />;
      case "donors":
        return <FaStore className="w-4 h-4" />;
      case "beneficiaries":
        return <FaHandHoldingHeart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "donor":
        return <FaStore className="w-3 h-3 text-emerald-600" />;
      case "beneficiary":
        return <FaHandHoldingHeart className="w-3 h-3 text-blue-600" />;
      default:
        return <FiUser className="w-3 h-3 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "donor":
        return "Donateur";
      case "beneficiary":
        return "Bénéficiaire";
      default:
        return "Utilisateur";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Envoyez des notifications et consultez l'historique
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiSend className="w-5 h-5 text-emerald-600" />
          Nouvelle notification
        </h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Ex: Nouveau surplus disponible"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
              placeholder="Écrivez votre message ici..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destinataires
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: "all" })}
                className={`flex-1 px-4 py-2 rounded-xl transition ${
                  formData.target === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📢 Tous
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: "donors" })}
                className={`flex-1 px-4 py-2 rounded-xl transition ${
                  formData.target === "donors"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🏪 Donateurs
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, target: "beneficiaries" })
                }
                className={`flex-1 px-4 py-2 rounded-xl transition ${
                  formData.target === "beneficiaries"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🤝 Bénéficiaires
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
            {isSending ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>

      {/* Notifications History - Toutes les notifications */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiClock className="w-5 h-5 text-emerald-600" />
            Historique complet des notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Toutes les notifications envoyées à tous les utilisateurs
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FiBell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune notification dans l'historique</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-800">
                        {notif.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        {getTargetIcon(notif.target)}{" "}
                        {getTargetLabel(notif.target)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />{" "}
                        {new Date(notif.sentAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" /> {notif.recipientName}
                      </span>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(notif.recipientRole)}{" "}
                        {getRoleLabel(notif.recipientRole)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMail className="w-3 h-3" /> {notif.recipientEmail}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notif.isRead ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                        <FiEye className="w-3 h-3" /> Lu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        <FiCheckCircle className="w-3 h-3" /> Non lu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-500">
              Page {page} sur {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
