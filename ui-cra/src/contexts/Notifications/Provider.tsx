import React, { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { NotificationDialog } from "../../components/Layout/Notification";
import { Notification, NotificationData } from "./index";

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[] | []>(
    []
  );
  const history = useHistory();

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    return history.listen(clear);
  }, [clear, history, notifications.length]);

  return (
    <Notification.Provider value={{ notifications, setNotifications, clear }}>
      {notifications.length !== 0 && <NotificationDialog />}
      {children}
    </Notification.Provider>
  );
};

export default NotificationProvider;
