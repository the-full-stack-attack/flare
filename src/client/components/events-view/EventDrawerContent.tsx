import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/ui/button';

import {
  DrawerFooter,
  DrawerClose,
} from '../../../components/ui/drawer';

import { Dialog, DialogTrigger } from '../../../components/ui/dialog';

import EventDetails from './EventDetails';
import VenueDetails from './VenueDetails';

import ScheduleTextDialog from './ScheduleTextDialog';

type EventDrawerContentProps = {
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
  postAttendEvent: () => void;
  patchAttendingEvent: (isAttending: boolean) => void;
  category: string;
};

function EventDrawerContent({
  event,
  category,
  postAttendEvent,
  patchAttendingEvent,
}: EventDrawerContentProps) {
  const [showVenueDetails, setShowVenueDetails] = useState<boolean>(false);

  const { start_time, end_time, Venue, Category, id } = event;

  const normalDrawerButton = 'bg-gradient-to-r from-black via-gray-900 to-pink-900 hover:from-black hover:via-gray-700 hover:to-pink-700 text-white';

  const warnDrawerButton = 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-800 hover:to-orange-800 text-white';

  const successDrawerButton = 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-800 hover:to-lime-800 text-white'

  const openVenueDetails = () => {
    setShowVenueDetails(true);
  };

  const closeVenueDetails = () => {
    setShowVenueDetails(false);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      {
        showVenueDetails
          ? <VenueDetails venue={Venue} closeVenueDetails={closeVenueDetails} />
          : <EventDetails event={event} openVenueDetails={openVenueDetails} />
      }
      <DrawerFooter>
        {category === 'upcoming' ? (
          <Button className={successDrawerButton} onClick={postAttendEvent}>Attend</Button>
        ) : null}
        {category === 'attending' ? (
          <div className="grid grid-cols-2 gap-2">
            <Button className={normalDrawerButton}>
              <Link state={ Category?.name , start_time} style={{ flex: 1 }} to={`/chatroom/${id}`}>
                Enter Chatroom
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className={successDrawerButton}>Schedule Text</Button>
              </DialogTrigger>
              <ScheduleTextDialog
                eventId={event.id}
                startTime={start_time}
                endTime={end_time}
                eventTitle={event.title}
              />
            </Dialog>
          </div>
        ) : null}
        {category === 'attending' ? (
          <Button className={warnDrawerButton} onClick={() => {
            patchAttendingEvent(false);
          }}>Bail</Button>
        ) : null}
        {category === 'bailed' ? (
          <Button className={successDrawerButton} onClick={() => {
            patchAttendingEvent(true);
          }}>Re-attend</Button>
        ) : null}
        <DrawerClose asChild>
          <Button className={normalDrawerButton}>Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}

export default EventDrawerContent;
