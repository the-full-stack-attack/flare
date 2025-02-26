import React from 'react';

import Event from './Event';

import { EventData } from '@/types/Events';

type EventsListProps = {
  events: EventData[];
  getEvents: () => void;
};

function EventsList({ events, getEvents }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="lg:col-span-3 md:col-span-2 sm:col-span-1">
        <p className="text-center text-white text-xl italic">No events available...</p>
      </div>
    );
  }

  else {
    return (
      <>
        {events.map((event) => (
          <Event key={event.id} event={event} getEvents={getEvents} />
        ))}
      </>
    );
  }
}

export default EventsList;
