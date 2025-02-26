export type EventData = {
  id: number;
  title: string;
  start_time: Date;
  end_time: Date;
  address: string;
  description: string;
  venue_id: number;
  created_by: number;
  chatroom_id: number;
  createdAt: Date;
  updatedAt: Date;
  hour_before_notif: number;
  User_Event: {
    user_attending: boolean;
  };
  Users: {
    id: number;
    username: string;
    full_name: string;
    User_Event: {
      user_attending: boolean;
    };
  }[];
  Category: {
    id: number;
    name: string;
  };
  Interests: {
    id: number;
    name: string;
  }[];
  Venue: {
    id: number;
    name: string;
    description: string | null;
    street_address: string | null;
    city_name: string | null;
    state_name: string | null;
    zip_code: number | null;
    category: string | null;
    phone: string | null;
    popularTime: Date | null;
    pricing: string | null;
    serves_alcohol: boolean | null;
    website: string | null;
    wheelchair_accessible: boolean | null;
    is_dog_friendly: boolean | null;
    is_vegan_friendly: boolean | null;
  };
  Venue_Images: {
    path: string;
    Event_Venue_Image: {
      display_order: number;
    };
  }[];
  Venue_Tags: {
    count: number;
    tag: string;
    Event_Venue_Tag: {
      display_order: number;
    };
  }[];
};