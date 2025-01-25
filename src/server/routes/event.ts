import { Router, Request, Response } from 'express';
import Category from '../db/models/categories';
import Event from '../db/models/events';
import Venue from '../db/models/venues';
import Chatroom from '../db/models/chatrooms';
import Interest from '../db/models/interests';
import { Model } from "sequelize"; //

const eventRouter = Router();

eventRouter.post('/', async (req: any, res: Response) => {
    const {title, description, startDate, endDate, startTime, endTime, venue, interests, category} = req.body;
    const userId = req.user.id;
    const address = 'test address 1234st.';
  
    try {
      // create venue
      const newVenue: any = await Venue.create({
        name: venue,
        description: 'test venue description :{'
      });
  
      // then create the event 
      const newEvent: any = await Event.create({
        title,
        start_time: startTime,
        end_time: endTime,
        address,
        description,
        created_by: userId, 
      });
  
      // add venue_id to new venue
      await newEvent.setVenue(newVenue);
  
      // find matching category
      const assignCategory: any = await Category.findOne({
        where: { name: category }
      });
  
      // confirm matching category located in db
      if (assignCategory) {
        // add category_id to new event
        await newEvent.setCategory(assignCategory);
      }
  
      // find matching interests
      const findInterest: any[] = await Interest.findAll({
        where: { name: interests }
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

export default eventRouter;
