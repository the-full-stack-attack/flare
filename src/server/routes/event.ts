import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import dayjs from 'dayjs';
import {Op} from 'sequelize';
import {ApifyClient} from 'apify-client';
import Venue_Tag from "../db/models/venue_tags";
import Venue_Image from '../db/models/venue_images';
import Notification from '../db/models/notifications';

const eventRouter = Router();


eventRouter.get('/search', async (req: any, res: Response) => {
    try {
        // user venue selection from search input field
        const {searchInput} = req.query;

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
        const combinedResults = [...dbVenues, ...mappedData]
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
        const {items} = await client.dataset(run.defaultDatasetId).listItems(); // retrieve results
        return items; // return results

    } catch (error) {
        console.error('Error running Apify Actor', error);
        return error;
    }
}

// google text search api request - receives venue name and street address, returns the goooglePlaceId
const getGooglePlaceId = async (query: any) => {

    try {
        // const query = `"${venueData.name}" "${venueData.location.formatted_address}"` // wrap in quotes to apply added weight to location and name (avoids server locale having priority weights when searching)
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
    if (typeof price === 'string' && price.startsWith('$')) {
        return price;
    }
    const formatPrice = Number(price);
    switch (formatPrice) {
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


type VenueTag = {
    tag: string;
    source: 'google' | 'foursquare';
    count: number;
}

// collect venue hashtags from various locations in api res - saves the # of occurrences for each tag and combines them across data providers
const getVenueTags = (fsqData: FSQData, gData: GoogleData[]): VenueTag[] | null => {
    let tags: Array<VenueTag> = [];

    if (fsqData?.tastes) {
        fsqData.tastes.forEach(taste => {
            let exists = false;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].tag === taste.toLowerCase()) {
                    tags[i].count += 1;
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                tags.push({
                    tag: taste.toLowerCase(),
                    source: 'foursquare',
                    count: 1
                });
            }
        });
    }


    if (gData?.[0]?.reviewsTags) {
        gData[0].reviewsTags.forEach(reviewTag => {
            let exists = false;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].tag === reviewTag.title.toLowerCase()) {
                    tags[i].count += reviewTag.count;
                    exists = true;
                }
            }
            if (!exists) {
                tags.push({
                    tag: reviewTag.title.toLowerCase(),
                    source: 'google',
                    count: reviewTag.count
                });
            }
        });
    }

    if (gData?.[0]?.placesTags) {
        gData[0].placesTags.forEach(placeTag => {
            let exists = false;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].tag === placeTag.title.toLowerCase()) {
                    tags[i].count += placeTag.count;
                    exists = true;
                }
            }
            if (!exists) {
                tags.push({
                    tag: placeTag.title.toLowerCase(),
                    source: 'google',
                    count: placeTag.count
                });
            }
        });
    }

    return tags.length > 0 ? tags : null;
}


const formatState = (fsqData: FSQData, gData: GoogleData[]) => {

    let input;

    if (fsqData?.location?.region) {
        input = fsqData.location.region;
    } else if (gData[0]?.state) {
        input = gData[0]?.state;
    } else {
        return null;
    }



    const states: Record<string, string> = {
        'arizona': 'AZ',
        'alabama': 'AL',
        'alaska': 'AK',
        'arkansas': 'AR',
        'california': 'CA',
        'colorado': 'CO',
        'connecticut': 'CT',
        'delaware': 'DE',
        'florida': 'FL',
        'georgia': 'GA',
        'hawaii': 'HI',
        'idaho': 'ID',
        'illinois': 'IL',
        'indiana': 'IN',
        'iowa': 'IA',
        'kansas': 'KS',
        'kentucky': 'KY',
        'louisiana': 'LA',
        'maine': 'ME',
        'maryland': 'MD',
        'massachusetts': 'MA',
        'michigan': 'MI',
        'minnesota': 'MN',
        'mississippi': 'MS',
        'missouri': 'MO',
        'montana': 'MT',
        'nebraska': 'NE',
        'nevada': 'NV',
        'new hampshire': 'NH',
        'new jersey': 'NJ',
        'new mexico': 'NM',
        'new york': 'NY',
        'north carolina': 'NC',
        'north dakota': 'ND',
        'ohio': 'OH',
        'oklahoma': 'OK',
        'oregon': 'OR',
        'pennsylvania': 'PA',
        'rhode island': 'RI',
        'south carolina': 'SC',
        'south dakota': 'SD',
        'tennessee': 'TN',
        'texas': 'TX',
        'utah': 'UT',
        'vermont': 'VT',
        'virginia': 'VA',
        'washington': 'WA',
        'west virginia': 'WV',
        'wisconsin': 'WI',
        'wyoming': 'WY'
    };

    const normalizedInput = input.toLowerCase().trim();
    if (Object.values(states).includes(input)) return input;
    return states[normalizedInput] || null
}
type FSQData = {
    name?: string;
    description?: string;
    location?: {
        region?: string;
        address?: string;
        formatted_address?: string;
        dma?: string;
    };
    categories?: Array<{
        name: string;
        short_name: string;
    }>;
    tel?: string;
    website?: string;
    rating?: number;
    stats?: {
        total_ratings?: number;
    };
    price?: number | string;
    photos?: Array<{
        prefix: string;
        suffix: string;
    }>;
    tastes?: string[];
    features?: {
        food_and_drink?: {
            alcohol?: Record<string, boolean>;
        };
    };
    additionalInfo?: {
        Accessibility: Array<Record<string, boolean>>;
    };
};

type GoogleData = {
    title?: string;
    description?: string;
    categoryName?: string;
    street?: string;
    city?: string;
    state?: string;
    phone?: string;
    phoneUnformatted?: string;
    website?: string;
    totalScore?: number;
    reviewsCount?: number;
    price?: string;
    imageUrl?: string;
    popularTimesHistogram?: Record<string, Array<{
        hour: number;
        occupancyPercent: number;
    }>>;
    reviewsTags?: Array<{
        title: string;
        count: number;
    }>;
    placesTags?: Array<{
        title: string;
        count: number;
    }>;
    categories?: string[];
    additionalInfo?: {
        Highlights?: Record<string, boolean>;
        Offerings?: Record<string, boolean>;
        Accessibility?: Array<Record<string, boolean>>;
        Amenities?: Record<string, boolean>;
    };
};

type AlcoholData = {
    [key: string]: boolean | string;
};

const getVenueAlcohol = (fsqData: FSQData, gData: GoogleData[]): boolean | null => {
    // init array of search queries
    const searchQueries = ['Cocktail', 'Bar', 'cocktails', 'full_bar', 'Great cocktails', 'Great wine list', 'Alcohol', 'Beer', 'Cocktails', 'Hard liquor', 'Wine', 'Bar onsite', 'Great beer selection', 'Great cocktails', 'Spirits', 'Happy-hour drinks',];
    // direct search for potential quick exit
    if (fsqData?.categories?.[0]?.short_name && searchQueries.includes(fsqData.categories[0].short_name) || gData[0]?.categories?.includes('Bar')) return true;
    // create obj of kvp's from objs that contain relevant data
    const alcoholData: AlcoholData = {
        ...(fsqData?.features?.food_and_drink?.alcohol || {}),
        ...(gData[0]?.additionalInfo?.Highlights || {}),
        ...(gData[0]?.additionalInfo?.Offerings || {}),
        ...(gData[0]?.additionalInfo?.Amenities || {}),
        ...(fsqData?.categories?.[0] || {}),
    }
    // iterate through obj searching for a searchQuery that has true value
    for (let key in alcoholData) {
        if (searchQueries.includes(key) && alcoholData[key]) {
            return true;
        }
    }
    return null;
};

const getVenueRating = (fsqData: FSQData, gData: GoogleData[]) => {
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

// convert gData histogram to day and hour for busiest time
const getPopularTime = (gData: GoogleData[]) => {
    // convert google popular time histogram into most popular day and hour - may eventually want to change this to save more data in the future
    if (gData.length > 0) { // Check if gData has elements
        let mostBusy = 0;
        let peakDay: any = '';
        let peakHour = 0;

        // iterate over through object
        for (const data of gData) {
            // check if populartimeshistogram data exists
            if (data.popularTimesHistogram) {
                for (const day in data.popularTimesHistogram) {
                    // get array of hours for current day
                    const hours = data.popularTimesHistogram[day];
                    // iterate through each hour in day
                    hours.forEach((hourData: any) => {
                        // update variables
                        if (hourData.occupancyPercent > mostBusy) {
                            mostBusy = hourData.occupancyPercent;
                            peakDay = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'].indexOf(day);
                            peakHour = hourData.hour;
                        }
                    });
                }
            }
        }
        const date = dayjs().day(peakDay).hour(peakHour);

        return date.toDate();
    }
    return null;
}


const formatPhoneNumber = (fsqData: FSQData, gData: GoogleData[]) => {
    let phoneNumber;
    // reassign phoneNumber to api res value
    if (fsqData?.tel) {
        phoneNumber = fsqData.tel;
    } else if (gData[0]?.phone) {
        phoneNumber = gData[0].phone;
    } else if (gData[0]?.phoneUnformatted) {
        phoneNumber = gData[0].phoneUnformatted;
    } else {
        return null;
    }
    // remove non digit chars
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    // check the cleaned format to ensure its valid (optional leading 1, three digits, next three digits, and last four digits)
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    // if valid
    if (match) {
        return cleaned;
    }
    return null;
}


const getVenueAccessibility = (gData: GoogleData[]) => {
    if (!gData?.[0]?.additionalInfo?.Accessibility) return null;
    for (let item of gData[0].additionalInfo.Accessibility) {
        for (let key in item) {
            if (key.includes('Wheelchair') && item[key]) {
                return true;
            }
        }
    }
    return null;
}

// accumulate total number of reviews
const getVenueReviewCount = (fsqData: FSQData, gData: GoogleData[]) => {
    let count = 0;
    if (fsqData?.stats?.total_ratings) {
        count += fsqData.stats.total_ratings;
    }
    if (gData?.[0]?.reviewsCount) {
        count += gData[0].reviewsCount;
    }
    return count || null; // return null if count is 0 (falsey)
}


type VenueImage = {
    url: string;
    source: 'google' | 'foursquare';
}


const getVenueImages = (fsqData: FSQData, gData: GoogleData[]): VenueImage[] | null => {
    let images: VenueImage[] = [];

    if (fsqData?.photos) {
        fsqData.photos.forEach((photo) => {
            images.push({
                url: `${photo.prefix}original${photo.suffix}`, // fsq data requires size format inbetwen prefix and suffix
                source: 'foursquare', // keep source to compare image quality across data providers
            })
        })
    };

    // do the same with gData
    if (gData?.[0]?.imageUrl) {
        images.push({
            url: gData[0].imageUrl,
            source: 'google'
        })
    }

    // return array of image objs or null
    return images.length > 0 ? images : null;
}


type VenueType = {
    id: number | null;
    name: string | null;
    description?: string | null;
    category?: string | null;
    street_address?: string | null;
    city_name?: string | null;
    state_name?: string | null;
    phone?: string | null;
    website?: string | null;
    rating?: string | number | null | undefined;
    total_reviews?: number | null;
    pricing: string | null
    popularTime?: Date | null;
    peak_hour?: Date | null;
    wheelchair_accessible?: boolean | null;
    serves_alcohol?: boolean | null;
    fsq_id?: string | null;
    google_place_id?: string | null;
};


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


        // console.log('-----START OF FSQ DATA HERE ------');
        // console.log(JSON.stringify(fsqData, null, 2));
        // console.log('-----START OF GDATA HERE------')
        // console.log(JSON.stringify(gData, null, 2));
        // console.log('this should have stuff: ', gData?.[0]?.description)
        const buildVenue: VenueType = {
            id: null,
            name: fsqData?.name || gData?.[0]?.title || null,
            description: gData?.[0]?.description || fsqData?.description || null,
            category: gData?.[0]?.categoryName || fsqData.categories[0]?.name || null,
            street_address: gData?.[0]?.street || fsqData?.location?.address || null,
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


        res.json(newVenue);
    } catch (error) {
        console.error('Error creating venue record in DB', error);
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
