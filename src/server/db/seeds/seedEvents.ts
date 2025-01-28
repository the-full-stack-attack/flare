import dayjs from 'dayjs';
import database from '../index';
import Event from '../models/events';
import Venue from '../models/venues';
import User from '../models/users';
import Category from '../models/categories';
import Interest from '../models/interests';
import Event_Interest from '../models/events_interests';
import Notification from '../models/notifications';

// EventData type to store events in DB
type EventData = {
  title: string;
  start_time: Date;
  end_time: Date;
  address: string;
  description: string;
  venue_id?: number;
  category_id?: number;
  created_by?: number;
  hour_before_notif?: number;
  chatroom_id: number;
};

// UserData type to store users in DB
type UserData = {
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  tasks_completed: number;
  events_attended: number;
  location: string;
  avatar_id: number;
  avatar_shirt: string;
  avatar_pants: string;
};

// VenueData type to store venues in DB
type VenueData = {
  name: string;
  description: string;
};

// Capture a snapshot of the time right now to send data in the near future
const now = Date.now();

// Seed Venue Data
const homeVenue: VenueData = {
  name: 'Home',
  description: 'Home Sweet Home!',
};

// Seed User Data
const adminUser: UserData = {
  username: 'admin',
  email: 'admin@admin.org',
  full_name: 'Admin Man',
  phone_number: '5554443333',
  tasks_completed: 0,
  events_attended: 0,
  location: 'Here',
  avatar_id: 1,
  avatar_shirt: 'Red',
  avatar_pants: 'Blue',
};

// Array of Events seed data
const sampleEvents: EventData[] = [
  {
    title: 'Darts Night',
    start_time: new Date(now + 1000 * 60 * 60 * 3),
    end_time: new Date(now + 1000 * 60 * 60 * 4),
    address: '123 Have Fun Blvd',
    description: "We're playing darts.",
    chatroom_id: 1,
  },
  {
    title: 'Movie Night',
    start_time: new Date(now + 1000 * 60 * 60 * 5),
    end_time: new Date(now + 1000 * 60 * 60 * 6),
    address: '456 Laughing St',
    description: "We're watching The Jerk.",
    chatroom_id: 1,
  },
  {
    title: 'Watching the Game',
    start_time: new Date(now + 1000 * 60 * 60 * 7),
    end_time: new Date(now + 1000 * 60 * 60 * 8),
    address: '789 Game Ave',
    description: "We're watching The Saints game.",
    chatroom_id: 1,
  },
];

const seedEvents = async () => {
  try {
    // Delete all Event data
    const events = await Event.findAll();
    events.forEach(async (event: any) => {
      await event.destroy();
    });

    const eventInterests = await Event_Interest.findAll();
    eventInterests.forEach(async (eventInterest: any) => {
      await eventInterest.destroy();
    });

    await User.findOrCreate({
      where: {
        username: 'admin',
      },
      defaults: adminUser,
    });

    // Find users and venues
    const users: any = await User.findAll();
    const venues: any = await Venue.findAll();
    const categories: any = await Category.findAll();
    const interests: any = await Interest.findAll();

    // Assign the new user and venue to each event object
    sampleEvents.forEach((event: EventData) => {
      event.venue_id = venues[Math.floor(Math.random() * venues.length)].id;
      event.created_by = users[Math.floor(Math.random() * users.length)].id;
      event.category_id = categories[Math.floor(Math.random() * categories.length)].id;
    });

    const addNotifications = async (events: any) => {
      for (const event of events) {
        const hourBeforeNotif: any = await Notification.create({
          message: `The upcoming event you're attending, ${event.title}, starts soon at ${dayjs(event.start_time).format('h:mm A')}. Hope to see you there.`,
          send_time: new Date(event.start_time.getTime() - 1000 * 60 * 60),
        });
        event.hour_before_notif = hourBeforeNotif.dataValues.id;
      }
    };

    await addNotifications(sampleEvents);

    console.log(sampleEvents);

    // Create the events for the database
    const newEvents: any = await Event.bulkCreate(sampleEvents);

    const addInterests = async (events: any) => {
      for (let event of events) {
        const EventId = event.dataValues.id;
        for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i += 1) {
          await Event_Interest.findOrCreate({
            where: {
              EventId,
              InterestId:
                interests[Math.floor(Math.random() * interests.length)].id,
            },
            defaults: {
              EventId,
              InterestId:
                interests[Math.floor(Math.random() * interests.length)].id,
            },
          });
        }
      }
    };

    await addInterests(newEvents);

    // newEvents.forEach(async (event: any) => {
    //   const EventId = event.dataValues.id;

    //   await Event_Interest.findOrCreate({
    //     where: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //     defaults: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //   });
    //   await Event_Interest.findOrCreate({
    //     where: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //     defaults: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //   });
    //   await Event_Interest.findOrCreate({
    //     where: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //     defaults: {
    //       EventId,
    //       InterestId:
    //         interests[Math.floor(Math.random() * interests.length)].id,
    //     },
    //   });
    // });

    console.log('Created events');
  } catch (err: unknown) {
    console.error('Failed to seedEvents:', err);
  }
};

setTimeout(() => {
  seedEvents();
}, 2000);
