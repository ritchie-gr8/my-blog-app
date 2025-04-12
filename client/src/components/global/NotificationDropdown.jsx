import { useNotifications } from '@/hooks/useNotification';
import React, { useEffect } from 'react';
import NotificationItem from './NotificationItem';

const NotificationDropdown = () => {
  const { notifications, loading, markAllAsRead, refreshNotifications } = useNotifications();

  // Refresh notifications when dropdown opens
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);
  
  return (
    <div className="absolute right-0 top-10 mt-2 w-80 bg-brown-100 rounded-md shadow-xl z-50">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            className="text-sm text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications?.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;