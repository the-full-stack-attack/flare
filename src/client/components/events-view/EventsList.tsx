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
    hour_before_notif: number;
    User_Event?: {
      user_attending: boolean;
    };
    Venue?: {
      id: number;
      name: string;
      description: string;
      street_address: string;
      city_name: string;
      state_name: string;
      zip_code: number;
    };
  }[];
  getEvents: () => void;
  locationFilter: {
    city: string;
    state: string;
  };
  category: string;
};

function EventsList({
  events,
  getEvents,
  locationFilter,
  category,
}: EventsListProps) {
  return (
    <>
      {events.map((event) => (
        <Event
          key={event.id}
          event={event}
          getEvents={getEvents}
          category={category}
        />
      ))}
    </>
  );
}

export default EventsList;
