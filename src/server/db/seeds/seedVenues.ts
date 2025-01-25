import Venue from '../models/venues';

const allVenues = [
    {
        name: 'The Rabbit Hole',
        description: 'Danny Devitos favorite bar in nola',
        street_address: '123 Sunny St.',
        zip_code: 70115,
        city_name: 'New Orleans',
        state_name: 'LA'
    },
    {
        name: 'Snake & Jakes',
        description: 'The love of my life',
        street_address: '123 Love St.',
        zip_code: 70115,
        city_name: 'New Orleans',
        state_name: 'LA'
    },
    {
        name: 'The Saint',
        description: 'For the heathens',
        street_address: '123 LGD Ave.',
        zip_code: 70130,
        city_name: 'New Orleans',
        state_name: 'LA'
    },
    {
        name: 'Poor Boys',
        description: 'Disgusting 5AM spot',
        street_address: '1328 Something Ave',
        zip_code: 70116,
        city_name: 'New Orleans',
        state_name: 'LA'
    },
    {
        name: 'Your Moms House',
        description: 'My favorite place to visit!',
        street_address: '123 Main St',
        zip_code: 70130,
        city_name: 'New Orleans',
        state_name: 'LA'
    }
];

type VenueData = {
    name: string;
    description: string;
    street_address: string;
    zip_code: number;
    city_name: string;
    state_name: string;
};



const seedVenues = async () => {
    try {
        const venues = await Venue.findAll();
        for (const venue of venues) {
            await venue.destroy();
        }
        await Venue.bulkCreate(allVenues);
        console.log('Seeding Venues... (^・x・^)');
    } catch (error: unknown) {
        console.error('SEEDING VENUES FAILED: ', error);
    }
}

// noinspection JSIgnoredPromiseFromCall
seedVenues();