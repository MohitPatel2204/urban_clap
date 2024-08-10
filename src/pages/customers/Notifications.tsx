// NotificationComponent.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const reduxdata = useSelector(
    (state: { user: { text: { notification: [] } } }) =>
      state.user?.text?.notification
  );
  useEffect(() => {
    setNotifications(reduxdata);
  }, [notifications]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications?.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
