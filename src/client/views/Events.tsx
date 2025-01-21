import React, { useEffect, useState } from 'react';

function Events() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const getGeoLocation = () => {
    const success = (position: any) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocation({ latitude, longitude });
    }

    const error = () => {
      console.error("Unable to retrieve your location");
    };

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  useEffect(() => {
    getGeoLocation();
  }, []);

  console.log(location);

  return (
    <div>
      <h4>Hello Stanky</h4>
    </div>
  )
};

export default Events;
