import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNotifications } from '@/hooks/useNotification';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();
  
  const handleClick = () => {
    markAsRead(notification.id);
    
    if (notification.type === 'like') {
      navigate(`/posts/${notification.related_id}`);
    } else if (notification.type === 'comment') {
      navigate(`/posts/${notification.related_id}#comments`);
    }
  };
  
  return (
    <div 
      className={`p-3 hover:bg-brown-50 cursor-pointer flex items-center gap-3 ${
        !notification.is_read ? 'bg-brown-50' : ''
      }`}
      onClick={handleClick}
    >
      <Avatar className="size-10">
        <AvatarImage src={notification.actor?.profile_picture} />
        <AvatarFallback className="bg-brown-400 text-white">
          {notification.actor?.name?.[0] || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{notification.message}</p>
          {notification.type === 'like' && <Heart size={14} className="text-red-500" />}
          {notification.type === 'comment' && <MessageSquare size={14} className="text-blue-500" />}
        </div>
        
        {/* <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p> */}
      </div>
      
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
};

export default NotificationItem;