// src/pages/donor/DonorNotifications.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonorSidebar from '../../components/donor/DonorSidebar';
import { FaBell, FaCheck, FaClock, FaSpinner } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../lib/API';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  icon: string;
  type: 'reservation' | 'surplus' | 'system';
  createdAt?: string;
}

const DonorNotifications = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'reservation': return '✅';
      case 'surplus': return '🍞';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationIconBg = (type: string) => {
    switch(type) {
      case 'reservation': return 'bg-green-100 text-green-600';
      case 'surplus': return 'bg-blue-100 text-blue-600';
      case 'system': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      console.log('Notifications response:', response);
      
      let notifs = [];
      if (response?.notifications) {
        notifs = response.notifications;
      } else if (response?.data?.notifications) {
        notifs = response.data.notifications;
      } else if (Array.isArray(response)) {
        notifs = response;
      }
      
      const formattedNotifs: Notification[] = notifs.map((n: any) => ({
        id: n.id,
        title: n.title || getDefaultTitle(n.type),
        message: n.message || n.content || '',
        time: formatTime(n.createdAt || n.created_at || new Date().toISOString()),
        date: formatDate(n.createdAt || n.created_at || new Date().toISOString()),
        read: n.isRead || n.read || false,
        icon: getIconForType(n.type),
        type: n.type || 'system',
        createdAt: n.createdAt
      }));
      
      setNotifications(formattedNotifs);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'Failed to load notifications');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTitle = (type: string) => {
    switch(type) {
      case 'reservation': return 'Reservation Update';
      case 'surplus': return 'Food Surplus Update';
      default: return 'Notification';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setProcessingId(id);
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      toast.success('Marked as read');
    } catch (err: any) {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark as read');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={loadNotifications}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DonorSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-primary-600 mb-1">
              <FaBell className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-wide">Notifications</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-500 mt-1">View all your notifications and updates</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button 
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                <FaCheck className="text-xs" /> Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <FaBell className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">No notifications</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {filter !== 'all' 
                    ? `No ${filter} notifications found` 
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer ${
                    !notif.read 
                      ? 'border-l-4 border-l-primary-500 bg-primary-50/30' 
                      : 'border border-gray-100'
                  }`}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${getNotificationIconBg(notif.type)}`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notif.title}
                            {!notif.read && (
                              <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{notif.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><FaClock className="text-xs" /> {notif.time}</span>
                            <span>•</span>
                            <span>{notif.date}</span>
                          </div>
                        </div>
                        {!notif.read && processingId === notif.id ? (
                          <FaSpinner className="animate-spin text-primary-500 flex-shrink-0" />
                        ) : !notif.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorNotifications;