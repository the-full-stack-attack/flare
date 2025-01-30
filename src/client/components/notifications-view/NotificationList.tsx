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
};

function NotificationList({ notifs }: NotificationListProps) {
  return (
    <>
      {notifs.map((notif: any) => (
        <div key={notif.id}>
          <Notification notif={notif} />
        </div>
      ))}
    </>
  );
}

export default NotificationList;
