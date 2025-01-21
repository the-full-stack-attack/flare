import React, { useEffect, useState } from 'react';

/////

type GeoPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type Location = {
  latitude: null | number;
  longitude: null | number;
};

function Events() {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const getGeoLocation = () => {
    const success = (position: GeoPosition) => {
      const { latitude, longitude } = position.coords;

      setLocation({ latitude, longitude });
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

  useEffect(() => {
    getGeoLocation();
  }, []);

  return (
    <div>
      <h4>Hello Stanky</h4>
    </div>
  );
}

export default Events;
