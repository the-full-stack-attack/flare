import React, { useContext, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { TbHexagonLetterHFilled, TbCircleLetterAFilled, TbCircleDashedLetterB } from "react-icons/tb";

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
    Interests: {
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

  const handleVenuePicChange = (dir: 'left' | 'right') => {
    if (dir === 'left') {
      const nextPicIndex = venuePicIndex - 1;
      nextPicIndex < 0 ? setVenuePicIndex(venuePics.length - 1) : setVenuePicIndex(nextPicIndex);
    }
    
    else {
      const nextPicIndex = venuePicIndex + 1;
      nextPicIndex === venuePics.length ? setVenuePicIndex(0) : setVenuePicIndex(nextPicIndex);
    }
  };

  return (
    <div key={event.id} className="p-[10px]">
      <Card className="isolate rounded-xl bg-white/10 shadow-lg ring-1 ring-black/5 border-transparent">
        <CardHeader>
          <CardTitle className="text-xl text-white truncate flex items-center justify-center">
            <span>{` ${title} `}</span>
          </CardTitle>
          <CardDescription className="text-sm text-gray-200 text-center">{`${dayjs(new Date(start_time)).format('MMMM D')}`}</CardDescription>
          <CardDescription className="text-sm text-gray-200 text-center">{`${dayjs(new Date(start_time)).format('h:mm A')} - ${dayjs(new Date(end_time)).format('h:mm A')}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid flex justify-center">
            <div className="grid grid-cols-4 gap-2 mb-2 flex items-center justify-center">
              <div className="flex justify-center">
                {user.id === event.created_by ? <TbHexagonLetterHFilled className="text-yellow-400 text-2xl" /> : null}
              </div>
              <div className="col-span-2 flex justify-center">
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
              </div>
              <div className="flex justify-center">
                {category === 'attending' ? <TbCircleLetterAFilled className="text-amber-500 text-2xl" /> : null}
                {category === 'bailed' ? <TbCircleDashedLetterB className="text-red-500 text-2xl" /> : null}
              </div>
            </div>
            <div className="grid grid-cols-6 place-content-center">
              <div className="col-span-6 mb-2">
                <img
                  className="h-[215px] w-[215px] object-fit cursor-pointer"
                  src={venuePics[venuePicIndex]}
                  onClick={() => { handleVenuePicChange('right'); }}
                />
              </div>
              <div className="col-span-6 grid grid-cols-subgrid">
                <button
                  className="col-start-2 justify-center"
                  onClick={() => { handleVenuePicChange('left'); }}
                >
                  <FaAngleLeft className="text-gray-200 hover:text-orange-400" />
                </button>
                <button
                  className="col-start-5 justify-center"
                  onClick={() => { handleVenuePicChange('right'); }}
                >
                  <FaAngleRight className="text-gray-200 hover:text-orange-400" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Event;
