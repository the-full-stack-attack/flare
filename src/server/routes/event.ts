import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import User from '../db/models/users';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';
import {Op} from 'sequelize';
import checkForFlares from '../helpers/flares';

import Venue_Tag from "../db/models/venue_tags";
import Venue_Image from '../db/models/venue_images';
import Notification from '../db/models/notifications';

// helper fns
import { removeDuplicateVenues, runApifyActor, getGooglePlaceId, convertFSQPrice, getVenueTags, formatState, getVenueAlcohol, getVenueRating, getPopularTime, formatPhoneNumber, getVenueAccessibility, getVenueReviewCount, getVenueImages, }
    from '../../../utils/venue';
import { type VenueType, type GoogleData, } from '../../types/Venues';


const eventRouter = Router();


eventRouter.get('/search', async (req: any, res: Response): Promise<void> => {
    try {
        // user venue selection from search input field
        const {searchInput, latitude, longitude} = req.query;

        // find venues in db that match search input
        const dbVenues = await Venue.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchInput}%` // case insensitive
                }
            }
        });

        // FSQ API CALL - retrieves venues for autocomplete results
        const searchParams = new URLSearchParams({
            query: searchInput,
            limit: '20',
            types: 'place',
            11: `${latitude}, ${longitude}`,
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


        // map response obj send back only necessary data
        const mappedData = data.results.map((result: any) => ({
            name: result.place.name,
            street_address: result.place.location.address,
            zip_code: parseInt(result.place.location.postcode),
            city_name: result.place.location.dma,
            state_name: result.place.location.region,
            fsq_id: result.place.fsq_id,
        }));
        // combine both venue results
        const combinedResults = [...dbVenues, ...mappedData]
        // de-duplicate
        const uniqueResults = removeDuplicateVenues(combinedResults);
        res.json(uniqueResults);
    } catch (error: any) {
        console.error('Error getting venue data from FSQ API')
        res.sendStatus(500);
    }
})




// create event route
eventRouter.post('/', async (req: any, res: Response): Promise<any> => {
    try {
        const {
            title,
            description,
            startDate,
            startTime,
            endTime,
            venue,
            interests,
            category,
            venueDescription,
            streetAddress,
            stateName,
            zipCode,
            fsq_id
        } = req.body;
        let { cityName } = req.body;
        const userId = req.user.id;

        // convert date time
        const start_time = dayjs(`${startDate} ${startTime}`).format('YYYY-MM-DD HH:mm:ss');
        const end_time = dayjs(`${startDate} ${endTime}`).format('YYYY-MM-DD HH:mm:ss');

        // find or create venue based on user input
        let eventVenue: any;
        if (fsq_id) {
            // if fsq_id exists, use existing venue
            eventVenue = await Venue.findOne({
                where: { fsq_id }
            });

            if (!eventVenue) {
                return res.status(400).json({ error: 'Selected venue not found' });
            }
            cityName = eventVenue.city_name;
        } else {
            // create venue
            eventVenue = await Venue.create({
                name: venue,
                description: venueDescription,
                street_address: streetAddress,
                zip_code: zipCode,
                city_name: cityName,
                state_name: stateName,
            });
        }

        const oneHourBefore = dayjs(`${startDate} ${startTime}`).subtract(1, 'hour').toDate();
        const notification: any = await Notification.create({
            message: `The upcoming event you're attending, ${title}, starts soon at ${dayjs(`${startDate} ${startTime}`).format('h:mm A')}. Hope to see you there.`,
            send_time: oneHourBefore,
        });

        // then create the event
        const newEvent: any = await Event.create({
            title,
            start_time,
            end_time,
            description,
            hour_before_notif: notification.id,
            created_by: userId,
        });

        // add venue_id to event
        await newEvent.setVenue(eventVenue);

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
    let fsqData;
    let googlePlaceId;
    let gData: GoogleData[] = [];
    try {
        // get fsqId needed to make api request
        const {fsqId} = req.params;

        // check if venue already exists in our DB with a fsqId
        const hasFSQId = await Venue.findOne({where: {fsq_id: fsqId}});



        // if no venue with matching fsqId exists - call FSQ API
        if (!hasFSQId) {
            const response = await fetch(
                `https://api.foursquare.com/v3/places/${fsqId}?fields=fsq_id,name,description,location,tel,website,tips,rating,hours,features,stats,price,photos,tastes,popularity,hours_popular,social_media,categories`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `${process.env.FOURSQUARE_API_KEY}`,
                    },
                }
            );
            fsqData = await response.json();
        }

        // check if venue has google place id and it is not null or an empty string
        const hasGoogleId = await Venue.findOne({
            where: {
                fsq_id: fsqId,
                google_place_id: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            }
        });



        // if venue does not have valid google place id
        if (!hasGoogleId) {

            // verify we have necessary fsqData to build our query string
            if (fsqData.name && fsqData.location.formatted_address) {
                // format our api query
                const query = `"${fsqData.name}" "${fsqData.location.formatted_address}"` // wrap in quotes to apply added weight to location and name (avoids server locale having priority weights when searching)
                // send request to google text search api to get google place id
                googlePlaceId = await getGooglePlaceId(query);
                // scrape google my business page for google place id using Apify's SDK
                gData = await runApifyActor(googlePlaceId) as GoogleData[]; //! response time varies from 5-20 seconds
            } else {
                console.error('Error building Google Text Search query string');
            }
        }


        const buildVenue: VenueType = {
            id: null,
            name: fsqData?.name || gData?.[0]?.title || null,
            description: gData?.[0]?.description || fsqData?.description || null,
            category: gData?.[0]?.categoryName || fsqData?.categories[0]?.name || null,
            street_address: gData?.[0]?.street || fsqData?.location?.address || null,
            zip_code: fsqData?.location?.postcode || gData?.[0]?.postalCode || null,
            city_name: fsqData?.location?.dma || gData?.[0]?.city || null,
            state_name: formatState(fsqData, gData),
            phone: formatPhoneNumber(fsqData, gData),
            website: gData?.[0]?.website || fsqData?.website || null,
            rating: getVenueRating(fsqData, gData),
            total_reviews: getVenueReviewCount(fsqData, gData),
            pricing: gData?.[0]?.price || convertFSQPrice(fsqData?.price) || null,
            popularTime: getPopularTime(gData) || null,
            wheelchair_accessible: getVenueAccessibility(gData) || null,
            serves_alcohol: getVenueAlcohol(fsqData, gData),
            fsq_id: fsqId || null,
            google_place_id: googlePlaceId || null,
        };

        // create new venue in db
        const newVenue: any = await Venue.create(buildVenue);


        const nullFields: any = {};
        if (buildVenue.wheelchair_accessible === null) {
            console.log('venue wheelchair is null');
            nullFields.wheelchair_accessible = null;
        }
        // get tags from api responses
        const newTags = getVenueTags(fsqData, gData);

        // if function returned populated tags array
        if (newTags) {
            // create tags
            await Venue_Tag.bulkCreate(newTags.map((tag) => ({
                ...tag,
                venue_id: newVenue.id
            })));
        }

        // get image paths from api res
        const newImages = getVenueImages(fsqData, gData);
        // if function returned populated images array
        if (newImages) {
            // create images
            await Venue_Image.bulkCreate(newImages.map(image => ({
                ...image,
                venue_id: newVenue.id
            })));
        }

        const buildResponse = {
            venue: newVenue,
            nullFields,
        }

        res.json(buildResponse);
    } catch (error) {
        console.error('Error creating venue record in DB', error);
        res.sendStatus(500);
    }
})


eventRouter.put('/venue/:id/accessibility', async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { wheelchair_accessible, userId } = req.body;
        await Venue.update({ wheelchair_accessible }, { where: { id } });

        const user: any = await User.findByPk(userId);
        if (user) {
            await checkForFlares(user, 'Venue Virtuoso');
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating venue accessibility', error);
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
