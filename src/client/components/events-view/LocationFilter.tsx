import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

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

type Location = {
  city: string;
  state: string;
};

type LocationFilterProps = {
  locationFilter: {
    city: string;
    state: string;
  };
  handleSetLocationFilter: (arg0: Location) => void;
};

function LocationFilter({ locationFilter, handleSetLocationFilter }: LocationFilterProps) {
  // The latitude and longitude of the user will be stored in state on page load
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: 0,
    longitude: 0,
  });

  const [location, setLocation] = useState<Location>({
    city: '',
    state: '',
  });

  const [changeLocFilter, setChangeLocFilter] = useState<boolean>(false);
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-4 py-4 rounded-xl text-md';

  const getGeoLocation = useCallback(() => {
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
  }, []);

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
          handleSetLocationFilter({
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

  const handleCityInput = ({ target }: InputChangeEvent) => {
    setCity(target.value);
  };

  const handleStateInput = ({ target }: InputChangeEvent) => {
    setState(target.value);
  };

  const handleSubmitLocFilter = () => {
    if (state.length !== 2) {
      return;
    }
    handleSetLocationFilter({ city, state: state.toUpperCase() });
    setCity('');
    setState('');
  };

  const handleClearLocFilter = () => {
    handleSetLocationFilter({ city: '', state: '' });
  };

  const handleResetLocFilter = () => {
    handleSetLocationFilter({
      city: location.city,
      state: location.state,
    });
  };

  useEffect(() => {
    getGeoLocation();
  }, [getGeoLocation]);

  useEffect(() => {
    getLocation();
  }, [geoLocation]);

  return (
    <div className="container">
      <Dialog>
        <DialogTrigger asChild>
          <Button className={buttonColor}>
            Location
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/80 rounded-xl border-transparent">
          <DialogHeader>
            <DialogTitle className="text-gray-200 text-xl">
              Filter by Location
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base">
              Input the city and state where you would like to look for events to attend.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <DialogClose asChild>
              <Button
                className={'col-span-2 ' + buttonColor}
                onClick={({ target }: ButtonClickEvent) => {
                  if ((target as HTMLButtonElement).innerText === 'Current Location') {
                    handleResetLocFilter();
                  }
                }}
              >
                {locationFilter.city === location.city && locationFilter.state === location.state ? 'Cancel' : 'Current Location'}
              </Button>
            </DialogClose>
            <Input
              className="col-span-2 text-gray-200"
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
              className="col-span-2 text-gray-200"
              value={state}
              placeholder="State Initials, XX"
              onChange={handleStateInput}
              onKeyUp={({ key }) => {
                if (key === 'Enter') {
                  handleSubmitLocFilter();
                }
              }}
            />
            <DialogClose asChild>
              <Button
                className={'col-span-2 ' + buttonColor}
                onClick={({ target }: ButtonClickEvent) => {
                  if ((target as HTMLButtonElement).innerText === 'Remove Filter') {
                    handleClearLocFilter();
                  }
                  if ((target as HTMLButtonElement).innerText === 'Set Filter') {
                    handleSubmitLocFilter();
                  }
                }}
              >
                {city === '' || state === '' ? 'Remove Filter' : 'Set Filter'}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LocationFilter;
