import Event from "../models/events";
import Notification from "../models/notifications";
import Event_Interest from "../models/events_interests";
import Event_Venue_Image from "../models/event_venue_images";
import Event_Venue_Tag from "../models/event_venue_tags";
import Chatroom from "../models/chatrooms";
import User_Event from "../models/users_events";

type SeedNotification = {
  title: string | null;
  message: string;
  send_time: Date;
};

type SeedEvent = {
  title: string;
  start_time: Date;
  end_time: Date;
  description: string;
  venue_id: number;
  category_id: number;
  created_by: number;
  hour_before_notif: number;
};

type SeedEventInterest = {
  EventId: number;
  InterestId: number;
};

type SeedEventVenueImage = {
  display_order: number;
  EventId: number;
  VenueImageId: number;
};

type SeedEventVenueTag = {
  display_order: number;
  EventId: number;
  VenueTagId: number;
};

type SeedChatroom = {
  event_id: number;
}

type SeedUserEvent = {
  UserId: number;
  EventId: number;
};

const notifications: SeedNotification[] = [
  { // #1: Karaoke Night
    title: null,
    message: `The upcoming event you're attending, Karaoke Night, starts soon in an hour. Hope to see you there.`,
    send_time: new Date('2025-03-16T23:00:00.000Z'), // 03.16.25 => 6:00 PM
  },
];

const events: SeedEvent[] = [
  /* #1 Karaoke Night */
  {
    title: 'Karaoke Night',
    start_time: new Date('2025-03-17T00:00:00.000Z'), // 03.16.25 => 7:00 PM
    end_time: new Date('2025-03-17T03:00:00.000Z'), // 03.16.25 => 10:00 PM
    description: `Let's get together for some karaoke before the start of the work week.`,
    venue_id: 1, // Kajun's Pub
    category_id: 1, // Casual Meetups
    created_by: 1, // Leeroy Jenkins
    hour_before_notif: 1,
  },
];

const eventInterests: SeedEventInterest[] = [
  /* #1: Karaoke Night */
  { EventId: 1, InterestId: 2 }, // Music
  { EventId: 1, InterestId: 10 }, // Nightlife
];

const eventVenueImages: SeedEventVenueImage[] = [
  /* #1 Karaoke Night */
  { display_order: 0, EventId: 1, VenueImageId: 1 },
  { display_order: 1, EventId: 1, VenueImageId: 3 },
  { display_order: 2, EventId: 1, VenueImageId: 6 },
];

const eventVenueTags: SeedEventVenueTag[] = [
  /* #1 Karaoke Night */
  { display_order: 0, EventId: 1, VenueTagId: 12 }, // Karaoke
  { display_order: 1, EventId: 1, VenueTagId: 7 }, // Casual
  { display_order: 2, EventId: 1, VenueTagId: 16 }, // Eclectic
  { display_order: 3, EventId: 1, VenueTagId: 20 }, // Sing
  { display_order: 4, EventId: 1, VenueTagId: 21 }, // Atmosphere
];

const chatrooms: SeedChatroom[] = [
  /* #1 Karaoke Night */
  { event_id: 1 },
];

const userEvents: SeedUserEvent[] = [
  /* #1 Karaoke Night */
  { UserId: 1, EventId: 1 }, // Leeroy Jenkins
  { UserId: 2, EventId: 1 }, // John Smith
  { UserId: 3, EventId: 1 }, // Susan Bellum
];

const seedEvents = async () => {
  try {
    await Notification.bulkCreate(notifications);
    await Event.bulkCreate(events);
    await Event_Interest.bulkCreate(eventInterests);
    await Event_Venue_Image.bulkCreate(eventVenueImages);
    await Event_Venue_Tag.bulkCreate(eventVenueTags);
    await Chatroom.bulkCreate(chatrooms);
    await User_Event.bulkCreate(userEvents);
    console.log('Events Seeded.')
  } catch (error: unknown) {
    console.error('Failed to seed events:', error);
  }
};

export default seedEvents;
