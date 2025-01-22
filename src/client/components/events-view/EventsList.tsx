import React from 'react';

interface EventsListProps {
  events: {
    id: number;
    title: string;
  }[];
}

function EventsList({ events }: EventsListProps) {
  return (
    <ul className="container content-center">
      {events.map((event) => (
        <li key={event.id} className="text-lg text-center">
          <p className="text-lg text-center">{event.title}</p>
          <button type="button" className="border-black">
            Attend
          </button>
        </li>
      ))}
    </ul>
  );
}

export default EventsList;
