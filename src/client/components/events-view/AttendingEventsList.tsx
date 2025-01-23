import React from 'react';

import AttendingEvent from './AttendingEvent';

type AttendingEventsListProps = {
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
    User_Event: {
      user_attending: boolean;
    };
  }[];
  getEvents: () => void;
};

function AttendingEventsList({ events, getEvents }: AttendingEventsListProps) {
  return (
    <ul className="container content-center">
      {events
        .filter((event) => event.User_Event.user_attending)
        .map((event) => (
          <AttendingEvent key={event.id} event={event} getEvents={getEvents} />
        ))}
    </ul>
  );
}

export default AttendingEventsList;
