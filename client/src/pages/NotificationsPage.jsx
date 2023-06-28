import { useState } from "react";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  return (
    <div>
      <h1 className="text-3xl font-bold mt-10">Notifications</h1>
      <div className="flex mt-5 flex-col gap-5">
        {notifications?.length ? notifications?.map((notification, index) => {
          return (
            <div className="w-full flex" key={notification?._id || index}></div>
          );
        }) : <span className="text-md">
                You have no new notifications
            </span>}
      </div>
    </div>
  );
}

export default NotificationsPage;
