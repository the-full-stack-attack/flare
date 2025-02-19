import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import { LuSquareX, LuX } from "react-icons/lu";

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
      className={`isolate rounded-xl bg-white/10 shadow-lg ring-1 ring-black/5 ml-4 mr-4 mb-4 ${notif.User_Notification.seen ? 'border-transparent' : ' bg-sky-300/30'}`}
    >
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-11 text-gray-200">{notif.message}</div>
            <div className="relative">
              <button className="text-gray-200 hover:text-gray-400 text-lg absolute -right-2 -top-2" onClick={deleteNotification}>{<LuSquareX />}</button>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          {dayjs(notif.send_time).format('h:mm a, MMM. D')}
          <TTSButton
            className="pl-2"
            iconClassName="text-orange-500 hover:text-orange-700 text-lg"
            text={`Received ${dayjs(notif.send_time).format('h:mm a, MMMM D')}: ${notif.message}`}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default Notification;
