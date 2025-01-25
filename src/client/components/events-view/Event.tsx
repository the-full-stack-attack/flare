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
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Open</Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto w-full max-w-md">
                <EventDetails
                  event={event}
                  getEvents={getEvents}
                  category={category}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 grid grid-cols-subgrid gap-4">
              <div className="col-start-1">
                {user.id === event.created_by ? <b>Host</b> : null}
              </div>
            </div>
            <div>
              {category === 'upcoming' ? (
                <Button onClick={postAttendEvent}>Attend</Button>
              ) : null}
              {category === 'attending' ? (
                <Button onClick={patchAttendingEvent}>Bail</Button>
              ) : null}
              {category === 'bailed' ? (
                <Button onClick={patchAttendingEvent}>Re-attend</Button>
              ) : null}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Event;
