import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { TbCircleLetterAFilled, TbCircleDashedLetterB } from "react-icons/tb";

import { Button } from '../../../components/ui/button';

import {
  DrawerFooter,
  DrawerClose,
} from '../../../components/ui/drawer';

import { Dialog, DialogTrigger } from '../../../components/ui/dialog';

import EventDetails from './EventDetails';
import VenueDetails from './VenueDetails';

import ScheduleTextDialog from './ScheduleTextDialog';

import { EventData } from '@/types/Events';

type EventDrawerContentProps = {
  event: EventData;
  postAttendEvent: () => void;
  patchAttendingEvent: (isAttending: boolean) => void;
  category: string;
  disableBail?: boolean;
};

function EventDrawerContent({
  event,
  category,
  disableBail,
  postAttendEvent,
  patchAttendingEvent,
}: EventDrawerContentProps) {
  const [showVenueDetails, setShowVenueDetails] = useState<boolean>(false);

  const { start_time, end_time, Venue, Category, id, Venue_Tags } = event;

  const normalDrawerButton = 'bg-gradient-to-r from-black via-gray-900 to-pink-900 hover:from-black hover:via-gray-700 hover:to-pink-700 text-white flex items-center';
  
  const reverseNormalDrawerButton = 'bg-gradient-to-r from-pink-900 via-gray-900 to-black hover:from-pink-700 hover:via-gray-700 hover:to-black text-white flex items-center';
  
  const warnDrawerButton = 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-800 hover:to-orange-800 text-white flex items-center';

  const successDrawerButton = 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-800 text-white flex items-center';

  const middleDrawerButton = 'bg-gradient-to-r from-black via-pink-900 to-black hover:from-black hover:via-pink-700 hover:to-black text-white flex items-center';

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
          ? <VenueDetails venue={Venue} eventVenueTags={Venue_Tags} closeVenueDetails={closeVenueDetails} />
          : <EventDetails event={event} openVenueDetails={openVenueDetails} />
      }
      <DrawerFooter>
        {category === 'upcoming' ? (
          <Button className={successDrawerButton} onClick={postAttendEvent}>Attend {<TbCircleLetterAFilled />}</Button>
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
                <Button className={reverseNormalDrawerButton}>Schedule Text</Button>
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
        {category === 'attending' && (!disableBail) ? (
          <Button className={warnDrawerButton} onClick={() => {
            patchAttendingEvent(false);
          }}>Bail {<TbCircleDashedLetterB />}</Button>
        ) : null}
        {category === 'bailed' ? (
          <Button className={successDrawerButton} onClick={() => {
            patchAttendingEvent(true);
          }}>Re-attend {<TbCircleLetterAFilled />}</Button>
        ) : null}
        <DrawerClose asChild>
          <Button className={middleDrawerButton}>Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}

export default EventDrawerContent;
