import React from 'react';

import Notification from './Notification';

type NotificationListProps = {
  notifs: {
    id: number;
    message: string;
    send_time: Date;
    User_Notification: {
      seen: boolean;
    };
  }[];
  getNotifications: () => void;
};

type Notification = {
  id: number;
  message: string;
  send_time: Date;
  User_Notification: {
    seen: boolean;
  };
};

function NotificationList({ notifs, getNotifications }: NotificationListProps) {
  return (
    <>
      {notifs.map((notif: Notification) => (
        <div key={notif.id} className="sm:w-screen md:w-2/3 lg:w-2/3">
          <Notification notif={notif} getNotifications={getNotifications} />
        </div>
      ))}
    </>
  );
}

export default NotificationList;
