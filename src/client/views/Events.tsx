import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import { FaCalendarPlus } from 'react-icons/fa';

import { UserContext } from '../contexts/UserContext';

import { Toaster } from 'sonner';

import { Button } from '@/components/ui/button';

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';

import { BackgroundGlow } from '@/components/ui/background-glow';

import LocationFilter from '../components/events-view/LocationFilter';
import CategoryFilter from '../components/events-view/CategoryFilter';
import InterestsFilter from '../components/events-view/InterestsFilter';

import EventsList from '../components/events-view/EventsList';

import { EventData } from '@/types/Events';

type Location = {
  city: string;
  state: string;
};

function Events() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [locationFilter, setLocationFilter] = useState<Location>({
    city: '',
    state: '',
  });

  const [catFilter, setCatFilter] = useState<string[]>([]);

  
  const userInterests = useMemo((): string[] => (
    user.Interests.map((interest: { name: string; }) => interest.name)
  ), [user]);

  const [interestsFilter, setInterestsFilter] = useState<string[]>(userInterests);

  // Events the user can attend will be stored in state on page load
  const [events, setEvents] = useState<EventData[]>([]);

  // Events the user can attend will be stored in state on page load
  const [attendingEvents, setAttendingEvents] = useState<EventData[]>([]);

  const [bailedEvents, setBailedEvents] = useState<EventData[]>([]);

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-4 py-4 rounded-xl text-md';

  const getAttendEvents = () => {
    axios
      .get('/api/event/attend/true', {
        params: {
          now: new Date().toISOString(),
        },
      })
      .then(({ data }) => {
        if (data) {
          setAttendingEvents(data);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to getAttendEvents:', err);
      });
  };

  const getBailedEvents = () => {
    axios
      .get('/api/event/attend/false', {
        params: {
          now: new Date().toISOString(),
        },
      })
      .then(({ data }) => {
        if (data) {
          setBailedEvents(data);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to getAttendEvents:', err);
      });
  };

  const getEvents = () => {
    axios
      .get('/api/event', {
        params: {
          locationFilter,
          catFilter,
          interestsFilter: interestsFilter.length > 0 ? interestsFilter : null,
          now: new Date().toISOString(),
        },
      })
      .then(({ data }) => {
        setEvents(data);
      })
      .then(getAttendEvents)
      .then(getBailedEvents)
      .catch((err: unknown) => {
        console.error('Failed to getEvents:', err);
      });
  };

  const handleSetLocationFilter = (loc: Location) => {
    setLocationFilter(loc);
  };

  const handleSetCatFilter = (cats: string[]) => {
    setCatFilter(cats);
  };

  const handleSetInterestsFilter = (ints: string[]) => {
    setInterestsFilter(ints);
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    getEvents();
  }, [locationFilter, catFilter, interestsFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-[40px] sm:pt-[60px] pb-12">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      <div className="container mx-auto px-4 content-center pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-4">
          <div className="container pt-4 px-4 mx-auto">
            <div className="pb-4 flex justify-center sm:justify-start">
              <Button
                className={buttonColor + ' text-white'}
                onClick={() => { navigate('/createevents'); }}
              >
                {<FaCalendarPlus />} Host an Event
              </Button>
            </div>
            <p className="text-gray-200">
              Upcoming Events from
              <b>{` ${locationFilter.city ? locationFilter.city : 'Anywhere'}${locationFilter.state ? `, ${locationFilter.state}` : ''}`}</b>
            </p>
            <div className="inline-flex justify-center content-center sm:grid grid-cols-1 gap-2 pt-2">
              <LocationFilter
                locationFilter={locationFilter}
                handleSetLocationFilter={handleSetLocationFilter}
              />
              <CategoryFilter
                catFilter={catFilter}
                handleSetCatFilter={handleSetCatFilter}
              />
              <InterestsFilter
                interestsFilter={interestsFilter}
                handleSetInterestsFilter={handleSetInterestsFilter}
              />
            </div>
          </div>
          <div className="lg:col-span-5 md:col-span-3">
            <TabGroup
              defaultValue="upcoming"
              className="container mx-auto px-4 content-center pt-4"
            >
              <TabList>
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">{`Upcoming (${events.length})`}</Tab>
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">{`Attending (${attendingEvents.length})`}</Tab>
                <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">{`Bailed (${bailedEvents.length})`}</Tab>
              </TabList>
              <TabPanels className="mt-4">
                <TabPanel
                  className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 rounded-xl bg-white/5 p-3"
                >
                  <EventsList events={events} getEvents={getEvents} />
                </TabPanel>
                <TabPanel
                  className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 rounded-xl bg-white/5 p-3"
                >
                  <EventsList events={attendingEvents} getEvents={getEvents} />
                </TabPanel>
                <TabPanel
                  className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 rounded-xl bg-white/5 p-3"
                >
                  <EventsList events={bailedEvents} getEvents={getEvents} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
      <Toaster
        toastOptions={{
          className: 'isolate rounded-xl backdrop-blur-sm bg-black/80 shadow-lg ring-1 ring-black/5 border-transparent text-white'
        }}
        position="bottom-center"
      />
    </div>
  );
}

export default Events;
