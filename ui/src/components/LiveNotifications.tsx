import React, { useEffect, useState } from 'react';
import useNotifications from '../hooks/useNotification';

const Notifications: React.FC = () => {
  const liveNotifications = useNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (liveNotifications.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000); // 5 saniye sonra gizle
      return () => clearTimeout(timer);
    }
  }, [liveNotifications]);

  return (
    <div
      className={`fixed top-0 right-0 m-4 w-96 transition-transform transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } z-50`}
    >
      {liveNotifications.map((message, index) => (
        <div
          key={index}
          className="bg-blue-100 text-blue-800 p-4 rounded shadow mb-2"
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
