import database from '../index';
import Event from '../models/events';
import Venue from '../models/venues';
import User from '../models/users';

// EventData type to store events in DB
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
    // Delete all Event data
    const events = await Event.findAll();
    events.forEach(async (event: any) => {
      await event.destroy();
    });

    // Delete all User data
    const users = await User.findAll();
    users.forEach(async (user: any) => {
      await user.destroy();
    });

    // Delete all Venue data
    const venues = await Venue.findAll();
    venues.forEach(async (venue: any) => {
      await venue.destroy();
    });

    // Create a new user and venue
    const newUser = await User.create(adminUser);
    const newVenue = await Venue.create(homeVenue);

    // Assign the new user and venue to each event object
    sampleEvents.forEach((event: EventData) => {
      event.venue_id = newVenue.id;
      event.created_by = newUser.id;
    });

    // Create the events for the database
    await Event.bulkCreate(sampleEvents);
    console.log('Created events');
  } catch (err: unknown) {
    console.error('Failed to seedEvents:', err);
  }
};

setTimeout(() => {
  seedEvents();
}, 2000);
