import { Router, Request, Response } from 'express';
import Event from '../db/models/events';
import User_Event from '../db/models/users_events';

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
  // Query DB for all event objects
  Event.findAll()
    // Success: set Status: 200 & send the array of event objects
    .then((events: object[]) => {
      res.status(200);
      res.send(events);
    })
    // Failure: Log error & send Status: 500
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
  // Build object to query and insert new data into the database
  const user_id = req.user.id;
  const event_id = req.params.id;

  // Query the User_Events table and insert the newAttendEvent
  User_Event.findOrCreate({
    where: { user_id, event_id },
    defaults: { user_id, event_id },
  })
    // Success
    .then(() => {
      // Send Status: 201
      res.sendStatus(200);
    })
    // Failue, log error and send Status: 500
    .catch((err: unknown) => {
      console.error('Failed to findOrCreate User_Event:', err);
      res.sendStatus(500);
    });
});

/*
  GET /api/event/attend
*/
event2Router.post('/attend', (req: Request, res: Response) => {

});

export default event2Router;
