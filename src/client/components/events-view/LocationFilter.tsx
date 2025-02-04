import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

type LocationFilterProps = {
  locationFilter: {
    city: string;
    state: string;
  };
  location: {
    city?: string;
    state?: string;
  };
};

function LocationFilter({ locationFilter, location }: LocationFilterProps) {
  const [changeLocFilter, setChangeLocFilter] = useState<boolean>(false);
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');


  const toggleChangeLocFilter = () => {
    setChangeLocFilter(!changeLocFilter);
  };

  const handleCityInput = ({ target }: any) => {
    setCity(target.value);
  };

  const handleStateInput = ({ target }: any) => {
    setState(target.value);
  };

  return (
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
  );
}

export default LocationFilter;
