import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';
import { Op } from 'sequelize';


const eventRouter = Router();



eventRouter.get('/search', async (req: any, res: Response) => {
    try {

        // user search input
        const { searchInput } = req.query;

        // find venues in db that match search input
        const dbVenues = await Venue.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchInput}%` // case insensitive
                }
            }
        });

        // FSQ API CALL
        const searchParams = new URLSearchParams({
            query: searchInput,
            limit: '10',
            types: 'place',
        });
        const response = await fetch(
            `https://api.foursquare.com/v3/autocomplete?${searchParams}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${process.env.FOURSQUARE_API_KEY}`,
                },
            }
        );

        // api response data
        const data = await response.json();


        // map response obj to venue model / what front end expects
        const mappedData = data.results.map((result: any) => ({
            name: result.place.name,
            description: '', // need to populate this
            street_address: result.place.location.address,
            zip_code: parseInt(result.place.location.postcode),
            city_name: result.place.location.dma,
            state_name: result.place.location.region,
            fsq_id: result.place.fsq_id,
        }));

        // combine both venue results
        const combinedResults = [...dbVenues, ...mappedData ]
        // de-duplicate
        const uniqueResults = removeDuplicateVenues(combinedResults);
        res.json(uniqueResults);
    } catch (error: any) {
        console.error('Error getting venue data from FSQ API')
        res.sendStatus(500);
    }
})

// remove duplicate venues helper function - used to remove duplicates from user venue autocomplete search
const removeDuplicateVenues = (venues: any) => {
    // object to track venues using name and street address keys
    const seen: any = {};
    // return filtered array without duplicate venues
    return venues.filter((venue: { name: any; street_address: any; }) => {
        // check for duplicates by creating keys (name and street address of venue)
        const key: any = `${venue.name} - ${venue.street_address}`;
        // check if key has been added to our seen object
        if (seen.hasOwnProperty(key)) {
            // if seen object has venue key, return false - do not add to array
            return false;
        // if key is not found in seen, add it and set value to true
        } else {
            seen[key] = true;
            return true;
        }
    })
}



eventRouter.post('/', async (req: any, res: Response) => {
    try {
        const {
            title,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            venue,
            interests,
            category,
            venueDescription,
            streetAddress,
            cityName,
            stateName,
            zipCode
        } = req.body;
        const userId = req.user.id;


        // convert date time
        const start_time = dayjs(`${startDate} ${startTime}`).format('YYYY-MM-DD HH:mm:ss');
        const end_time = dayjs(`${endDate} ${endTime}`).format('YYYY-MM-DD HH:mm:ss');


        // create venue
        const newVenue: any = await Venue.create({
            name: venue,
            description: venueDescription,
            street_address: streetAddress,
            zip_code: zipCode,
            city_name: cityName,
            state_name: stateName,
        });

        // then create the event
        const newEvent: any = await Event.create({
            title,
            start_time,
            end_time,
            description,
            created_by: userId,
        });

        // add venue_id to new venue
        await newEvent.setVenue(newVenue);

        // find matching category
        const assignCategory: any = await Category.findOne({
            where: {name: category}
        });

        // confirm matching category located in db
        if (assignCategory) {
            // add category_id to new event
            await newEvent.setCategory(assignCategory);
        }

        // find matching interests
        const findInterest: any = await Interest.findAll({
            where: {name: interests}
        });

        // confirm matching interests located in db
        if (findInterest) {
            await newEvent.setInterests(findInterest);
        }

        // create chatroom
        const chatroom: any = await Chatroom.create({
            map: null,
            event_id: newEvent.dataValues.id
        });

        // add event__id to new chatroom
        await chatroom.setEvent(newEvent);
        res.sendStatus(200);

    } catch (err: any) {
        console.error('Failed to create event:', err);
        res.sendStatus(500);
    }
});


eventRouter.get('/venue/:fsqId', async (req: any, res: Response) => {
    try {
        const { fsqId } = req.params;

        const response = await fetch(
            `https://api.foursquare.com/v3/places/${fsqId}?fields=fsq_id,name,description,location,tel,website,tips,rating,hours,features,stats,price,photos,tastes,popularity,hours_popular,social_media,categories`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `${process.env.FOURSQUARE_API_KEY}`,
                },
            }
        );

        const venueData = await response.json();


        if (venueData.categories[0].name) {
            console.log(`${venueData.name} Category is ${venueData.categories[0].name}`);
        }

        if (venueData.features.food_and_drink.alcohol.cocktails || venueData.features.food_and_drink.alcohol.cocktails.full_bar) {
            console.log(`${venueData.name} alcohol looks like Cocktails: ${venueData.features.food_and_drink.alcohol.cocktails} \n AND Full Bar: ${venueData.features.food_and_drink.alcohol.full_bar}`);
        }



        if (venueData.rating) {
            console.log(`${venueData.name} Rating: ${venueData.rating}`);
        }

        if (venueData.social_media) {
            console.log(`${venueData.name} Social Media: ${venueData.social_media}`);
        }

        if (venueData.stats.total_ratings) {
            console.log(`${venueData.name} has ${venueData.stats.total_ratings} reviews`);
        }

        if (venueData.tel) {
            console.log(`${venueData.name} can be called at ${venueData.tel}`);
        }

        if (venueData.tastes) {
            console.log(`${venueData.name} is known for ${venueData.tastes}`);
        }

        if (venueData.tips) {
            console.log(`${venueData.name} has tips: ${venueData.tips}`);
        }

        if (venueData.website) {
            console.log(`${venueData.name} visit their website at ${venueData.website}`);
        }




        console.log('Complete venue data:', JSON.stringify(venueData, null, 2));



        res.json({
            name: venueData.name,
            description: venueData.description || 'test',
            street_address: venueData.location.address,
            zip_code: parseInt(venueData.location.postcode),
            city_name: venueData.location.dma,
            state_name: venueData.location.region,
        });

    } catch (error) {
        console.error('Error fetching venue details', error);
        res.sendStatus(500);
    }
})


// get all categories in db to populate form category options
eventRouter.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories: any[] = await Category.findAll();
        const data = categories.map(category => ({
            name: category.dataValues.name,
            id: category.dataValues.id
        }));
        res.status(200).send(data);
    } catch (err: any) {
        console.error('Failed to GET /categories:', err);
        res.sendStatus(500);
    }
});


// get all venues in db
eventRouter.get('/venues', async (req: Request, res: Response) => {
    try {
        const venues = await Venue.findAll();
        const data = venues.map(venue => ({
            name: venue.dataValues.name,
            description: venue.dataValues.description,
            street_address: venue.dataValues.street_address,
            zip_code: venue.dataValues.zip_code,
            city_name: venue.dataValues.city_name,
            state_name: venue.dataValues.state_name,
        }));
        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching venues from DB', error);
        res.sendStatus(500);
    }
})

export default eventRouter;
