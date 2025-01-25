import React, { useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import { Button } from '../../../components/ui/button';

import {
  Card,
  CardHeader,
  CardFooter,
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

import EventDetails from './EventDetails';

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
    User_Event?: {
      user_attending: boolean;
    };
  };
  getEvents: () => void;
  category: string;
};

function Event({ event, getEvents, category }: EventProps) {
  const { user } = useContext(UserContext);

  const postAttendEvent = () => {
    axios
      .post(`/api/event/attend/${event.id}`)
      .then(getEvents)
      .catch((err: unknown) => {
        console.error('Failed to postAttendEvent:', err);
      });
  };

  const patchAttendingEvent = () => {
    axios
      .patch(`/api/event/attending/${event.id}`)
      .then(getEvents)
      .catch((err: unknown) => {
        console.error('Failed to patchAttendingEvent', err);
      });
  };

  return (
    <div key={event.id} className="text-lg text-center p-[10px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">{event.title}</CardTitle>
          <CardDescription>{`${dayjs(event.start_time).format('MMMM D [--] h:mm A')} - ${dayjs(event.end_time).format('h:mm A')}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 place-content-center">
            <div>
              <img
                className="h-30 w-30 object-contain"
                src="https://itseverythingdelicious.com/wp-content/uploads/2018/08/Cafe-Du-Monde-man-singing-outside-768x768.jpg"
                alt="Cafe Du Monde"
              />
            </div>
            <div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button>Details / RSVP</Button>
                </DrawerTrigger>
                <DrawerContent className="mx-auto w-full max-w-md">
                  <EventDetails
                    event={event}
                    category={category}
                    postAttendEvent={postAttendEvent}
                    patchAttendingEvent={patchAttendingEvent}
                  />
                </DrawerContent>
              </Drawer>
              <div className="p-2">
                {user.id === event.created_by ? <b>Host</b> : <b> </b>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Event;
