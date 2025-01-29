import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { ApifyClient } from 'apify-client';

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





const runApifyActor = async (googlePlaceId: any) => {
    try {
        const client = new ApifyClient({
            token: process.env.APIFY_API_KEY,
        })

        const run = await client.actor("compass/google-places-api").call({
            placeIds: [`place_id:${googlePlaceId}`]
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log('LOOK HERE', items);

    } catch (error) {
        console.error('Error running Apify Actor', error);
    }
}

const getGooglePlaceId = async (venueData: any) => {
    if (!venueData.description) {
        try {
            const query = `"${venueData.name}" "${venueData.location.formatted_address}"` // wrap in quotes to apply added weight to location and name (avoids server locale having priority weights when searching)
            const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            const response = await fetch(googlePlacesUrl)
            const data = await response.json();
            const googlePlaceId: any = data.results[0].place_id;
            console.log('google places id: ', googlePlaceId);
            return googlePlaceId;
        } catch (error) {
            console.error('Error getting Google Place Id for Venue');
        }
    }
}



// helper fn to handle missing api data
const getFallbackData = async (venueData: any) => {
    try {

        const test = await getGooglePlaceId(venueData);
        console.log('CHECK HERE', test);
        const test2 = await runApifyActor(test);
        console.log('LETS CHECK: ', test2);



    } catch (error: any) {
        console.error('ERROR IN GETFALLBACKDATA', error);
    }
}


// when venue is created...
// run foursquare search
// get google places id
// run google places search
// scrape google business page


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
        // console.log('FSQ DATA: ', venueData);


        // get google place id
        const googlePlaceId = await getGooglePlaceId(venueData);
        const googleBizData = await runApifyActor(googlePlaceId);



        if (venueData?.features?.amenities) {
            const amenities = venueData.features.amenities;

            const outdoorSeating = amenities?.outdoor_seating || 'OUTDOOR SEATING INFO NOT FOUND';
            const restroom = amenities?.restroom || 'RESTROOM INFO NOT FOUND';
            const parking = amenities?.parking?.parking || 'NO PARKING INFO FOUND';
            const streetParking = amenities?.parking?.street_parking || 'STREET PARKING INFO NOT FOUND';
            const wheelChairAccess = amenities?.wheelchair_accessible || 'WHEELCHAIR ACCESS INFO NOT FOUND';
            const atm = amenities.atm || 'ATM INFO NOT FOUND';


            console.log(`
            AMENITIES DATA LOCATED HERE: \n
            outdoorSeating: ${outdoorSeating} \n
            restroom: ${restroom} \n
            parking: ${parking} \n
            streetParking: ${streetParking} \n
            wheelChairAccess: ${wheelChairAccess} \n
            atm: ${atm} \n
            *-----------------------*
            `)
        } else {
            console.log('*-----------------------* \n SOMETHING HAS GONE SERIOUSLY WRONG IN AMENITIES DATA \n *-----------------------*')
        }

        // if (venueData?.features?.payment) {
        //     Object.entries(venueData.features.payment).forEach(([category, values]: any) => {
        //         Object.entries(values).forEach(([key, value]) => {
        //             console.log(`${venueData.name} accepts specific payments: ${category}.${key}:`, value);
        //         });
        //     });
        // } else {
        //     console.log(`${venueData.name} has no payment options shown`)
        // }



        if (venueData?.features?.attributes) {
            const attributes = venueData.features.attributes;
            const features = venueData.features;

            const cleanliness = attributes?.clean || 'CLEANLINESS NOT FOUND';
            const noise = attributes?.noise || 'NOISE NOT FOUND';
            const moreNoise = attributes?.noisy || 'MORE NOISE NOT FOUND';
            const crowdRating = attributes?.crowded || 'CROWDED NOT FOUND';
            const dressy = attributes?.dressy || 'DRESSY NOT FOUND';
            const glutenFree = attributes?.gluten_free_diet || 'GLUTEN FREE NOT FOUND';
            const isDogFriendly = attributes?.good_for_dogs || 'ISDOGFRIENDLY NOT FOUND';
            const lateNight = attributes?.late_night || 'LATE NIGHT NOT FOUND';
            const serviceQuality = attributes?.service_quality || 'SERVICE QUALITY NOT FOUND';

            const foodAndBevInfo = features?.food_and_drink || 'FOOD AND BEV INFO NOT FOUND';
            const alcohol = features?.food_and_drink.alcohol || 'ALCOHOL INFO NOT FOUND';
            const cocktails = features?.food_and_drink.alcohol.cocktails || 'COCKTAILS NOT FOUND';
            const fullBar = features?.food_and_drink.alcohol.cocktails.full_bar || 'FULL BAR NOT FOUND';
            const paymentType = features?.payment || 'NO PAYMENT TYPE INFO FOUND';

            console.log(`
            ATTRIBUTES DATA LOCATED HERE: \n
            Cleanliness: ${cleanliness} \n
            Noise: ${noise} \n
            moreNoise: ${moreNoise} \n
            crowdRating: ${crowdRating} \n
            Dressy: ${dressy} \n
            glutenFree: ${glutenFree} \n
            isDogFriendly: ${isDogFriendly} \n
            lateNight: ${lateNight} \n
            serviceQuality: ${serviceQuality} \n
            foodAndBevInfo: ${foodAndBevInfo} \n
            alcohol: ${alcohol} \n
            cocktails: ${cocktails} \n
            fullBar: ${fullBar} \n
            paymentTypes: ${paymentType} \n
            *-----------------------*
            `)

        } else {
            console.log('*-----------------------* \n SOMETHING HAS GONE SERIOUSLY WRONG IN ATTRIBUTES DATA \n *-----------------------*');
        };



        if (venueData) {
            const category = venueData?.categories[0]?.name || 'NO CATEGORY FOUND';
            const rating = venueData?.rating || 'NO VENUE RATING FOUND';
            const facebook = venueData?.social_media?.facebook_id || 'NO FACEBOOK FOUND';
            const instagram = venueData?.social_media?.instagram || 'NO INSTAGRAM FOUND';
            const totalRatings = venueData?.stats?.total_ratings || 'NO TOTAL RATINGS FOUND';
            const telephone = venueData?.tel || 'NO TEL NUMBER FOUND';
            const tastes = venueData?.tastes || 'NO TASTES FOUND';
            const tips = venueData?.tips || 'NO TIPS FOUND';
            const website = venueData?.website || 'NO WEBSITE FOUND';
            const hoursPopular = venueData?.hours_popular || 'NO HOURS POPULAR FOUND';
            const price = venueData?.price || 'NO PRICE FOUND';

            console.log(`
            GENERIC DATA LOCATED HERE: \n
            category: ${category} \n
            rating: ${rating} \n
            facebook: ${facebook} \n
            instagram: ${instagram} \n
            totalRatings: ${totalRatings} \n
            telephone: ${telephone} \n
            tastes: ${tastes} \n
            tips: ${tips} \n
            website: ${website} \n
            hoursPopular: ${hoursPopular} \n
            price: ${price} \n
            *-----------------------*
            `)

        } else {
            console.log('*-----------------------* \n SOMETHING HAS GONE SERIOUSLY WRONG IN GENERIC DATA \n *-----------------------*');
        }







        if (venueData?.description) {
            console.log(`${venueData.name} has a description of...${venueData.description}`);
        } else if (!venueData.description) {
            const test = await getFallbackData(venueData);
            console.log('Wcheck!!! ', test);
        }



        // const Venue = database.define('Venue', {
        //
        //     accepted_payments: { type: Sequelize.STRING }, DONE
        //     price_level: { type: Sequelize.INTEGER }, DONE
        //     outdoor_seating: { type: Sequelize.BOOLEAN } DONE,
        //     wheelchair_accessible: { type: Sequelize.BOOLEAN }, DONE
        //     classification: { type: Sequelize.STRING }, DONE
        //     cleanliness: { type: Sequelize.STRING }, DONE
        //     private_parking: { type: Sequelize.BOOLEAN }, DONE
        //     street_parking: { type: Sequelize.BOOLEAN }, DONE
        //     restroom: { type: Sequelize.BOOLEAN }, DONE
        //     atm: { type: Sequelize.BOOLEAN }, DONE
        //     crowded: { type: Sequelize.STRING }, DONE
        //     attire: { type: Sequelize.STRING }, DONE
        //     noisy: { type: Sequelize.STRING }, DONE
        //     facebook_id: { type: Sequelize.STRING },
        //     instagram: { type: Sequelize.STRING },
        //     tips: { type: Sequelize.STRING }, DONE
        // });


        // console.log('Complete venue data:', JSON.stringify(venueData, null, 2));



        res.json({
            name: venueData.name,
            description: venueData.description || 'test',
            street_address: venueData.location.address,
            zip_code: parseInt(venueData.location.postcode),
            city_name: venueData.location.dma,
            state_name: venueData.location.region,
            phone: venueData.tel || 'none found',
            website: venueData.website || 'none found',
            rating: venueData.rating || 'none found',
            reviewCount: venueData?.stats?.total_ratings || 'none found',
            // acceptedPayments:
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
