import Venue from '../models/venues';

const allVenues = [
    'The Rabbit Hole',
    'Snake & Jakes',
    'The Saint',
    'Poor Boys',
    'Your Moms House',
];

type VenueData = {
    name: string;
};

const venueObjects = allVenues.map((venue) => {
    const venueVal: VenueData = {
        name: venue,
    };

    return venueVal;
});

const seedVenues = async () => {
    try {
        const venues = await Venue.findAll();
        for (const venue of venues) {
            await venue.destroy();
        }
        await Venue.bulkCreate(venueObjects);
        console.log('Seeding Venues... (^・x・^)');
    } catch (error: unknown) {
        console.error('SEEDING VENUES FAILED: ', error);
    }
};

// noinspection JSIgnoredPromiseFromCall
seedVenues();