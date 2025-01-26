import React from 'react';
import dayjs from 'dayjs';

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
      id: number;
      username: string;
      full_name: string;
      User_Event: {
        user_attending: boolean;
      };
    }[];
    Category?: {
      id: number;
      name: string;
    };
    Interests?: {
      id: number;
      name: string;
    }[];
    Venue?: {
      id: number;
      name: string;
      description: string;
      street_address: string;
      city_name: string;
      state_name: string;
      zip_code: number;
    };
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
  const {
    title,
    start_time,
    end_time,
    description,
    Users,
    Venue,
    Category,
    Interests,
  } = event;

  const { street_address, city_name, state_name, zip_code } = Venue;

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
          <div>
            <b>Category:</b>
            <p>{Category ? Category.name : ''}</p>
          </div>
          <div>
            <b>Interests:</b>
            <p>{Interests?.reduce((acc, curr, i, arr) => {
              acc += `${curr.name}, `;
              if (i === arr.length - 1) {
                return acc.slice(0, acc.length - 2);
              }
              return acc;
            }, '')}</p>
          </div>
          <div>
            <b>Venue:</b>
            <p>{Venue?.name}</p>
          </div>
          <div>
            <b>Description:</b>
            <p>{Venue?.description}</p>
          </div>
          <div className="col-span-2">
            <b>Address:</b>
            <p>
              {street_address
                ? `${street_address}, ${city_name}, ${state_name} ${zip_code}`
                : event.address}
            </p>
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
        {category === 'attending' ? <Button>Enter Chatroom</Button> : null}
        <DrawerClose asChild>
          <Button>Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}

export default EventDetails;
