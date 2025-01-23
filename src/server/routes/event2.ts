import { Op } from 'sequelize';
import { Router, Request, Response } from 'express';
import Event from '../db/models/events';
import User_Event from '../db/models/users_events';
import User from '../db/models/users';

const event2Router = Router();

// type EventData = {
//   id: number;
//   title: string;
//   start_time: Date;
//   end_time: Date;
//   address: string;
//   description: string;
//   venue_id: number;
//   created_by: number;
//   chatroom_id: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

/*
  GET /api/event => Retrieve all events from the database (filter for events near user in future)
*/
event2Router.get('/', (req: Request, res: Response) => {
  // Query DB for all event objects & send them back to the user
  Event.findAll({ where: { start_time: { [Op.gt]: new Date(Date.now()) } } })
    .then((events: object[]) => {
      res.status(200);
      res.send(events);
    })
    .catch((err: Error) => {
      console.error('Failed to GET /events:', err);
      res.sendStatus(500);
    });
});

/*
  POST /api/event/attend => Creates a new entry in the User_Tasks table:
    - Tracks the events a user is attending
    - req.user => { id } (user_id)
    - req.params => { id } (event_id)
*/
event2Router.post('/attend/:id', (req: any, res: Response) => {
  // UserId and EventId are needed to create new entry ing User_Tasks table
  const UserId = req.user.id;
  const EventId = req.params.id;

  /*
    Query the User_Events table and insert the new Attended Event
      - findOrCreate is being used to avoid duplicate entries.
  */
  User_Event.findOrCreate({
    where: { UserId, EventId },
    defaults: { UserId, EventId },
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err: unknown) => {
      console.error('Failed to findOrCreate User_Event:', err);
      res.sendStatus(500);
    });
});

/*
  GET /api/event/attend => Retrieve all events the user is attending from the User_Events table
*/
event2Router.get('/attend/:isAttending', (req: any, res: Response) => {
  let isAttending = true;

  if (req.params.isAttending === 'false') {
    isAttending = false;
  }

  User.findOne({
    where: {
      id: req.user.id,
    },
    include: {
      model: Event,
      where: { start_time: { [Op.gt]: new Date(Date.now()) } },
    },
  })
    .then((data) => {
      res.status(200);
      res.send(
        data?.dataValues.Events.filter(
          (event: any) => event.User_Event.user_attending === isAttending
        )
      );
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/event/attend', err);
    });
});

/*
  PATCH /api/event/attending/:id => Update User_Events row's user_attending to the opposite boolean
    - req.params => { id } (for the User_Events row)
*/
event2Router.patch('/attending/:id', async (req: any, res: Response) => {
  try {
    const userEvent: any = await User_Event.findByPk(req.params.id);
    userEvent.user_attending = !userEvent.user_attending;
    await userEvent.save();
    res.sendStatus(200);
  } catch (err: unknown) {
    console.error('Failed to PATCH /api/event/attend/:id', err);
  }
});

export default event2Router;
