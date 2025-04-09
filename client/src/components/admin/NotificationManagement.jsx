import { getAdminNotifications, markAsRead } from "@/api/notification";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { formatDate, decodeNotificationMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import TablePagination from "../custom/TablePagination";

const NotificationManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const LIMIT = 10;

  const handleClick = (notification) => {
    markAsRead(notification.id);

    if (notification.type === "like") {
      navigate(`/posts/${notification.related_id}`);
    } else if (notification.type === "comment") {
      navigate(`/posts/${notification.post_id}#comments`);
    }
  };

  const fetchNotifications = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getAdminNotifications(page, LIMIT);
      setNotifications(response.items);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center border-b border-brown-300 px-16 py-8">
        <h1 className="text-h3 font-semibold text-brown-600">Notification</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center pt-48">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : notifications?.length > 0 ? (
        <div className="px-16">
          <div className="flex flex-col">
            {notifications.map((notification) => {
              const decodedMessage = decodeNotificationMessage(
                notification.message
              );

              return (
                <div
                  key={notification.id}
                  className={`flex justify-between py-10 border-b border-brown-300 ${
                    !notification.is_read ? "bg-brown-50" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarImage src={notification.actor?.profile_picture} />
                        <AvatarFallback>
                          {notification.actor?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {!notification.is_read && (
                        <div className="absolute top-1 -right-1 w-3 h-3 bg-brand-orange rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {decodedMessage ? (
                        <p className="text-b1">
                          <span className="font-semibold text-brown-600">
                            {decodedMessage.actorName}
                          </span>{" "}
                          <span className="text-brown-400">
                            {decodedMessage.action}
                          </span>{" "}
                          <span className="italic text-brown-600">
                            {decodedMessage.title}
                          </span>
                        </p>
                      ) : (
                        <p className="text-b1 text-brown-600">
                          {notification.message}
                        </p>
                      )}
                      {notification.comment_content && (
                        <p className="text-sm text-brown-600 pl-4 border-l-2 border-brown-200">
                          "{notification.comment_content}"
                        </p>
                      )}
                      <p className="text-b2 font-medium text-brand-orange">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => handleClick(notification)}
                    className={`underline cursor-pointer ${
                      !notification.is_read
                        ? "text-brand-orange font-medium"
                        : "text-brown-600"
                    }`}
                  >
                    View
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default NotificationManagement;
