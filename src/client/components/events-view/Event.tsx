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
  };
  getEvents: () => void;
};

function Event({ event, getEvents }: EventProps) {
  const postAttendEvent = () => {
    axios
      .post(`/api/event/attend/${event.id}`)
      .then(getEvents)
      .catch((err: unknown) => {
        console.error('Failed to postAttendEvent:', err);
      });
  };

  return (
    <li key={event.id} className="text-lg text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">{event.title}</CardTitle>
          <CardDescription>{`${dayjs(event.start_time).format('MMMM D [--] h:mm A')} - ${dayjs(event.end_time).format('h:mm A')}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="italic">{event.description}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button className="" onClick={postAttendEvent}>
            Attend
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

export default Event;
