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
  }[];
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
