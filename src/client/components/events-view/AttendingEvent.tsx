import React from 'react';
import axios from 'axios';

import { Button } from '../../../components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../../components/ui/card';

type AttendingEventProps = {
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
    User_Event: {
      user_attending: boolean;
    };
  };
  getEvents: () => void;
};

function AttendingEvent({ event, getEvents }: AttendingEventProps) {
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
        </CardHeader>
        <CardContent>
          <div>
            <p className="italic">{event.description}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button className="" onClick={postAttendEvent}>
            Bail
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}

export default AttendingEvent;
