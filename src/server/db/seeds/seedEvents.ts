const { database } = require('../index.ts');
const { Event } = require('../models/events.ts');
const { Venue } = require('../models/venues.ts');
const { User } = require('../models/users.ts');

type EventData = {
  title: string;
  start_time: Date;
  end_time: Date;
  address: string;
  description: string;
  venue_id?: number;
  created_by?: number;
  chatroom_id: number;
};

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

type VenueData = {
  name: string;
  description: string;
};

const now = Date.now();

const homeVenue: VenueData = {
  name: 'Home',
  description: 'Home Sweet Home!',
};

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

const sampleEvents: EventData[] = [
  {
    title: 'Darts Night',
    start_time: new Date(now + 60000 * 60 * 1),
    end_time: new Date(now + 60000 * 60 * 2),
    address: '123 Have Fun Blvd',
    description: "We're playing darts.",
    chatroom_id: 1,
  },
  {
    title: 'Movie Night',
    start_time: new Date(now + 60000 * 60 * 3),
    end_time: new Date(now + 60000 * 60 * 4),
    address: '456 Laughing St',
    description: "We're watching The Jerk.",
    chatroom_id: 1,
  },
  {
    title: 'Watching the Game',
    start_time: new Date(now + 60000 * 60 * 5),
    end_time: new Date(now + 60000 * 60 * 6),
    address: '789 Game Ave',
    description: "We're watching The Saints game.",
    chatroom_id: 1,
  },
];

const seedEvents = async () => {
  try {
    const events = await Event.findAll();
    events.forEach(async (event: any) => {
      await event.destroy();
    });
    const users = await User.findAll();
    users.forEach(async (user: any) => {
      await user.destroy();
    });
    const venues = await Venue.findAll();
    venues.forEach(async (venue: any) => {
      await venue.destroy();
    });

    const newUser = await User.create(adminUser);
    const newVenue = await Venue.create(homeVenue);

    sampleEvents.forEach((event: EventData) => {
      event.venue_id = newVenue.id;
      event.created_by = newUser.id;
    });

    await Event.bulkCreate(sampleEvents);
    console.log('Created events');
  } catch (err: unknown) {
    console.error('Failed to seedEvents:', err);
  }
};

setTimeout(() => {
  seedEvents();
}, 2000);
