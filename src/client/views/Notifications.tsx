import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { UserContext } from '../contexts/UserContext';

import NotificationList from '../components/notifications-view/NotificationList';

function Notifications() {
  const { user } = useContext(UserContext);

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

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <div className="container pt-20 pb-8">
      <NotificationList notifs={notifs} />
    </div>
  );
}

export default Notifications;
