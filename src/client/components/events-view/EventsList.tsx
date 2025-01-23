import React from 'react';

import Event from './Event';

type EventsListProps = {
  events: {
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
  }[];
  getEvents: () => void;
};

function EventsList({ events, getEvents }: EventsListProps) {
  return (
    <ul className="container content-center">
      {events.map((event) => (
        <Event key={event.id} event={event} getEvents={getEvents} />
      ))}
    </ul>
  );
}

export default EventsList;
