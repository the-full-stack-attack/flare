import React from 'react';

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
      <p className="text-lg text-center">{event.title}</p>
      <button type="button" className="border-black">
        Attend
      </button>
    </li>
  );
}

export default Event;
