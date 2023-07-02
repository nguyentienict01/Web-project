import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      const response = await axios.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thông báo:", error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "HH:mm:ss dd/MM/yyyy");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mt-10">Notifications</h1>
      <div className="flex mt-5 flex-col gap-5">
        {notifications?.length ? (
          notifications?.map((notification, index) => (
            <div className="w-full flex" key={notification?._id || index}>
              <div className="flex items-center justify-between w-full bg-gray-100 px-4 py-2 rounded-md mb-6">
                <div className="flex-col items-center ">
                  <div className="font-medium">Name: {notification.userAct}</div>
                  <div className="font-medium text-blue-500">Place: {notification.place}</div>
                  <div className="font-medium text-red-500">Content: {notification.content}</div>
                </div>
                <div className="text-gray-500">{formatDate(notification.date)}</div>
              </div>
            </div>
          ))
        ) : (
          <span className="text-md">You have no new notifications</span>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
