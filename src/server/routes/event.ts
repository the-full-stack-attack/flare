import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import database from '../db/index';
import Interest from '../db/models/interests';

const eventRouter = Router();


eventRouter.post('/', async (req: any, res: any) => {
    const {title, description, startDate, endDate, startTime, endTime, venue, interests, category} = req.body
    const userGoogleId = req.user.google_id;
    const userName = req.user.username;
    const userId = req.user.id;
    const address = 'test address 1234st.';
    console.log(userId);

    try {
        // Managed Transactions - if any operation fails, Sequelize will rollback automatically. Either ALL succeed or NONE succeed.
        const result = await database.transaction(async t => {

            // Create venue first since Event has venue_id foreign key - Event.belongsTo(Venue)
            const newVenue = await Venue.create({
                    name: venue,
                    description: 'test venue description :{',
                },
                {transaction: t},
            );

            // Create Event
            const newEvent = await Event.create({
                    title: title,
                    start_time: startTime,
                    end_time: endTime,
                    address: address,
                    description: description,
                },
                {transaction: t},
            );

            // Set venue_id column in Events table to newVenue.id - Event.belongsTo(Venue)
            await newEvent.setVenue(newVenue,
                {transaction: t}
            );

            // Query DB to find Category name - Event can only have one category
            const assignCategory = await Category.findOne({
                    where: {name: category}
                }, {transaction: t}
            );

            // Set category_id in Event to assignCategory.id
            await newEvent.setCategory(assignCategory,
                {transaction: t}
            );

            // Find all matching Interests
            const findInterest = await Interest.findAll({
                    where: {name: interests}
                }, {transaction: t}
            );


            // Update Event_Interest join table with event_id and interest_id
            await newEvent.setInterests(findInterest, // Event.belongsToMany(Interest), which means we use setInterests vs setInterest
                {transaction: t}
            );


            // Create Chatroom
            const chatroom = await Chatroom.create({
                    map: null,
                    event_id: null,
                },
                {transaction: t}
            );

            // Set event_id in Chatroom to newEvent.id
            await chatroom.setEvent(newEvent,
                {transaction: t}
            );
        })
        res.sendStatus(200);

    } catch (error) {
        console.error('Error adding new event to DB', error);
        res.sendStatus(500);
    }
});

eventRouter.get('/categories', async (req: Request, res: Response) => {
    try {
        const allCategories = await Category.findAll();
        const data = allCategories.map((category) => ({
            name: category.dataValues.name,
            id: category.dataValues.id,
        }));
        res.send(data).status(200);
    } catch (error) {
        console.error('Error getting categories from DB', error);
        res.sendStatus(500);
    }
});


export default eventRouter;
