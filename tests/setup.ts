import database from '../src/server/db';
import http from 'http';
import express, { Application } from 'express';

import apiRouter from '../src/server/api';
import User from '../src/server/db/models/users';
import Event from '../src/server/db/models/events';
import Interest from '../src/server/db/models/interests';
import Category from '../src/server/db/models/categories';
import Venue from '../src/server/db/models/venues';
import Event_Interest from '../src/server/db/models/events_interests';
import Notification from '../src/server/db/models/notifications';

export default async function () {
  const PORT = 8000;

  const testUser1 = {
    username: 'test123',
    google_id: '1234',
    email: 'test@test.com',
    full_name: 'Test User 1',
    phone_number: '5554443333',
  };

  const testUser2 = {
    username: 'test456',
    google_id: '5678',
    email: 'test2@test.com',
    full_name: 'Test User 2',
    phone_number: '9998887777',
  };

  const now = Date.now();

  const testVenue1 = {
    city_name: 'New Orleans',
    state_name: 'LA',
  };

  const testVenue2 = {
    city_name: 'Mandeville',
    state_name: 'LA',
  };

  const testEvent1 = {
    title: 'Test Event 1',
    start_time: new Date(now + 1000 * 60 * 60 * 1),
    end_time: new Date(now + 1000 * 60 * 60 * 4),
    address: '123 Fun Blvd',
    description: 'Testing events with this.',
    venue_id: 0,
    category_id: 0,
    created_by: 0,
    hour_before_notif: 0,
  };

  const testEvent2 = {
    title: 'Test Event 2',
    start_time: new Date(now + 1000 * 60 * 60 * 2),
    end_time: new Date(now + 1000 * 60 * 60 * 5),
    address: '123 Fun Blvd',
    description: 'Testing events with this.',
    venue_id: 0,
    category_id: 0,
    created_by: 0,
    hour_before_notif: 0,
  };

  const testNotif1 = {
    message: `The upcoming event ${testEvent1.title} is starting soon.`,
    send_time: new Date(testEvent1.start_time.getTime() - 1000 * 60 * 60),
  };

  const testNotif2 = {
    message: `The upcoming event ${testEvent2.title} is starting soon.`,
    send_time: new Date(testEvent2.start_time.getTime() - 1000 * 60 * 60),
  };

  function promiseListen(exApp: Application): Promise<http.Server> {
    return new Promise<http.Server>((resolve, reject) => {
      const server = exApp.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`)
        resolve(server);
      });

      server.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  let testServer: http.Server;
  let user1: any;
  let user2: any;
  let event1: any;
  let event2: any;
  let venue1: any;
  let venue2: any;
  let notif1: any;
  let notif2: any;

  try {
    // Sync database and add test user and test event
    await database.sync();
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);
    const interests: any[] = await Interest.findAll();
    const categories: any[] = await Category.findAll();
    venue1 = await Venue.create(testVenue1);
    venue2 = await Venue.create(testVenue2);
    notif1 = await Notification.create(testNotif1);
    notif2 = await Notification.create(testNotif2);

    testEvent1.venue_id = venue1.id;
    testEvent1.category_id = categories[Math.floor(Math.random() * categories.length)].id;
    testEvent1.created_by = user1.id;
    testEvent1.hour_before_notif = notif1.id;
    
    testEvent2.venue_id = venue2.id;
    testEvent2.category_id = categories[Math.floor(Math.random() * categories.length)].id;
    testEvent2.created_by = user2.id;
    testEvent2.hour_before_notif = notif2.id;

    event1 = await Event.create(testEvent1);
    event2 = await Event.create(testEvent2);

    await Event_Interest.create({
        EventId: event1.id,
        InterestId: interests[Math.floor(Math.random() * interests.length)].id,
    });
    await Event_Interest.create({
        EventId: event2.id,
        InterestId: interests[Math.floor(Math.random() * interests.length)].id,
    });
    // Build test app with the same routes
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = user1;
      next();
    });
    app.use('/api', apiRouter);
    // Then listen
    testServer = await promiseListen(app);

    globalThis.testServer = testServer;
    globalThis.user1 = user1;
    globalThis.user2 = user2;
    globalThis.event1 = event1;
    globalThis.event2 = event2;
    globalThis.venue1 = venue1;
    globalThis.venue2 = venue2;
    globalThis.notif1 = notif1;
    globalThis.notif2 = notif2;
    globalThis.PORT = PORT;
  } catch (error: unknown) {
    console.error('Failed to start server for testing:', error);
  }
}
