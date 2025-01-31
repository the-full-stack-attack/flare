import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { UserContext } from '../contexts/UserContext';

import NotificationList from '../components/notifications-view/NotificationList';

function Notifications() {
  const { getUser } = useContext(UserContext);

  const [notifs, setNotifs] = useState<any>([]);

  const getNotifications = useCallback(() => {
    axios
      .get('/api/notifications')
      .then(({ data }) => {
        setNotifs(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to getNotifications:', err);
      });
  }, []);

  const patchNotificationsSeenAll = useCallback(() => {
    axios
      .patch('/api/notifications/seen/all', { notifications: notifs })
      .then(getUser)
      .catch((err: unknown) => {
        console.error('Failed to patchNotificationsSeenAll', err);
      });
  }, [getUser, notifs]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    patchNotificationsSeenAll();
  }, [notifs]);

  return (
    <div className="container pt-20 pb-8">
      <NotificationList notifs={notifs} />
    </div>
  );
}

export default Notifications;
