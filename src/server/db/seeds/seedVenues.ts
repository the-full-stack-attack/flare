import Venue from '../models/venues';
import Venue_Image from '../models/venue_images';
import Venue_Tag from '../models/venue_tags';
import Event from '../models/events';

const now = Date.now();

const allVenues = [
  {
    name: 'The Rabbit Hole',
    description: 'Danny Devitos favorite bar in nola',
    category: 'Bar',
    street_address: '123 Sunny St.',
    zip_code: 70115,
    city_name: 'New Orleans',
    state_name: 'LA',
    phone: '5045550123',
    website: 'https://rabbitholenola.com',
    rating: 4.5,
    total_reviews: 156,
    pricing: '$20-30',
    popularTime: new Date(new Date().setHours(22, 0, 0, 0)),
    wheelchair_accessible: true,
    serves_alcohol: true,
    fsq_id: null,
    google_place_id: null,
    events: [
      {
        title: 'Jazz Night at The Rabbit Hole',
        start_time: new Date(now + 1000 * 60 * 60 * 24 * 2),
        end_time: new Date(now + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3),
        description: 'Live jazz music featuring local artists',
        address: '123 Sunny St.',
        chatroom_id: 1
      },
      {
        title: 'Cocktail Making Workshop',
        start_time: new Date(now + 1000 * 60 * 60 * 24 * 5),
        end_time: new Date(now + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 2),
        description: 'Learn to make craft cocktails with our expert bartenders',
        address: '123 Sunny St.',
        chatroom_id: 1
      }
    ]
  },
  {
    name: 'Snake & Jakes',
    description: 'The love of my life',
    category: 'Bar',
    street_address: '123 Love St.',
    zip_code: 70115,
    city_name: 'New Orleans',
    state_name: 'LA',
    phone: '5045550124',
    website: 'https://snakeandjakes.com',
    rating: 4.2,
    total_reviews: 203,
    pricing: '$5-15',
    popularTime: new Date(new Date().setHours(23, 0, 0, 0)),
    wheelchair_accessible: false,
    serves_alcohol: true,
    fsq_id: null,
    google_place_id: null,
    events: [
      {
        title: 'Karaoke Night',
        start_time: new Date(now + 1000 * 60 * 60 * 24 * 3),
        end_time: new Date(now + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4),
        description: 'Come sing your heart out!',
        address: '123 Love St.',
        chatroom_id: 1
      }
    ]
  },
  {
    name: 'The Saint',
    description: 'For the heathens',
    category: 'Bar',
    street_address: '123 LGD Ave.',
    zip_code: 70130,
    city_name: 'New Orleans',
    state_name: 'LA',
    phone: '5045550125',
    website: 'https://thesaintnola.com',
    rating: 4.3,
    total_reviews: 178,
    pricing: '$15-25',
    popularTime: new Date(new Date().setHours(23, 0, 0, 0)),
    wheelchair_accessible: true,
    serves_alcohol: true,
    fsq_id: null,
    google_place_id: null,
    events: [
      {
        title: 'DJ Night',
        start_time: new Date(now + 1000 * 60 * 60 * 24 * 1),
        end_time: new Date(now + 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 5),
        description: 'Local DJs spinning all night',
        address: '123 LGD Ave.',
        chatroom_id: 1
      },
      {
        title: 'Punk Rock Show',
        start_time: new Date(now + 1000 * 60 * 60 * 24 * 4),
        end_time: new Date(now + 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 3),
        description: 'Live punk rock bands',
        address: '123 LGD Ave.',
        chatroom_id: 1
      }
    ]
  }
];

const venueImages = [
  {
    venue_id: 1,
    path: 'https://lh3.googleusercontent.com/p/AF1QipMsfmaCXYdZzkT7cWl2y7I8GUnrXkNPRgXop8zi=w408-h240-k-no-pi-20-ya10.999999-ro-0-fo100',
    source: 'google'
  },
  {
    venue_id: 1,
    path: 'https://lh5.googleusercontent.com/p/AF1QipMTKqbnt62FhA_qxgbWM-69hPpe_Hhaj42vEwI=w408-h408-k-no',
    source: 'google'
  },
  {
    venue_id: 1,
    path: 'https://fastly.4sqi.net/img/general/original/359755711_bx_iIlSaxnE9GctBID6N3x1MCYB2TF1oE9ugAOdOoNU.jpg',
    source: 'fsq'
  },
  {
    venue_id: 2,
    path: 'https://lh5.googleusercontent.com/p/AF1QipMTKqbnt62FhA_qxgbWM-69hPpe_Hhaj42vEwI=w408-h408-k-no',
    source: 'google'
  },
  {
    venue_id: 2,
    path: 'https://fastly.4sqi.net/img/general/original/359755711_bx_iIlSaxnE9GctBID6N3x1MCYB2TF1oE9ugAOdOoNU.jpg',
    source: 'fsq'
  },
  {
    venue_id: 2,
    path: 'https://lh3.googleusercontent.com/p/AF1QipMsfmaCXYdZzkT7cWl2y7I8GUnrXkNPRgXop8zi=w408-h240-k-no-pi-20-ya10.999999-ro-0-fo100',
    source: 'google'
  },
  {
    venue_id: 3,
    path: 'https://fastly.4sqi.net/img/general/original/359755711_bx_iIlSaxnE9GctBID6N3x1MCYB2TF1oE9ugAOdOoNU.jpg',
    source: 'fsq'
  },
  {
    venue_id: 3,
    path: 'https://lh3.googleusercontent.com/p/AF1QipMsfmaCXYdZzkT7cWl2y7I8GUnrXkNPRgXop8zi=w408-h240-k-no-pi-20-ya10.999999-ro-0-fo100',
    source: 'google'
  },
  {
    venue_id: 3,
    path: 'https://lh5.googleusercontent.com/p/AF1QipMTKqbnt62FhA_qxgbWM-69hPpe_Hhaj42vEwI=w408-h408-k-no',
    source: 'google'
  }
];

const venueTags = [
  {
    venue_id: 1,
    tag: 'Live Music',
    source: 'google',
    count: 45
  },
  {
    venue_id: 1,
    tag: 'Craft Cocktails',
    source: 'fsq',
    count: 32
  },
  {
    venue_id: 1,
    tag: 'Happy Hour',
    source: 'google',
    count: 28
  },
  {
    venue_id: 1,
    tag: 'Good for Groups',
    source: 'google',
    count: 24
  },
  {
    venue_id: 1,
    tag: 'Outdoor Seating',
    source: 'fsq',
    count: 19
  },
  {
    venue_id: 1,
    tag: 'Vintage Decor',
    source: 'google',
    count: 15
  },
  {
    venue_id: 1,
    tag: 'Date Spot',
    source: 'fsq',
    count: 22
  },
  {
    venue_id: 1,
    tag: 'Creative Drinks',
    source: 'google',
    count: 31
  },
  {
    venue_id: 1,
    tag: 'Friendly Staff',
    source: 'fsq',
    count: 27
  },
  {
    venue_id: 1,
    tag: 'Cozy Atmosphere',
    source: 'google',
    count: 18
  },
  {
    venue_id: 2,
    tag: 'Dive Bar',
    source: 'google',
    count: 67
  },
  {
    venue_id: 2,
    tag: 'Late Night',
    source: 'fsq',
    count: 89
  },
  {
    venue_id: 2,
    tag: 'Cash Only',
    source: 'google',
    count: 34
  },
  {
    venue_id: 2,
    tag: 'Local Favorite',
    source: 'fsq',
    count: 45
  },
  {
    venue_id: 2,
    tag: 'Cheap Drinks',
    source: 'google',
    count: 56
  },
  {
    venue_id: 2,
    tag: 'Hidden Gem',
    source: 'fsq',
    count: 23
  },
  {
    venue_id: 2,
    tag: 'No Frills',
    source: 'google',
    count: 28
  },
  {
    venue_id: 2,
    tag: 'Historic',
    source: 'fsq',
    count: 19
  },
  {
    venue_id: 2,
    tag: 'Jukebox',
    source: 'google',
    count: 31
  },
  {
    venue_id: 2,
    tag: 'Authentic',
    source: 'fsq',
    count: 42
  },
  {
    venue_id: 3,
    tag: 'Live DJs',
    source: 'google',
    count: 58
  },
  {
    venue_id: 3,
    tag: 'Dancing',
    source: 'fsq',
    count: 76
  },
  {
    venue_id: 3,
    tag: 'Late Night',
    source: 'google',
    count: 92
  },
  {
    venue_id: 3,
    tag: 'Alternative',
    source: 'fsq',
    count: 43
  },
  {
    venue_id: 3,
    tag: 'Punk Rock',
    source: 'google',
    count: 37
  },
  {
    venue_id: 3,
    tag: 'Dark Lighting',
    source: 'fsq',
    count: 29
  },
  {
    venue_id: 3,
    tag: 'Music Venue',
    source: 'google',
    count: 51
  },
  {
    venue_id: 3,
    tag: 'Underground',
    source: 'fsq',
    count: 33
  },
  {
    venue_id: 3,
    tag: 'Local DJs',
    source: 'google',
    count: 44
  },
  {
    venue_id: 3,
    tag: 'Pool Table',
    source: 'fsq',
    count: 25
  }
];

const seedVenues = async () => {
  try {
    await Venue.destroy({ where: {} });
    await Venue_Image.destroy({ where: {} });
    await Venue_Tag.destroy({ where: {} });
    await Event.destroy({ where: {} });

    const createdVenues: any = await Venue.bulkCreate(
        allVenues.map(({ events, ...venue }) => venue),
        { returning: true }
    );

    for (let i = 0; i < allVenues.length; i++) {
      const venue = allVenues[i];
      const createdVenue = createdVenues[i];

      if (venue.events) {
        await Event.bulkCreate(
            venue.events.map(event => ({
              ...event,
              venue_id: createdVenue.id
            }))
        );
      }
    }

    const imagesWithIds = venueImages.map(image => ({
      ...image,
      venue_id: createdVenues[image.venue_id - 1].id
    }));

    const tagsWithIds = venueTags.map(tag => ({
      ...tag,
      venue_id: createdVenues[tag.venue_id - 1].id
    }));

    await Venue_Image.bulkCreate(imagesWithIds);
    await Venue_Tag.bulkCreate(tagsWithIds);

    console.log('Successfully seeded venues, images, tags, and events! (^・x・^)');
  } catch (error) {
    console.error('SEEDING VENUES FAILED: ', error);
  }
};

export default seedVenues;