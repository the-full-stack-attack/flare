import React, { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import { Button } from '../../../components/ui/button';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../../components/ui/card';

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
} from '../../../components/ui/drawer';

import { UserContext } from '../../contexts/UserContext';

import EventDrawerContent from './EventDrawerContent';

type EventProps = {
  event: {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    address: string;
    description: string;
    venue_id: number;
    created_by: number;
    chatroom_id: number;
    createdAt: Date;
    updatedAt: Date;
    hour_before_notif: number;
    User_Event?: {
      user_attending: boolean;
    };
    Users?: {
      id: number;
      username: string;
      full_name: string;
      User_Event: {
        user_attending: boolean;
      };
    }[];
    Category?: {
      id: number;
      name: string;
    };
    Interests?: {
      id: number;
      name: string;
    }[];
    Venue: {
      id: number;
      name: string;
      description: string | null;
      street_address: string | null;
      city_name: string | null;
      state_name: string | null;
      zip_code: number | null;
      category: string | null;
      phone: string | null;
      popularTime: Date | null;
      pricing: string | null;
      serves_alcohol: boolean | null;
      website: string | null;
      wheelchair_accessible: boolean | null;
      Venue_Tags: {
        count: number;
        tag: string;
      }[];
      Venue_Images: {
        path: string;
      }[];
    };
  };
  getEvents: () => void;
};

function Event({ event, getEvents }: EventProps) {
  const { user } = useContext(UserContext);

  const [venuePicIndex, setVenuePicIndex] = useState<number>(0);

  const { title, start_time, end_time, Users, Venue } = event;

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-2 py-2 rounded-xl text-sm';

  const category = useMemo((): string => {
    const isAttending = Users?.reduce((acc, curr) => {
      if (curr.id === user.id && curr.User_Event.user_attending) {
        acc = true;
      }
      return acc;
    }, false);

    if (isAttending) {
      return 'attending';
    }

    const hasBailed = Users?.reduce((acc, curr) => {
      if (curr.id === user.id && !curr.User_Event.user_attending) {
        acc = true;
      }
      return acc;
    }, false);

    if (hasBailed) {
      return 'bailed';
    }

    return 'upcoming';
  }, [Users, user.id]);

  const venuePics: string[] = useMemo(() => (
    Venue?.Venue_Images.map((image) => image.path)
  ), [Venue]);

  const postAttendEvent = () => {
    axios
      .post(`/api/event/attend/${event.id}`, {
        event: {
          notificationId: event.hour_before_notif,
        },
      })
      .then(getEvents)
      .then(() => {
        toast(`You are now attending the event ${title}.`)
      })
      .catch((err: unknown) => {
        console.error('Failed to postAttendEvent:', err);
      });
  };

  const patchAttendingEvent = (isAttending: boolean) => {
    axios
      .patch(`/api/event/attending/${event.id}`, {
        event: {
          notificationId: event.hour_before_notif,
        },
      })
      .then(getEvents)
      .then(() => {
        isAttending ? toast(`You've just re-attended.`) : toast(`You've just bailed.`);
      })
      .catch((err: unknown) => {
        console.error('Failed to patchAttendingEvent', err);
      });
  };

  const handleVenuePicChange = () => {
    const nextPicIndex = venuePicIndex + 1;

    if (nextPicIndex === venuePics.length) {
      setVenuePicIndex(0);
    } else {
      setVenuePicIndex(nextPicIndex);
    }
  };

  return (
    <div key={event.id} className="p-[10px]">
      <Card className="isolate rounded-xl bg-white/10 shadow-lg ring-1 ring-black/5 border-transparent">
        <CardHeader>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-200">{`${dayjs(start_time).format('MMMM D [--] h:mm A')} - ${dayjs(end_time).format('h:mm A')}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 place-content-center">
            <div>
              <img
                className="h-30 w-30 object-contain cursor-pointer"
                src={venuePics[venuePicIndex]}
                onClick={handleVenuePicChange}
              />
            </div>
            <div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className={buttonColor}>Details / RSVP</Button>
                </DrawerTrigger>
                <DrawerContent className="mx-auto w-full max-w-md bg-gradient-to-br from-orange-800/60 via-yellow-700/70 to-red-600/70 isolate border-transparent">
                  <EventDrawerContent
                    event={event}
                    category={category}
                    postAttendEvent={postAttendEvent}
                    patchAttendingEvent={patchAttendingEvent}
                  />
                </DrawerContent>
              </Drawer>
              <div className="p-2">
                <p className="text-gray-100">
                  {user.id === event.created_by ? <b>Host</b> : null}
                </p>
              </div>
              
              {category === 'attending' ? (
                <div className="p-2">
                  <p className="text-gray-300">
                    <i>Attending</i>
                  </p>
                </div>
              ) : null}
              {category === 'bailed' ? (
                <div className="p-2">
                  <p className="text-gray-300">
                    <i>Bailed</i>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Event;
