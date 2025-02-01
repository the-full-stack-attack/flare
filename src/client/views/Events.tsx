import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../contexts/UserContext';

import { Button } from '../../components/ui/button';

import { Input } from '../../components/ui/input';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

import EventsList from '../components/events-view/EventsList';

type GeoPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type GeoLocation = {
  latitude: null | number;
  longitude: null | number;
};

type EventData = {
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
  hour_before_notif: number;
  User_Event?: {
    user_attending: boolean;
  };
};

function Events() {
  const { user } = useContext(UserContext);

  // The latitude and longitude of the user will be stored in state on page load
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: 0,
    longitude: 0,
  });

  const [location, setLocation] = useState<any>({});

  const [locationFilter, setLocationFilter] = useState<any>({
    city: '',
    state: '',
  });
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Events the user can attend will be stored in state on page load
  const [events, setEvents] = useState<EventData[]>([]);

  // Events the user can attend will be stored in state on page load
  const [attendingEvents, setAttendingEvents] = useState<EventData[]>([]);

  const [bailedEvents, setBailedEvents] = useState<EventData[]>([]);

  const [changeLocFilter, setChangeLocFilter] = useState(false);

  const getGeoLocation = () => {
    const success = (position: GeoPosition) => {
      const { latitude, longitude } = position.coords;

      setGeoLocation({ latitude, longitude });
    };

    const error = () => {
      console.error('Unable to retrieve your location');
    };

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const getAttendEvents = () => {
    axios
      .get('/api/event/attend/true')
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
      .get('/api/event/attend/false')
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

  const getLocation = () => {
    if (geoLocation.latitude && geoLocation.longitude) {
      axios
        .get(
          `/api/event/location/${geoLocation.latitude}/${geoLocation.longitude}`
        )
        .then(({ data }) => {
          setLocation({
            city: data.city.long_name,
            state: data.state.short_name,
          });
          setLocationFilter({
            city: data.city.long_name,
            state: data.state.short_name,
          });
        })
        .catch((err: unknown) => {
          console.error('Failed getLocation:', err);
        });
    }
  };

  const toggleChangeLocFilter = () => {
    setChangeLocFilter(!changeLocFilter);
  };

  const handleCityInput = ({ target }: any) => {
    setCity(target.value);
  };

  const handleStateInput = ({ target }: any) => {
    setState(target.value);
  };

  const handleSubmitLocFilter = () => {
    if (state.length !== 2) {
      return;
    }
    setLocationFilter({ city, state: state.toUpperCase() });
    setChangeLocFilter(false);
    setCity('');
    setState('');
  };

  const handleClearLocFilter = () => {
    setLocationFilter({ city: '', state: '' });
    setChangeLocFilter(false);
  };

  const handleResetLocFilter = () => {
    setLocationFilter({
      city: location.city,
      state: location.state,
    });
    setChangeLocFilter(false);
  };

  useEffect(() => {
    getGeoLocation();
    getEvents();
  }, []);

  useEffect(() => {
    getLocation();
  }, [geoLocation]);

  useEffect(() => {
    getEvents();
  }, [locationFilter]);

  return (
    <div className="container mx-auto px-4 pt-20 content-center">
      <div className="container mx-auto px-4">
        <p>
          Upcoming Events from
          <b>{` ${locationFilter.city ? locationFilter.city : 'Anywhere'}${locationFilter.state ? `, ${locationFilter.state}` : ''}`}</b>
        </p>
        {!changeLocFilter ? (
          <Button className="mt-2" onClick={toggleChangeLocFilter}>
            Change Location
          </Button>
        ) : (
          <div className="mt-2 grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
            <Button
              className="col-span-1"
              onClick={({ target }: any) => {
                if (target.innerText === 'Cancel') {
                  toggleChangeLocFilter();
                }
                if (target.innerText === 'Current Location') {
                  handleResetLocFilter();
                }
              }}
            >
              {locationFilter.city === location.city && locationFilter.state === location.state ? 'Cancel' : 'Current Location'}
            </Button>
            <Input
              className="col-span-2"
              value={city}
              placeholder="City Name"
              onChange={handleCityInput}
              onKeyUp={({ key }) => {
                if (key === 'Enter') {
                  handleSubmitLocFilter();
                }
              }}
            />
            <Input
              className="col-span-2"
              value={state}
              placeholder="State Initials, XX"
              onChange={handleStateInput}
              onKeyUp={({ key }) => {
                if (key === 'Enter') {
                  handleSubmitLocFilter();
                }
              }}
            />
            <Button
              className="col-span-1"
              onClick={({ target }: any) => {
                if (target.innerText === 'Remove Filter') {
                  handleClearLocFilter();
                }
                if (target.innerText === 'Set Filter') {
                  handleSubmitLocFilter();
                }
              }}
            >
              {city === '' || state === '' ? 'Remove Filter' : 'Set Filter'}
            </Button>
          </div>
        )}
      </div>
      <Tabs
        defaultValue="upcoming"
        className="container mx-auto px-4 content-center"
      >
        <TabsList>
          <TabsTrigger value="upcoming">{`Upcoming (${events.length})`}</TabsTrigger>
          <TabsTrigger value="attending">{`Attending (${attendingEvents.length})`}</TabsTrigger>
          <TabsTrigger value="bailed">{`Bailed (${bailedEvents.length})`}</TabsTrigger>
        </TabsList>
        <TabsContent
          value="upcoming"
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
        >
          <EventsList events={events} getEvents={getEvents} />
        </TabsContent>
        <TabsContent
          value="attending"
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
        >
          <EventsList events={attendingEvents} getEvents={getEvents} />
        </TabsContent>
        <TabsContent
          value="bailed"
          className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
        >
          <EventsList events={bailedEvents} getEvents={getEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Events;
