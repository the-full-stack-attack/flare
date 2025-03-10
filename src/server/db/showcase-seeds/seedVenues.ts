import Venue from "../models/venues";
import Venue_Image from "../models/venue_images";
import Venue_Tag from "../models/venue_tags";

type SeedVenue = {
  name: string;
  description: string;
  category: string;
  street_address: string;
  zip_code: number;
  city_name: string;
  state_name: string;
  phone: string;
  website: string;
  pricing: string;
  rating: number;
  total_reviews: number;
  popularTime: Date;
  wheelchair_accessible: boolean;
  serves_alcohol: boolean;
  is_vegan_friendly: boolean;
  is_dog_friendly: boolean;
  fsq_id: string;
  google_place_id: string;
};

type SeedVenueImage = {
  path: string;
  source: string;
  venue_id: number;
};

type SeedVenueTag = {
  tag: string;
  source: string;
  count: number;
  venue_id: number;
};
