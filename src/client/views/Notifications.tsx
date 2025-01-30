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

  const [newNotifs, setNewNotifs] = useState<any>([]);
  const [oldNotifs, setOldNotifs] = useState<any>([]);

  const getOldNotifications = useCallback(() => {
    axios
      .get('/api/notifications', {
        params: {
          seen: true,
        },
      })
      .then(({ data }) => {
        setOldNotifs(data);
      })
      .catch((err: unknown) => {
        console.error('Failed to getNotifications:', err);
      });
  }, []);

  const getNotifications = useCallback(() => {
    axios
      .get('/api/notifications', {
        params: {
          seen: false,
        },
      })
      .then(({ data }) => {
        setNewNotifs(data);
      })
      .then(getOldNotifications)
      .catch((err: unknown) => {
        console.error('Failed to getNotifications:', err);
      });
  }, [getOldNotifications]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <div className="container ml-5 px-4 pt-20 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2">
        <div>
          <h1 className="text-4xl">New</h1>
          {newNotifs.map((notif: any) => (
            <div key={notif.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{notif.message}</CardTitle>
                  <CardDescription>
                    {dayjs(notif.send_date).format('h:mm a, MMM. D')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-4xl">Old</h1>
          {oldNotifs.map((notif: any) => (
            <div>{notif.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
