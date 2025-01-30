import React from 'react';
import dayjs from 'dayjs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

type NotificationProps = {
  notif: {
    id: number;
    message: string;
    send_time: Date;
    User_Notification: {
      seen: boolean;
    };
  };
};

function Notification({ notif }: NotificationProps) {
  return (
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
  );
}

export default Notification;
