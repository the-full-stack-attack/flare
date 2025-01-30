import React from 'react';
import dayjs from 'dayjs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

type NotificationListProps = {
  notifs: {
    id: number;
    message: string;
    send_time: Date;
    User_Notification: {
      seed: boolean;
    };
  }[];
};

function NotificationList({ notifs }: NotificationListProps) {
  return (
    <>
      {notifs.map((notif: any) => (
        <div key={notif.id}>
          <Card
            className={`ml-4 mr-4 mb-4 ${notif.User_Notification.seen ? '' : ' bg-cyan-100'}`}
          >
            <CardHeader>
              <CardTitle>{notif.message}</CardTitle>
              <CardDescription>
                {dayjs(notif.send_time).format('h:mm a, MMM. D')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </>
  );
}

export default NotificationList;
