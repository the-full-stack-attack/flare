import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';

const eventRouter = Router();


eventRouter.get('/search', async (req: any, res: Response) => {
    try {


        const { searchInput } = req.query;
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
        console.log('what the resonse is: ', response);

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Error getting venue data from FSQ API')
        res.sendStatus(500);
    }
})

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
