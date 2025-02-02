import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { ApifyClient } from 'apify-client';
import Venue_Tag from "../db/models/venue_tags";
import Notification from '../db/models/notifications';

const eventRouter = Router();


eventRouter.get('/search', async (req: any, res: Response) => {
    try {
        // user venue selection from search input field
        const { searchInput } = req.query;

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


// create event route
eventRouter.post('/', async (req: any, res: Response) => {
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
            cityName,
            stateName,
            zipCode,
        } = req.body;
        const userId = req.user.id;


        // convert date time
        const start_time = dayjs(`${startDate} ${startTime}`).format('YYYY-MM-DD HH:mm:ss');
        const end_time = dayjs(`${startDate} ${endTime}`).format('YYYY-MM-DD HH:mm:ss');


        // create venue
        const newVenue: any = await Venue.create({
            name: venue,
            description: venueDescription,
            street_address: streetAddress,
            zip_code: zipCode,
            city_name: cityName,
            state_name: stateName,
        });


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




// apify worker/actor that receives a Google Place Id and returns Google Business Data (scrapes data from Google My Business) - uses the Apify SDK
const runApifyActor = async (googlePlaceId: any) => {
    try {
        const client = new ApifyClient({
            token: process.env.APIFY_API_KEY,
        })

        // calls our Apify actor 'compass/google-places-api'
        const run = await client.actor("compass/google-places-api").call({
            // each Apify actor will receive different inputs - these are specific to our Apify actor
            placeIds: [`place_id:${googlePlaceId}`]
        });

        // after our Apify actor runs, it returns various meta data - including defaultDatasetId - the results of our previous call
        const { items } = await client.dataset(run.defaultDatasetId).listItems(); // retrieve results
        return items; // return results

    } catch (error) {
        console.error('Error running Apify Actor', error);
        return error;
    }
}

// google text search api request - receives venue name and street address, returns the goooglePlaceId
const getGooglePlaceId = async (venueData: any) => {
    if (!venueData.description) {
        try {
            const query = `"${venueData.name}" "${venueData.location.formatted_address}"` // wrap in quotes to apply added weight to location and name (avoids server locale having priority weights when searching)
            const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            const response = await fetch(googlePlacesUrl)
            const data = await response.json();
            const googlePlaceId: any = data.results[0].place_id;
            return googlePlaceId;
        } catch (error) {
            console.error(`Error getting Google Place Id for Venue. ERROR: ${error}`);
        }
    }
}





eventRouter.get('/venue/:fsqId', async (req: any, res: Response) => {
    try {
        const { fsqId } = req.params;

        const venueHasData = await Venue.findOne({ where: { fsq_id: fsqId }});
        let venueData: any;
        let googlePlaceId;
        let gData: any;


        // if venue doesnt have fsq_id - fetch data from foursquare api
        if (!venueHasData) {
            const response = await fetch(
                `https://api.foursquare.com/v3/places/${fsqId}?fields=fsq_id,name,description,location,tel,website,tips,rating,hours,features,stats,price,photos,tastes,popularity,hours_popular,social_media,categories`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `${process.env.FOURSQUARE_API_KEY}`,
                    },
                }
            );
            venueData = await response.json();
        }

        // only get google data if venue doesnt exist or venue doesnt have a google place id
        if (!venueHasData || !(venueHasData as any).google_place_id) {
            googlePlaceId = await getGooglePlaceId(venueData); // google text search api
            gData = await runApifyActor(googlePlaceId); // warning: response can take 5-15 seconds
        }


        const [venue, created] = await Venue.findOrCreate({
            where: { fsq_id: fsqId },
            defaults: {
                name: venueData?.name || gData.title || null,
                description: gData?.description || null,
                street_address: venueData?.location?.address || gData?.street || null,
                zip_code: venueData?.location?.postcode || gData?.postalCode || null,
                city_name: venueData?.location?.locality || gData?.city || null,
                state_name: venueData?.location?.region || gData?.state || null,
                phone: gData?.phone || venueData?.tel || null,
                website: venueData?.website || gData?.website || null,
                rating: gData?.totalScore || venueData?.rating || null,
                total_reviews: gData?.reviewsCount || venueData?.stats?.total_ratings || 0,
                price_range: gData?.price || (venueData?.price ? `Level ${venueData.price}` : null),
                fsq_id: fsqId,
                google_place_id: googlePlaceId,
                outdoor_seating: gData?.additionalInfo?.['Service options']?.['Outdoor seating'] || venueData?.features?.amenities?.outdoor_seating || null,
                peak_hour: null,
                wheelchair_accessible: gData?.additionalInfo?.wheelchair_accessible_entrance || gData?.additionalInfo?.wheelchair_accessible_restroom || gData?.additionalInfo?.wheelchair_accessible_seating || venueData?.features?.amenities?.wheelchair_accessible || null,
                restroom: gData?.additionalInfo?.amenities?.restroom || venueData?.features?.amenities?.restroom || null,
                private_parking: gData?.additionalInfo?.parking?.paid_parking_lot || gData?.additionalInfo?.parking?.free_parking_lot || null,
                street_parking: gData?.additionalInfo?.parking?.free_street_parking || gData?.additionalInfo?.parking?.paid_street_parking || null,
                serves_alcohol: gData?.additionalInfo?.offerings?.alcohol || gData?.additionalInfo?.offerings?.beer || gData?.additionalInfo?.offerings?.cocktails || venueData?.features?.food_and_drink?.alcohol?.cocktails || venueData?.features?.food_and_drink?.alcohol?.full_bar || null,
                cleanliness: venueData?.features?.attributes?.clean || null,
                crowded: venueData?.features?.attributes?.crowded || null,
                noise_level: venueData?.features?.attributes?.noisy || null,
                service_quality: venueData?.features?.attributes?.service_quality || null,
                img: venueData?.photos?.[0] && venueData.photos[0].prefix && venueData.photos[0].suffix ? `${venueData.photos[0].prefix}original${venueData.photos[0].suffix}` : gData[0]?.imageUrl || null,
            }
        }) as any;


        // convert google popular time histogram into most popular day and hour - may eventually want to change this to save more data in the future
        if (gData?.popularTimesHistogram) {
            let mostBusy = 0;
            let peakDay: any = '';
            let peakHour = 0;

            for (const day in gData.popularTimesHistogram) {
                // get array of hours for current day
                const hours = gData.popularTimesHistogram[day]
                // iterate through each hour in day
                hours.forEach((hourData: any) => {
                    // update variables
                    if (hourData.occupancyPercent > mostBusy) {
                        mostBusy = hourData.occupancyPercent;
                        peakDay = day;
                        peakHour = hourData.hour;
                    }
                })
            }
            const date = dayjs().day(peakDay).hour(peakHour)
            venue.peak_hour = date.toDate();
        }


        if (venueData?.tastes || gData?.reviewsTags) {

            // collect tags and # of occurrences from foursquare response
            if (venueData?.tastes && venueData.tastes !== null) {
                for (const tag of venueData.tastes) {
                    const existingTag = await Venue_Tag.findOne({
                        where: {
                            venue_id: venue.id,
                            tag: tag,
                        }
                    }) as any;
                    // if tag exists increment count
                    if (existingTag) {
                        await existingTag.update({
                            count: existingTag.count + 1
                        })
                    } else {
                        // init tag with count 1
                        await Venue_Tag.create({
                            venue_id: venue.id,
                            tag: tag.title,
                            source: 'foursquare', // keep track of source for historical comparisons between data
                            count: 1,
                        })
                    }
                }
            }
            // add google tags
            if (gData?.reviewsTags && venueData !== null) {
                for (const tag of gData.reviewsTags) {
                    await Venue_Tag.create({
                        venue_id: venue.id,
                        tag: tag.title,
                        source: 'google', // keep track of source for historical comparisons between data
                        count: tag.count // google gives us the count
                    });
                }
            }
        }

        // return all data back to fe - venue + venue tags
        const fullVenueData = await Venue.findOne({
            where: { id: venue.id },
            include: [
                { model: Venue_Tag },
            ]
        });
        res.json(fullVenueData); // send back data
    } catch (error) {
        console.error(`Error fetching data for Venue from APIs. ERROR: ${error}`);
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


// // get all venues in db
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
