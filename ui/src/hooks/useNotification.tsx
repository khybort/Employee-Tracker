import { useState, useEffect } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const WEB_SOCKET_URL = process.env.WEB_SOCKET_URL
      ? process.env.WEB_SOCKET_URL
      : 'ws://localhost:8001/ws/notifications/';
    const ws = new WebSocket(WEB_SOCKET_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, []);

  return notifications;
};

export default useNotifications;
