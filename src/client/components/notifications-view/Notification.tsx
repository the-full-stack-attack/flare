import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

import TTSButton from '../a11y/TTSButton';

type NotificationProps = {
  notif: {
    id: number;
    message: string;
    send_time: Date;
    User_Notification: {
      seen: boolean;
    };
  };
  getNotifications: () => void;
};

function Notification({ notif, getNotifications }: NotificationProps) {
  const deleteNotification = () => {
    axios
      .delete(`/api/notifications/${notif.id}/delete`)
      .then(getNotifications)
      .catch((err: unknown) => {
        console.error('Failed to deleteNotification:', err);
      });
  };

  return (
    <Card
      className={`ml-4 mr-4 mb-4 ${notif.User_Notification.seen ? '' : ' bg-cyan-100'}`}
    >
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-11">{notif.message}</div>
            <button onClick={deleteNotification}>x</button>
          </div>
        </CardTitle>
        <CardDescription>
          {dayjs(notif.send_time).format('h:mm a, MMM. D')}
          <TTSButton
            className="pl-2"
            iconClassName="text-blue-500"
            text={`Received ${dayjs(notif.send_time).format('h:mm a, MMMM D')}, ${notif.message}`}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default Notification;
