import React, { useState, useEffect } from 'react';
import API from '../services/api';

const NotificationsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await API.get('/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: number) => {
    try {
      await API.post(`/notifications/${id}/mark-as-read/`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <>
      <button
        onClick={togglePanel}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Notifications
      </button>

      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button
            onClick={togglePanel}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          {loading ? (
            <p className="text-gray-600">Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded ${
                  notification.is_read
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <p>{notification.message}</p>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-sm text-blue-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No notifications available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
