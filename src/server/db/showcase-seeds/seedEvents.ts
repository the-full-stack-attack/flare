import Event from "../models/events";
import Notification from "../models/notifications";
import Event_Interest from "../models/events_interests";
import Event_Venue_Image from "../models/event_venue_images";
import Event_Venue_Tag from "../models/event_venue_tags";
import Chatroom from "../models/chatrooms";
import User_Event from "../models/users_events";

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

type SeedNotification = {
  title: string;
  message: string;
  send_time: Date;
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