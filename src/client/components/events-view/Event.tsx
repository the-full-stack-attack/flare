import React from 'react';
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
} from './../../../components/ui/drawer';

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
    <li key={event.id} className="text-lg text-center p-[10px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">{event.title}</CardTitle>
          <CardDescription>{`${dayjs(event.start_time).format('MMMM D [--] h:mm A')} - ${dayjs(event.end_time).format('h:mm A')}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Open</Button>
              </DrawerTrigger>
              <DrawerContent>
                <EventDetails />
              </DrawerContent>
            </Drawer>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          {category === 'upcoming' ? (
            <Button className="" onClick={postAttendEvent}>
              Attend
            </Button>
          ) : null}
          {category === 'attending' ? (
            <Button className="" onClick={patchAttendingEvent}>
              Bail
            </Button>
          ) : null}
          {category === 'bailed' ? (
            <Button className="" onClick={patchAttendingEvent}>
              Re-attend
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </li>
  );
}

export default Event;
