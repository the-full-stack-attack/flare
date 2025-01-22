import React from 'react';

import { Button } from '../../../components/ui/button';
import { Card,
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
};

function Event({ event }: EventProps) {
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
          <Button className="">Attend</Button>
        </CardFooter>
      </Card>
    </li>
  );
}

export default Event;
