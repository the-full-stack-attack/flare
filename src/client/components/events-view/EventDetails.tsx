import React, { useState } from 'react';
import dayjs from 'dayjs';

import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../../../components/ui/drawer';

import { Button } from '@/components/ui/button';

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
  };
};

function EventDetails({ event }: EventDetailsProps) {
  const {
    title,
    start_time,
    end_time,
    description,
    Users,
    Venue,
    Category,
    Interests,
    id,
  } = event;

  const { street_address, city_name, state_name, zip_code } = Venue;

  const normalDrawerButton = 'bg-gradient-to-r from-black via-gray-900 to-pink-900 hover:from-black hover:via-gray-700 hover:to-pink-700 text-white';

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">{title}</DrawerTitle>
        <DrawerDescription className="text-gray-700 text-md">{description}</DrawerDescription>
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
            <p>{Category ? Category.name : 'None'}</p>
          </div>
          <div>
            <b>Interests:</b>
            <p>
              {Interests.length > 0 
                ? Interests?.reduce((acc, curr, i, arr) => {
                    acc += `${curr.name}, `;
                    if (i === arr.length - 1) {
                      return acc.slice(0, acc.length - 2);
                    }
                    return acc;
                  }, '') 
                : 'None'}
            </p>
          </div>
          <div>
            <b>Venue:</b>
            <p>{Venue?.name}</p>
          </div>
          <div>
            <Button className={normalDrawerButton}>Venue Details</Button>
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
    </>
  );
}

export default EventDetails;
