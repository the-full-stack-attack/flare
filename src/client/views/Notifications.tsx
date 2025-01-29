import React, { useContext } from 'react';

import { UserContext } from '../contexts/UserContext';

function Notifications() {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
      <h1 className="text-4xl">Notifications</h1>
      <ul>
        {user.Notifications.map((notif: any) => (
          <li>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
