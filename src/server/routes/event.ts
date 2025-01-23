// @ts-nocheck


import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import User from '../db/models/users';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import {Sequelize} from 'sequelize';
import database from '../db/index';
import Event_Category from '../db/models/events_categories';
import Event_Interest from '../db/models/events_interests';
import Interest from '../db/models/interests';

const eventRouter = Router();
// Coltron


eventRouter.post('/', async (req: any, res: any) => {
    const {title, description, startDate, endDate, startTime, endTime, venue, interests, category} = req.body
    const userGoogleId = req.user.google_id;
    const userName = req.user.username;
    const userId = req.user.id;
    const address = 'test address 1234st.';
    console.log(userId);

    try {

        const result = await database.transaction(async t => { // docs have sequelize but its really instance name >.<
            const newVenue = await Venue.create({
                    name: venue,
                    description: 'test venue description :{',
                },
                {transaction: t},
            )

            const assignCategory = await Category.findOne({
                    where: {name: category}
                }, {transaction: t}
            );


            const newEvent = await Event.create({
                    title: title,
                    start_time: startTime,
                    end_time: endTime,
                    address: address,
                    description: description,
                    venue_id: newVenue.id,
                    category_id: assignCategory.id
                },
                {transaction: t},
            );

            await newEvent.setVenue(newVenue,
                {transaction: t}
            );

            const findInterest = await Interest.findAll({
                    where: {name: interests}
                }, {transaction: t}
            );


            await newEvent.setInterests(findInterest,
                {transaction: t}
            );


            const chatroom = await Chatroom.create({
                    map: null,
                    event_id: null,
                },
                {transaction: t}
            );

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
