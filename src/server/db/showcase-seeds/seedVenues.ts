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
  wheelchair_accessible: boolean | null;
  serves_alcohol: boolean | null;
  is_vegan_friendly: boolean | null;
  is_dog_friendly: boolean | null;
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


const venues: SeedVenue[] = [
  /* #1 Kajun's Pub */
  {
    name: `Kajun's Pub`,
    description: `Down-home watering hole with karaoke, a jukebox, elevated bar bites, drinks & late hours.`,
    category: 'Bar',
    street_address: '2256 St Claude Ave',
    zip_code: 70117,
    city_name: 'New Orleans',
    state_name: 'LA',
    phone: '5049473735',
    website: 'http://www.kajunskaraokebar.com/',
    pricing: '$10–20',
    rating: 4,
    total_reviews: 554,
    popularTime: new Date('2025-03-09T06:25:36.000Z'),
    wheelchair_accessible: true,
    serves_alcohol: true,
    is_vegan_friendly: true,
    is_dog_friendly: null,
    fsq_id: '4ad4c04cf964a52032f320e3',
    google_place_id: 'ChIJq8z08yGmIIYRdURBqx_JQCc',
  },

  /* #2 Anna's */
  {
    name: `Anna's`,
    description: `Anna's is a locals' spot turned destination dive. The drinks aren't fancy and you can always come as you are.`,
    category: 'Bar',
    street_address: '2601 Royal St',
    zip_code: 70117,
    city_name: 'New Orleans',
    state_name: 'LA',
    phone: '5047668376',
    website: 'https://www.annasnola.com/',
    pricing: '$10–20',
    rating: 4,
    total_reviews: 177,
    popularTime: new Date('2025-03-09T04:58:07.000Z'), // 10:58 PM
    wheelchair_accessible: false,
    serves_alcohol: true,
    is_vegan_friendly: null,
    is_dog_friendly: true,
    fsq_id: '60baa6407f3f8e10f8f6d6ed',
    google_place_id: 'ChIJQRCa0N2nIIYR9hetQoh1Y3Q',
  }
];

const venueImages: SeedVenueImage[] = [
  /* #1 Kajun's Pub Images */
  { // 1
    path: 'https://fastly.4sqi.net/img/general/original/2680510_WnSfeiodetiIOIs6J0H0UPEkfFqfBmg5y_Pa6h6tYos.jpg',
    source: 'foursquare',
    venue_id: 1,
  },
  { // 2
    path: 'https://fastly.4sqi.net/img/general/original/23594814_uj7ov_dEe_sUHp8pSBQAyELuQuRzyxQHFHrF7XPQqUQ.jpg',
    source: 'foursquare',
    venue_id: 1,
  },
  { // 3
    path: 'https://fastly.4sqi.net/img/general/original/74982940_0zRLX6xZzG8Pk804PZ6f34_mIeFcS4a0LjT_V4B8mFM.jpg',
    source: 'foursquare',
    venue_id: 1,
  },
  { // 4
    path: 'https://fastly.4sqi.net/img/general/original/168448_049mU73DtfQZZ1HfjameY-CMWjx6voypKTu-p9yC2bM.jpg',
    source: 'foursquare',
    venue_id: 1,
  },
  { // 5
    path: 'https://fastly.4sqi.net/img/general/original/1681719_EalBHTMOgsl6QyR3BbYxGFr7nW2fpMmitYNo_JSb3iw.jpg',
    source: 'foursquare',
    venue_id: 1,
  },
  { // 6
    path: 'https://lh3.googleusercontent.com/p/AF1QipOiZ7RA-os9oY6FCUC9Kt8wLO18ZgPCKJcp0dqJ=w408-h240-k-no-pi-10-ya280.25806-ro-0-fo100',
    source: 'google',
    venue_id: 1,
  },

  /* #2 Anna's Images */
  { // 7
    path: 'https://fastly.4sqi.net/img/general/original/3421329_84d9OcikBmXMjTTiURer81bnkem9cf3AERVXkG99GU4.jpg',
    source: 'foursquare',
    venue_id: 2,
  },
  { // 8
    path: 'https://fastly.4sqi.net/img/general/original/14845948_1UGbY1sqegopMWBPRCd4jGCiRLMt7QjGk6uSlvNwC0Y.jpg',
    source: 'foursquare',
    venue_id: 2,
  },
  { // 9
    path: 'https://fastly.4sqi.net/img/general/original/218694_uPVQBnTatST_tNu5UqKawP_VbENpZh3ej6IUyZ_GgrQ.jpg',
    source: 'foursquare',
    venue_id: 2,
  },
  { // 10
    path: 'https://fastly.4sqi.net/img/general/original/218694_eU9yZAv8RzIccpgLl6Vrh1SMMzgfKvy9zI0GrBT1JjU.jpg',
    source: 'foursquare',
    venue_id: 2,
  },
  { // 11
    path: 'https://fastly.4sqi.net/img/general/original/218694_8J6jZ3YWzM3zvFUe7vIyMzqwHiV9aiX2jNgNuEK4W8Q.jpg',
    source: 'foursquare',
    venue_id: 2,
  },
  { // 12
    path: 'https://lh5.googleusercontent.com/p/AF1QipO73AFoXZES1t2679DSmnKGUSLw_C4_zZpjYE8=w426-h240-k-no',
    source: 'google',
    venue_id: 2,
  },
];

const venueTags: SeedVenueTag[] = [
  /* Kajun's Pub Tags */
  { tag: 'staff', source: 'foursquare', count: 1, venue_id: 1 }, // 1
  { tag: 'beer', source: 'foursquare', count: 1, venue_id: 1 }, // 2
  { tag: 'inexpensive', source: 'foursquare', count: 1, venue_id: 1 }, // 3
  { tag: 'city', source: 'foursquare', count: 1, venue_id: 1 }, // 4
  { tag: 'shrimp', source: 'foursquare', count: 1, venue_id: 1 }, // 5
  { tag: 'outdoor seating', source: 'foursquare', count: 1, venue_id: 1 }, // 6
  { tag: 'casual', source: 'foursquare', count: 1, venue_id: 1 }, // 7
  { tag: 'great value', source: 'foursquare', count: 1, venue_id: 1 }, // 8
  { tag: 'authentic', source: 'foursquare', count: 1, venue_id: 1 }, // 9
  { tag: 'island', source: 'foursquare', count: 1, venue_id: 1 }, // 10
  { tag: 'oysters', source: 'foursquare', count: 1, venue_id: 1 }, // 11
  { tag: 'karaoke', source: 'foursquare', count: 1, venue_id: 1 }, // 12
  { tag: 'football', source: 'foursquare', count: 1, venue_id: 1 }, // 13
  { tag: 'pitchers', source: 'foursquare', count: 1, venue_id: 1 }, // 14
  { tag: 'good for special occasions', source: 'foursquare', count: 1, venue_id: 1 }, // 15
  { tag: 'eclectic', source: 'foursquare', count: 1, venue_id: 1 }, // 16
  { tag: 'singers', source: 'foursquare', count: 1, venue_id: 1 }, // 17
  { tag: 'jello shots', source: 'foursquare', count: 1, venue_id: 1 }, // 18
  { tag: 'daily drink specials', source: 'foursquare', count: 1, venue_id: 1 }, // 19
  { tag: 'sing', source: 'google', count: 32, venue_id: 1 }, // 20
  { tag: 'atmosphere', source: 'google', count: 14, venue_id: 1 }, // 21
  { tag: 'crowd', source: 'google', count: 14, venue_id: 1 }, // 22
  { tag: 'party', source: 'google', count: 8, venue_id: 1 }, // 23
  { tag: 'money', source: 'google', count: 8, venue_id: 1 }, // 24
  { tag: 'bouncer', source: 'google', count: 7, venue_id: 1 }, // 25
  { tag: 'choice', source: 'google', count: 7, venue_id: 1 }, // 26
  { tag: 'patio', source: 'google', count: 5, venue_id: 1 }, // 27
  { tag: 'fun', source: 'google', count: 5, venue_id: 1 }, // 28
  { tag: 'liquor', source: 'google', count: 5, venue_id: 1 }, // 29

  /* #2 Anna's Tags */
  { tag: 'town', source: 'foursquare', count: 1, venue_id: 2 }, // 30
  { tag: 'casual', source: 'foursquare', count: 1, venue_id: 2 }, // 31
  { tag: 'neighborhood', source: 'foursquare', count: 1, venue_id: 2 }, // 32
  { tag: 'cosy atmosphere', source: 'foursquare', count: 1, venue_id: 2 }, // 33
  { tag: 'prices', source: 'google', count: 10, venue_id: 2 }, // 34
  { tag: 'atmosphere', source: 'google', count: 8, venue_id: 2 }, // 35
  { tag: 'menu', source: 'google', count: 7, venue_id: 2 }, // 36
  { tag: 'tacos', source: 'google', count: 6, venue_id: 2 }, // 37
  { tag: 'pool table', source: 'google', count: 5, venue_id: 2 }, // 38
  { tag: 'balcony', source: 'google', count: 2, venue_id: 2 }, // 39
  { tag: 'fried tofu', source: 'google', count: 2, venue_id: 2 }, // 40
  { tag: 'pop ups', source: 'google', count: 2, venue_id: 2 }, // 41
  { tag: 'parade', source: 'google', count: 2, venue_id: 2 }, // 42
  { tag: 'chicken parm', source: 'google', count: 2, venue_id: 2 }, // 43
];

const seedVenues = async () => {
  try {
    await Venue.bulkCreate(venues);
    await Venue_Image.bulkCreate(venueImages);
    await Venue_Tag.bulkCreate(venueTags);
    console.log('Venue, Images, and Tags seeded.')
  } catch (error: unknown) {
    console.error('Failed to seed venues:', error);
  }
};

export default seedVenues;
