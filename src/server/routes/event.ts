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
        console.log('FSQ DATA: ', venueData);


        // get google place id
        const googlePlaceId = await getGooglePlaceId(venueData);
        const googleBizData = await runApifyActor(googlePlaceId);





        // // console.log('LOOK FOR THE LOCATION: ', venueData);
        // if (venueData?.description) {
        //     console.log(`${venueData.name} has a description of...${venueData.description}`);
        // } else if (!venueData.description) {
        //     const test = await getFallbackData(venueData);
        //     console.log('Wcheck!!! ', test);
        // }
        //
        //
        // if (venueData.categories[0]?.name) {
        //     console.log(`${venueData.name} Category is something like a... ${venueData.categories[0].name} ?`);
        // } else {
        //     console.log(`${venueData.name} is missing category[0].name`)
        // }
        //
        // if (venueData.features?.food_and_drink?.alcohol?.cocktails || venueData.features?.food_and_drink?.alcohol?.cocktails?.full_bar) {
        //     console.log(`${venueData.name} alcohol looks like Cocktails: ${venueData.features.food_and_drink.alcohol.cocktails} \n AND Full Bar: ${venueData.features.food_and_drink.alcohol.full_bar}`);
        // } else {
        //     console.log(`${venueData.name} is missing alcohol info`)
        // }
        //
        //
        //
        //
        // if (venueData?.rating) {
        //     console.log(`${venueData.name} Rating: ${venueData.rating}`);
        // } else {
        //     console.log(`${venueData.name} is missing rating`)
        // }
        //
        // if (venueData?.social_media?.facebook_id) {
        //     console.log(`${venueData.name} Facebook ID: ${venueData.social_media.facebook_id}`);
        // } else {
        //     console.log(`${venueData.name} is missing facebook id`)
        // }
        //
        // if (venueData?.social_media?.instagram) {
        //     console.log(`${venueData.name} has Instagram: @${venueData.social_media.instagram}`)
        // } else {
        //     console.log(`${venueData.name} is missing instagram`)
        // }
        //
        //
        // if (venueData?.stats?.total_ratings) {
        //     console.log(`${venueData.name} has ${venueData.stats.total_ratings} reviews`);
        // } else {
        //     console.log(`${venueData.name} is missing reviews `)
        // }
        //
        // if (venueData?.tel) {
        //     console.log(`${venueData.name} can be called at ${venueData.tel}`);
        // } else {
        //     console.log(`${venueData.name} is missing telephone number`)
        // }
        //
        // if (venueData?.tastes) {
        //     console.log(`${venueData.name} is known for ${venueData.tastes}`);
        // } else {
        //     console.log(`${venueData.name} is not known for shit!`)
        // }
        //
        // if (venueData?.tips) {
        //     venueData.tips.forEach((tip: any) => {
        //         console.log(`${venueData.name} has a ${tip.text}`)
        //     })
        // } else {
        //     console.log(`${venueData.name} has no tips :(`)
        // }
        //
        // if (venueData?.website) {
        //     console.log(`${venueData.name} visit their website at ${venueData.website}`);
        // } else {
        //     console.log(`${venueData.name} has no website`)
        // }
        //
        // if (venueData?.hours_popular) {
        //     console.log(`${venueData.name} is popular at specific times`);
        // } else {
        //     console.log(`${venueData.name} is not popular at any specific times...weird`)
        // }
        //
        // if (venueData?.stats?.total_ratings) {
        //     console.log(`${venueData.name} has ${venueData.stats.total_ratings} reviews`);
        // } else {
        //     console.log(`${venueData.name} has no reviews`)
        // }
        //
        //
        //
        // if (venueData?.price) {
        //     console.log(`${venueData.name} has pricing rated at ${venueData.price}`);
        // } else {
        //     console.log(`${venueData.name} has no price rating`)
        // }
        //
        // if (venueData?.features?.payment) {
        //     Object.entries(venueData.features.payment).forEach(([category, values]: any) => {
        //         Object.entries(values).forEach(([key, value]) => {
        //             console.log(`${venueData.name} accepts specific payments: ${category}.${key}:`, value);
        //         });
        //     });
        // } else {
        //     console.log(`${venueData.name} has no payment options shown`)
        // }
        //
        //
        // if (venueData?.features?.attributes?.clean) {
        //     console.log(`${venueData.name} cleanliness is...${venueData.features.attributes.clean}`);
        // } else {
        //     console.log(`${venueData.name} has no cleanliness info`)
        // }
        //
        // if (venueData?.features?.attributes?.noise) {
        //     console.log(`${venueData.name} has a noisy rating of...${venueData.features.attributes.noisy}`);
        // } else {
        //     console.log(`${venueData.name} has no noise rating`)
        // }
        //
        // if (venueData?.features?.attributes?.crowded) {
        //     console.log(`${venueData.name} has a crowdy rating of...${venueData.features.attributes.crowded}`);
        // } else {
        //     console.log(`${venueData.name} has no crowd rating`)
        // }
        //
        // if (venueData?.features?.attributes?.dressy) {
        //     console.log(`${venueData.name} has an attire scale of...${venueData.features.attributes.dressy}`);
        // } else {
        //     console.log(`${venueData.name} has no attire scale`)
        // }
        //
        //
        // if (venueData?.features?.amenities?.atm) {
        //     console.log(`{venueData.name} does it have an ATM...? ${venueData.features.amenities.atm}`);
        // } else {
        //     console.log(`${venueData.name} has no atm info`)
        // }
        //
        // if (venueData?.features?.amenities?.wheelchair_accessible) {
        //     console.log(`{venueData.name} is it wheelchair accessible...? ${venueData.features.amenities.wheelchair_accessible}`);
        // } else {
        //     console.log(`${venueData.name} has no wheelchair accessibility info`)
        // }
        //
        // if (venueData?.features?.amenities?.parking?.parking) {
        //     console.log(`${venueData.name} has regular parking: ${venueData.features.amenities.parking.parking}`);
        // } else {
        //     console.log(`${venueData.name} has no parking info for reg`)
        // }
        //
        // if (venueData?.features?.amenities?.parking?.street_parking) {
        //     console.log(` ${venueData.name} has street parking: ${venueData.features.amenities.parking.street_parking}`)
        // } else {
        //     console.log(`${venueData.name} has no street parking info`)
        // }
        //
        // if (venueData?.features?.amenities?.restroom) {
        //     console.log(`${venueData.name} has restroom? ${venueData.features.amenities.restroom}`);
        // } else {
        //     console.log(`${venueData.name} has no restroom info`)
        // }
        //
        // if (venueData?.features?.amenities?.outdoor_seating) {
        //     console.log(`${venueData.name} has outdoor seating? ${venueData.features.amenities.outdoor_seating}`);
        // } else {
        //     console.log(`${venueData.name} has no outdoord seating info`)
        // }
        //
        // if (venueData?.features?.attributes?.good_for_dogs) {
        //     console.log(`${venueData.name} has dog info that says its ${venueData.features.attributes.good_for_dogs}`);
        // } else {
        //     console.log(`${venueData.name} has no dog info`)
        // }
        //
        // // additional checks for data validation
        // if (venueData?.features?.attributes?.clean) {
        //     console.log(`${venueData.name} in attributes has cleanliness score of: ${venueData.features.attributes.clean}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no cleanliness score`)
        // }
        //
        // if (venueData?.features?.attributes?.crowded) {
        //     console.log(`${venueData.name} in attributes has crowded score of: ${venueData.features.attributes.clean}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no crowd score`)
        // }
        //
        // if (venueData?.features?.attributes?.dressy) {
        //     console.log(`${venueData.name} in attributes has dressy score of: ${venueData.features.attributes.dressy}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no dressy score`)
        // }
        //
        // if (venueData?.features?.attributes?.gluten_free_diet) {
        //     console.log(`${venueData.name} in attributes has gluten free diet: ${venueData.features.attributes.gluten_free_diet}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no gluten free diet info`)
        // }
        //
        //
        // if (venueData?.features?.attributes?.good_for_dogs) {
        //     console.log(`${venueData.name} in attributes has good for dogs score: ${venueData.features.attributes.good_for_dogs}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no good for dogs info`)
        // }
        //
        // if (venueData?.features?.attributes?.late_night) {
        //     console.log(`${venueData.name} in attributes has late night score of: ${venueData.features.attributes.late_night}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no late night score`)
        // }
        //
        // if (venueData?.features?.attributes?.noisy) {
        //     console.log(`${venueData.name} has noisy score of: ${venueData.features.attributes.nosy}`)
        // } else {
        //     console.log(`${venueData.name} in attributes has no noisy score`)
        // }
        //
        // if (venueData?.features?.attributes?.service_quality) {
        //     console.log(`${venueData.name} has service quality score of ${venueData.features.attributes.service_quality}`);
        // } else {
        //     console.log(`${venueData.name} in attributes has no service quality score`)
        // }






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
