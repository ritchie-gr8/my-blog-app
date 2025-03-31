import React from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotification";
import NotificationDropdown from "./NotificationDropdown";
import useDropdown from "@/hooks/useDropdown";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const { isOpen, dropdownRef, toggleDropdown } = useDropdown();

  return (
    <div
      className="relative bg-white rounded-full text-brown-400"
      ref={dropdownRef}
      onClick={toggleDropdown}
    >
      <button
        className="p-2 rounded-full relative cursor-pointer group"
      >
        <Bell size={20} className="group-hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
