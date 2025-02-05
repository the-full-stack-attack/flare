import database from '../src/server/db';
import http, { Server } from 'http';
import axios from 'axios';
import express, { Application } from 'express';

import apiRouter from '../src/server/api';
import User from '../src/server/db/models/users';
import Event from '../src/server/db/models/events';
import Interest from '../src/server/db/models/interests';
import Category from '../src/server/db/models/categories';
import Venue from '../src/server/db/models/venues';
import Event_Interest from '../src/server/db/models/events_interests';

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

function promiseServerClose(server: http.Server): Promise<void> {
  return new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    })
  });
}

describe('Flare Test Suite', () => {

  let server: http.Server;
  let user1: any;
  let user2: any;
  let event1: any;
  let event2: any;
  let venue1: any;
  let venue2: any;

  beforeAll(async () => {
    try {
      // Sync database and add test user and test event
      await database.sync();
      user1 = await User.create(testUser1);
      user2 = await User.create(testUser2);
      const interests: any[] = await Interest.findAll();
      const categories: any[] = await Category.findAll();
      venue1 = await Venue.create(testVenue1);
      venue2 = await Venue.create(testVenue2);

      testEvent1.venue_id = venue1.id;
      testEvent1.category_id = categories[Math.floor(Math.random() * categories.length)].id;
      testEvent1.created_by = user1.id;

      testEvent1.venue_id = venue2.id;
      testEvent1.category_id = categories[Math.floor(Math.random() * categories.length)].id;
      testEvent1.created_by = user2.id;

      event1 = await Event.create(testEvent1);

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
      server = await promiseListen(app);
    } catch (error: unknown) {
      console.error('Failed to start server for testing:', error);
    }
  });

  afterAll(async () => {
    try {
      // Destroy the test user and test event and test venue
      await user1.destroy();
      await event1.destroy();
      await venue1.destroy();
      await user2.destroy();
      await event2.destroy();
      await venue2.destroy();
      // Close the server
      await promiseServerClose(server);
    } catch (error: unknown) {
      console.error('Failed to delete test data from DB and close server:', error);
    }
  })

  describe('Event Server Handlers:', () => {
    test('GET /api/events responds with an array of events ', async () => {
      try {
        const { data: fetchedEvents } = await axios.get(`http://localhost:${PORT}/api/event`, {
          params: {
            locationFilter: {
              city: '',
              state: '',
            }
          }
        });
        expect(fetchedEvents).toBeDefined();+
        expect(Array.isArray(fetchedEvents)).toBe(true);
        expect(fetchedEvents.length).toBeGreaterThan(0);
      } catch (error: unknown) {
        console.error('Failed to get events for test:', error);
      }
    });
  })

});