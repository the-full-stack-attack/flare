import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../../../components/ui/drawer';

import { Button } from '@/components/ui/button';

import TTSButton from '../a11y/TTSButton';

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
      avatar_uri: string;
      User_Event: {
        user_attending: boolean;
      };
    }[];
    Category?: {
      id: number;
      name: string;
    };
    Interests: {
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
  openVenueDetails: () => void;
};

function EventDetails({ event, openVenueDetails }: EventDetailsProps) {
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

  const reverseNormalDrawerButton = 'bg-gradient-to-r from-pink-900 via-gray-900 to-black hover:from-pink-700 hover:via-gray-700 hover:to-black text-white flex items-center';
  
  const scrollbarStyle = `
    [&::-webkit-scrollbar]:[width:15px]
    [&::-webkit-scrollbar-thumb]:bg-gradient-to-br from-pink-900/50 via-gray-900/50 to-black/50 hover:from-pink-900/80 hover:via-gray-900/80 hover:to-black/80
    [&::-webkit-scrollbar-thumb]:rounded-lg
  `;

  const eventDetailsTTS = useMemo(() => {
    let text = `
      Event Title: ${title}
      Event Description: ${description}
      Date: ${dayjs(new Date(start_time)).format('MMMM D, YYYY')}
      Time: ${dayjs(new Date(start_time)).format('h:mm A')} - ${dayjs(new Date(end_time)).format('h:mm A')}
      Category: ${Category ? Category.name : 'None'}
      Interests: ${Interests.length > 0 
        ? Interests?.reduce((acc, curr, i, arr) => {
            acc += `${curr.name}, `;
            if (i === arr.length - 1) {
              return acc.slice(0, acc.length - 2);
            }
            return acc;
          }, '') 
        : 'None'}
      Venue: ${Venue.name}
      Click for more Venue Details.
      Address: ${street_address
        ? `${street_address}, ${city_name}, ${state_name} ${zip_code}`
        : event.address}
    `;
    return text;
  }, [event])

  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl flex items-center justify-center">
          {title}
          <TTSButton
            text={eventDetailsTTS}
            className="ml-2 pb-1"
            iconClassName="text-lg text-black hover:text-gray-700"
          />
        </DrawerTitle>
        <DrawerDescription className="text-gray-700 text-md text-center">
          {description}
        </DrawerDescription>
      </DrawerHeader>
      <div className={'p-4 pb-0 max-h-[300px] overflow-y-scroll ' + scrollbarStyle}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <b>Date:</b>
            <p>{dayjs(new Date(start_time)).format('MMMM D, YYYY')}</p>
          </div>
          <div>
            <b>Time:</b>
            <p>{`${dayjs(new Date(start_time)).format('h:mm A')} - ${dayjs(new Date(end_time)).format('h:mm A')}`}</p>
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
            <Button 
              className={reverseNormalDrawerButton}
              onClick={openVenueDetails}
            >
              Venue Details
            </Button>
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
                const { username, full_name, User_Event, avatar_uri } = user;
                return User_Event.user_attending ? (
                  <div
                    key={Math.random().toString(36).slice(0, 7)}
                    className="inline"
                  >
                    {/* <img
                      className="h-5 w-5 object-contain"
                      src={avatar_uri}
                    /> */}
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
