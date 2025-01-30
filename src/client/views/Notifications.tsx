import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import { UserContext } from '../contexts/UserContext';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';

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

  console.log(notifs);

  return (
    <div className="container pt-20 pb-8">
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
    </div>
  );
}

export default Notifications;
