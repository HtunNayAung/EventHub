import { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { notificationService } from '../services/api';

export default function NotificationTab({ userId, setUnreadCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await notificationService.getNotis(userId);
        const sorted = res.data.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
        setNotifications(sorted);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchInitial();
      

    // WebSocket setup
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          const noti = JSON.parse(message.body);
          setNotifications((prev) => [noti, ...prev]);
        });
      },
      debug: (str) => console.debug(str),
    });

    client.activate();

    return () => client.deactivate();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
        const newUnreadCount = updated.filter(n => !n.read).length;
        setUnreadCount(newUnreadCount);
        return updated;
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (!notifications.length) {
    return (
      <div className="text-center py-10">
        <Bell className="mx-auto mb-4 text-[#27548A]" size={48} />
        <p className="text-gray-600 text-lg">You have no new notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded-lg shadow border relative ${
            n.read ? 'bg-white' : 'bg-blue-50 border-blue-300'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" />
                <h4 className="font-semibold text-[#183B4E]">{n.title}</h4>
              </div>
              <p className="mt-2 text-sm text-gray-700">{n.message}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {new Date(n.sentAt).toLocaleString()}
              </span>
            </div>

            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="ml-4 mt-1 text-sm text-blue-600 hover:underline"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
