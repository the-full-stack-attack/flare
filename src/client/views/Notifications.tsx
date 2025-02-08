import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Toaster, toast } from 'sonner';

import { Button } from '../../components/ui/button';

import { UserContext } from '../contexts/UserContext';

import { BackgroundGlow } from '@/components/ui/background-glow';

import TTSButton from '../components/a11y/TTSButton';
import NotificationList from '../components/notifications-view/NotificationList';
import HeadlessDialog from '../components/general/HeadlessDialog';

function Notifications() {
  const { getUser } = useContext(UserContext);

  const [notifs, setNotifs] = useState<any>([]);
  const [deleteAllNotifsDialogOpen, setDeleteAllNotifsDialogOpen] = useState<boolean>(false);

  const [newNotifsText, setNewNotifsText] = useState<string>('You currently have no new notifications.')

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-4 py-4 rounded-xl text-md';

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
      .then(() => {
        toast('All notifications have been deleted.')
      })
      .catch((err: unknown) => {
        console.error('Failed to deleteAllNotifications:', err);
      });
  };

  const createNewNotifsText = () => {
    // Get new notifications
    const newNotifs = notifs.filter((notif: { User_Notification: { seen: boolean } }) => !notif.User_Notification.seen);

    if (newNotifs.length) {
      let text = `You currently have ${newNotifs.length} new notification${newNotifs.length === 1 ? '' : 's'}:`;

      newNotifs.forEach((notif: any, index: number) => {
        text += `Notification number ${index + 1}: Received ${dayjs(notif.send_time).format('h:mm a, MMMM D')}: ${notif.message},`;
      });

      text += 'This is the end of your new notifications.';

      setNewNotifsText(text);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    createNewNotifsText();
    patchNotificationsSeenAll();
  }, [notifs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      <div className="container flex flex-col items-center">
        <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 w-md mb-5">
          <Button className={buttonColor} onClick={() => { setDeleteAllNotifsDialogOpen(true) }}>
            Clear All Notifications
          </Button>
          <HeadlessDialog
            open={deleteAllNotifsDialogOpen}
            close={() => { setDeleteAllNotifsDialogOpen(false) }}
            title="Delete All Notifications"
            description="This will permanently delete all of your notifications. This action cannot be undone."
            action={deleteAllNotifications}
            actionButtonName="Delete All Notifications"
            type="bad"
          />
          <TTSButton
            buttonType="Button"
            className={buttonColor}
            text={newNotifsText}
            buttonName="Read New Notifications"
          />
        </div>
        <NotificationList notifs={notifs} getNotifications={getNotifications} />
        {notifs.length === 0 ? (
          <p className="text-white text-lg">You currently have no notifications...</p>
        ) : null}
      </div>
      <Toaster
        toastOptions={{
          className: 'isolate rounded-xl backdrop-blur-sm bg-gray-800/50 shadow-lg ring-1 ring-black/5 border-transparent text-white'
        }}
        position="top-center"
      />
    </div>
  );
}

export default Notifications;
