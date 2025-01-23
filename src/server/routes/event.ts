// @ts-nocheck


import {Router, Request, Response} from 'express';
import Category from '../db/models/categories';
import User from '../db/models/users';
import Event from '../db/models/events';
import Venue from '../db/models/events';
import Chatroom from '../db/models/events';

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

        const newVenue = await Venue.create({
            name: venue,
            description: 'test venue description',
        });

        const chatroom = await Chatroom.create({
            map: null,
            event_id: null,
        });


        console.log('actual content: ', req.body);
        console.log('req.user', req.user);
        console.log('this should be user id too: ', userId);
        const newEvent = await Event.create({
            title: title,
            start_time: startTime,
            end_time: endTime,
            address: address,
            description: description,
            venue_id: newVenue.id,
        });

        await chatroom.update({
            event_id: newEvent.event_id,
        });
        await newEvent.update({
            chatroom_id: chatroom.id,
        });


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
