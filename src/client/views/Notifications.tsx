import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { Button } from '../../components/ui/button';

import { UserContext } from '../contexts/UserContext';

import { BackgroundGlow } from '@/components/ui/background-glow';

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

  const deleteAllNotifications = () => {
    axios
      .delete('/api/notifications/all')
      .then(getNotifications)
      .catch((err: unknown) => {
        console.error('Failed to deleteAllNotifications:', err);
      });
  };

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    patchNotificationsSeenAll();
  }, [notifs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      <div className="container flex flex-col items-center">
        <Button className="mb-5" onClick={deleteAllNotifications}>
          Clear All Notifications
        </Button>
        <NotificationList notifs={notifs} getNotifications={getNotifications} />
        {notifs.length === 0 ? (
          <p>You currently have no notifications...</p>
        ) : null}
      </div>
    </div>
  );
}

export default Notifications;
