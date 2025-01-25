import React from 'react';
import dayjs from 'dayjs';
import { Link } from "react-router-dom";

import { Button } from '../../../components/ui/button';

import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '../../../components/ui/drawer';

type EventDetailsProps = {
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
    User_Event?: {
      user_attending: boolean;
    };
    Users?: {
      username: string;
      full_name: string;
      User_Event: {
        user_attending: boolean;
      };
    }[];
  };
  postAttendEvent: () => void;
  patchAttendingEvent: () => void;
  category: string;
};

function EventDetails({
  event,
  category,
  postAttendEvent,
  patchAttendingEvent,
}: EventDetailsProps) {
  const { title, start_time, end_time, address, description, Users, id } = event;

  return (
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <b>Date:</b>
            <p>{dayjs(start_time).format('MMMM D, YYYY')}</p>
          </div>
          <div>
            <b>Time:</b>
            <p>{`${dayjs(start_time).format('h:mm A')} - ${dayjs(end_time).format('h:mm A')}`}</p>
          </div>
          <div className="col-span-2">
            <b>Address:</b>
            <p>{address}</p>
          </div>
          <div className="col-span-2">
            <b>Who is attending?</b>
            <div className="grid grid-cols-2 gap-4">
              {Users?.map((user) => {
                const { username, full_name, User_Event } = user;
                return User_Event.user_attending ? (
                  <div key={Math.random().toString(36).slice(0, 7)}>
                    {full_name ? `${full_name} (${username})` : username}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
      <DrawerFooter>
        {category === 'upcoming' ? (
          <Button onClick={postAttendEvent}>Attend</Button>
        ) : null}
        {category === 'attending' ? (
          <Button onClick={patchAttendingEvent}>Bail</Button>
        ) : null}
        {category === 'bailed' ? (
          <Button onClick={patchAttendingEvent}>Re-attend</Button>
        ) : null}
        {category === 'attending' ?   <Button><Link style={{flex: 1}} to={`/chatroom/${id}`}>Enter Chatroom</Link></Button> : null}
        <DrawerClose asChild>
          <Button>Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}

export default EventDetails;
