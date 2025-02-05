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
import * as test from "node:test";

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

        try {
            const query = `"${venueData.name}" "${venueData.location.formatted_address}"` // wrap in quotes to apply added weight to location and name (avoids server locale having priority weights when searching)
            const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            const response = await fetch(googlePlacesUrl)
            const data = await response.json();
            if (!data.results[0].place_id) console.error('Error getting Google Place Id for', query);
            // const id: any = data.results[0].place_id;
            return data.results[0].place_id;
        } catch (error) {
            console.error(`Error getting Google Place Id for Venue. ERROR: ${error}`);
        }

}

const convertFSQPrice = (price: any): string | null => {
    switch (price) {
        case 1:
            return '$1-10';
        case 2:
            return '$10-20';
        case 3:
            return '$20-30';
        case 4:
            return '$30-40';
        case 5:
            return '$40-50';
        default:
            return null;
    }
}


eventRouter.get('/venue/:fsqId', async (req: any, res: Response) => {
    let fsqData;
    let googlePlaceId;
    let gData;
    try {
        // get fsqId needed to make api request
        const { fsqId } = req.params;

        // check if venue already exists in our DB with a fsqId
        const hasFSQId = await Venue.findOne({ where: { fsq_id: fsqId }});

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
                google_place_id: {
                    [Op.and]: {
                        [Op.ne]: null,
                        [Op.ne]: '',
                    }
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
                gData = await runApifyActor(googlePlaceId); //! response time varies from 5-20 seconds
            } else {
                console.error('Error building Google Text Search query string');
            }
        };

        const buildVenue = {
                name: fsqData?.name || gData?[0]?.title || null,
                description: gData?.description || fsqData?.description || null,
                category: getVenueCategory(/* pass in nested data */test, test2),
                street_address: gData?.[0].street || fsqData?.location?.address || null,
                city_name: fsqData?.location?.dma || gData?.[0].city || null,
                state_name: getVenueState(test, test2),
                phone: getVenuePhone(test, test2),
                website: gData?.[0].website || fsqData?.website || null,
                rating: getVenueRating(test, test2),
                total_reviews: getVenueReviewCount(test, test2),
                price_range: getVenuePricing(test, test2),
                outdoor_seating: getVenueOutdoorSeating(test, test2),
                peak_hour: getVenuePeakHours(test, test2),
                wheelchair_accessible: getVenueAccessibility(test, test2),
                restroom: getVenueRestroom(test, test2),
                ...getVenueParking(test, test2),
                serves_alcohol: getVenueAlcohol(fsqData, gData),
                cleanliness: getVenueCleanliness(test, test2),
                crowded: getVenueCrowdiness(test, test2),
                noise_level: getVenueNoiseLvl(test, test2),
                service_quality: getVenueServiceQual(test, test2),

                fsq_id: fsqId || null,
                google_place_id: googlePlaceId || null,
            }
        }







        const getVenueReviewCount = (fsqData, gData) => {
        let count;
        if (!fsqData?.stats?.total_ratings && !gData?[0]?.reviewsCount) {
            count = fsqData.stats.total_ratings;
        } else if (gData?[0].revi)


        const getVenueCategory = (fsqData, gData) => {
            if (gData?.[0]?.description) {
                return gData.[0].description;
            } else if (fsqData?.description) {
                return fsqData.description;
            } else {
                return null;
            }
        };




        const getVenueCity = (fsqData, gData) => {

        }

        const getVenueState = (fsqData, gData) => {

        }

        const getVenuePhone = (fsqData, gData) => {

        }



        const getVenueRating = (fsqData, gData) => {
            if (fsqData?.rating && gData[0]?.totalScore) {
                const fsqRating = fsqData?.rating * 0.5; // convert to same range as gData
                const gRating = gData[0]?.totalScore;
                return Number((fsqRating + gRating) / 2).toFixed(1); // return value matching gData rating format
            } else if (fsqData?.rating && !gData[0]?.totalScore) {
                const fsqRating = fsqData?.rating * 0.5;
                return Number(fsqRating).toFixed(1);
            } else if (!fsqData?.rating && gData[0]?.totalScore) {
                return gData[0].totalScore;
            } else {
                return null;
            }
        }

        const getVenueReviews = (fsqData, gData) => {

        }

        const getVenuePricing = (fsqData, gData) => {

        }

        const getVenueOutdoorSeating = (fsqData, gData) => {

        }

        const getVenuePeakHours = (fsqData, gData) => {

        }

        const getVenueAccessibility = (fsqData, gData) => {

        }

        const getVenueRestroom = (fsqData, gData) => {

        }

        const getVenuePrivateParking = (fsqData, gData) => {

        }

        const getVenueStreetParking = (fsqData, gData) => {

        }

        const getVenueAlcohol = (fsqData, gData) => {
            // init array of search queries
            const searchQueries = ['Cocktail', 'Bar', 'cocktails', 'full_bar', 'Great cocktails', 'Great wine list', 'Alcohol', 'Beer', 'Cocktails', 'Hard liquor', 'Wine', 'Bar onsite', ];
            // direct search for potential quick exit
            if (searchQueries.includes(fsqData?.categories?.[0].short_name) || gData[0]?.categories.includes('Bar')) return true;
            // create obj of kvp's from objs that contain relevant data
            const alcoholData = {
                ...(fsqData?.features?.food_and_drink?.alcohol || {}),
                ...(gData[0]?.additionalInfo?.Highlights || {}),
                ...(gData[0]?.additionalInfo?.Offerings || {}),
                ...(gData[0]?.additionalInfo?.Amenities || {}),
                ...(fsqData?.categories?.[0] || {}),
            }
            // iterate through obj searching for a searchQuery that has true value
            for (let key in alcoholData) {
                if (searchQueries.includes(key) && alcoholData[key] === true) {
                    return true;
                }
            }
            return null;
        };

        const getVenueCleanliness = (fsqData, gData) => {

        }

        const getVenueCrowdiness = (fsqData, gData) => {

        }

        const getVenueNoiseLvl = (fsqData, gData) => {

        }

        const getVenueServiceQual = (fsqData, gData) => {

        }

        const getVenueImg = (fsqData, gData) => {

        }













    }

})







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


        if (venueData?.price) {
            console.log('about to convert veneuData.price');
            venueData.price = convertFSQPrice(venueData.price);
            console.log('just converted', venueData.price);
        };



        // only get google data if venue doesnt exist or venue doesnt have a google place id
        if (!venueHasData || !(venueHasData as any).google_place_id) {
            googlePlaceId = await getGooglePlaceId(venueData); // google text search api
            gData = await runApifyActor(googlePlaceId); // warning: response can take 5-15 seconds
        }
        console.log('-----START OF FSQ DATA HERE ------');
        console.log(JSON.stringify(venueData, null, 2));
        console.log('-----START OF GDATA HERE------')
        console.log(JSON.stringify(gData, null, 2));

        const [venue, created] = await Venue.findOrCreate({
            where: { fsq_id: fsqId },
            defaults: {
                name: venueData?.name || null,
                description: null,
                street_address: venueData?.location?.address || null,
                zip_code: venueData?.location?.postcode || null,
                city_name: venueData?.location?.locality || null,
                state_name: venueData?.location?.region || null,
                phone: venueData?.tel || null,
                website: venueData?.website || null,
                rating: venueData?.rating || null,
                total_reviews: venueData?.stats?.total_ratings || 0,
                price_range: venueData?.price ? venueData.price : null,
                fsq_id: fsqId,
                google_place_id: null,
                outdoor_seating: venueData?.features?.amenities?.outdoor_seating || null,
                peak_hour: null,
                wheelchair_accessible: venueData?.features?.amenities?.wheelchair_accessible || null,
                restroom: venueData?.features?.amenities?.restroom || null,
                private_parking: null,
                street_parking: null,
                serves_alcohol: venueData?.features?.food_and_drink?.alcohol?.beer ||
                    venueData?.features?.food_and_drink?.alcohol?.cocktails ||
                    venueData?.features?.food_and_drink?.alcohol?.full_bar || null,
                cleanliness: venueData?.features?.attributes?.clean || null,
                crowded: venueData?.features?.attributes?.crowded || null,
                noise_level: venueData?.features?.attributes?.noisy || null,
                service_quality: venueData?.features?.attributes?.service_quality || null,
                img: venueData?.photos?.[0] ? `${venueData.photos[0].prefix}original${venueData.photos[0].suffix}` : null,
            }
        }) as any;



        // wait for gData to populate and then update venue
        if (gData && gData[0]) {
            await venue.update({
                name: venueData?.name || gData?.[0]?.title || venue.name,
                description: gData?.[0]?.description || venue.description,
                street_address: venueData?.location?.address || gData?.[0]?.street || venue.street_address,
                zip_code: venueData?.location?.postcode || gData?.[0]?.postalCode || venue.zip_code,
                city_name: venueData?.location?.locality || gData?.[0]?.city || venue.city_name,
                state_name: venueData?.location?.region || gData?.[0]?.state || venue.state_name,
                phone: venueData?.tel || gData?.[0]?.phone || venue.phone,
                website: venueData?.website || gData?.[0]?.website || venue.website,
                rating: gData?.[0]?.totalScore || venueData?.rating || venue.rating,
                total_reviews: gData?.[0]?.reviewsCount || venueData?.stats?.total_ratings || venue.total_reviews,
                price_range: gData?.[0]?.price || (venueData?.price ? `Level ${venueData.price}` : null) || venue.price_range,
                google_place_id: googlePlaceId,
                accepted_payments: (gData?.[0]?.additionalInfo?.Payments?.[0]?.['Credit cards'] && 'Credit cards') || (gData?.[0]?.additionalInfo?.Payments?.[1]?.['Debit cards'] && 'Debit cards') || (gData?.[0]?.additionalInfo?.Payments?.[2]?.['NFC mobile payments'] && 'NFC mobile payments') || venue.accepted_payments,
                outdoor_seating: gData?.[0]?.additionalInfo?.['Service options']?.[0]?.['Outdoor seating'] || venueData?.features?.amenities?.outdoor_seating || venue.outdoor_seating,
                wheelchair_accessible: gData?.[0]?.additionalInfo?.Accessibility?.[0]?.['Wheelchair accessible entrance'] || gData?.[0]?.additionalInfo?.Accessibility?.[1]?.['Wheelchair accessible restroom'] || venue.wheelchair_accessible,
                restroom: gData?.[0]?.additionalInfo?.Amenities?.[1]?.['Restroom'] || gData?.[0]?.additionalInfo?.Amenities?.[0]?.['Gender-neutral restroom'] || venue.restroom,
                private_parking: gData?.[0]?.additionalInfo?.Parking?.[2]?.['Paid parking lot'] || gData?.[0]?.additionalInfo?.Parking?.[1]?.['Paid parking garage'] || venue.private_parking,
                street_parking: gData?.[0]?.additionalInfo?.Parking?.[0]?.['Free street parking'] || gData?.[0]?.additionalInfo?.Parking?.[3]?.['Paid street parking'] || venue.street_parking,
                serves_alcohol: venueData?.features?.food_and_drink?.alcohol?.beer || venueData?.features?.food_and_drink?.alcohol?.cocktails || venueData?.features?.food_and_drink?.alcohol?.full_bar || gData?.[0]?.additionalInfo?.Offerings?.[0]?.['Alcohol'] || venue.serves_alcohol,
                cleanliness: (venueData?.tastes?.includes('clean') ? true : null) || venueData?.features?.attributes?.clean || venue.cleanliness,
                crowded: (venueData?.features?.attributes?.dates_popular === "Average") || venue.crowded,
                noise_level: venueData?.features?.attributes?.noisy || venue.noise_level,
                service_quality: venueData?.features?.attributes?.service_quality || venue.service_quality,
                img: (venueData?.photos?.[0] ? `${venueData.photos[0].prefix}original${venueData.photos[0].suffix}` : null) || gData?.[0]?.imageUrl || venue.img
            });
        }


        if (venueData?.features?.amenities?.outdoor_seating)



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
